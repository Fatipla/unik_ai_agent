import { NextRequest, NextResponse } from 'next/server';
import { db, usersProfile, conversations, messages } from '@/lib/db';
import { getUserFromHeaders } from '@/lib/auth';
import { calculateChatCost, wouldExceedCap, PLAN_LIMITS, getCurrentMonthString } from '@/lib/pricing';
import { createChatCompletion } from '@/lib/openai';
import { eq, and, gte, sql } from 'drizzle-orm';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, sessionId, lang, tone } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Get user profile
    const [profile] = await db.select().from(usersProfile).where(eq(usersProfile.userId, user.userId)).limit(1);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if current month matches profile usage month
    const currentMonth = getCurrentMonthString();
    if (profile.usageMonth !== currentMonth) {
      // Reset monthly usage (normally done by scheduler, but safety check)
      await db.update(usersProfile).set({
        usageMonth: currentMonth,
        usagePrompts: 0,
        usageCompletions: 0,
        usageTokensIn: 0,
        usageTokensOut: 0,
        usageCostEur: '0',
        usageCeilHit: false,
      }).where(eq(usersProfile.userId, user.userId));
      
      profile.usagePrompts = 0;
      profile.usageCostEur = '0';
      profile.usageCeilHit = false;
    }

    // Check usage ceiling
    if (profile.usageCeilHit) {
      return NextResponse.json({
        error: 'Monthly AI cost limit reached',
        upsellHint: `Your ${profile.plan} plan has reached its monthly AI cost limit. Upgrade to continue using AI features.`,
        upgradeUrl: '/dashboard/billing',
      }, { status: 429 });
    }

    // Free plan: check daily limit
    if (profile.plan === 'free') {
      const limits = PLAN_LIMITS.free;
      const today = new Date().toISOString().split('T')[0];
      
      // Count today's chats
      const todayChats = await db.select({ count: sql<number>`count(*)` })
        .from(conversations)
        .where(and(
          eq(conversations.userId, user.userId),
          gte(conversations.createdAt, new Date(today))
        ));

      const chatCount = Number(todayChats[0]?.count || 0);
      
      if (chatCount >= limits.chatsPerDay) {
        return NextResponse.json({
          error: 'Daily chat limit reached',
          upsellHint: 'Upgrade to Standard plan for 500 chats/month and remove daily limits.',
          upgradeUrl: '/dashboard/billing',
        }, { status: 429 });
      }
    }

    // Check if OpenAI is available
    if (!env.OPENAI_API_KEY) {
      return NextResponse.json({
        text: 'AI service is temporarily unavailable. This is a stubbed response for development.',
        tokensIn: 10,
        tokensOut: 15,
        costEur: 0,
        stubbed: true,
      });
    }

    // Get or create conversation
    let conversationId = sessionId;
    let conversation = null;

    if (sessionId) {
      [conversation] = await db.select().from(conversations).where(eq(conversations.id, sessionId)).limit(1);
    }

    if (!conversation) {
      [conversation] = await db.insert(conversations).values({
        userId: user.userId,
        source: 'widget',
        lang: lang || profile.lang,
        tone: tone || profile.tone,
        planSnapshot: profile.plan,
      }).returning();
      conversationId = conversation.id;
    }

    // Get conversation history
    const history = await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    // Build messages for OpenAI
    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful AI assistant. Respond in a ${conversation.tone || 'professional'} tone. Language: ${conversation.lang || 'en'}.`,
    };

    const chatMessages = [
      systemMessage,
      ...history.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.text,
      })),
      { role: 'user' as const, content: message },
    ];

    // Call OpenAI
    const { text, tokensIn, tokensOut } = await createChatCompletion(chatMessages, env.OPENAI_MODEL);

    // Calculate cost
    const cost = calculateChatCost(env.OPENAI_MODEL as any, tokensIn, tokensOut);
    const currentCost = parseFloat(profile.usageCostEur || '0');
    const projectedCost = currentCost + cost;

    // Check if this would exceed cap
    if (wouldExceedCap(profile.plan as any, currentCost, cost)) {
      // Mark usage ceiling hit
      await db.update(usersProfile).set({
        usageCeilHit: true,
      }).where(eq(usersProfile.userId, user.userId));

      return NextResponse.json({
        error: 'Monthly AI cost limit would be exceeded',
        upsellHint: `This request would exceed your ${profile.plan} plan's monthly AI cost limit. Upgrade to continue.`,
        upgradeUrl: '/dashboard/billing',
        costDetails: {
          current: currentCost,
          thisRequest: cost,
          projected: projectedCost,
        },
      }, { status: 429 });
    }

    // Save user message
    await db.insert(messages).values({
      conversationId,
      role: 'user',
      text: message,
      tokensIn: 0,
      tokensOut: 0,
    });

    // Save assistant response
    await db.insert(messages).values({
      conversationId,
      role: 'assistant',
      text,
      tokensIn,
      tokensOut,
    });

    // Update conversation totals
    await db.update(conversations).set({
      tokensIn: sql`${conversations.tokensIn} + ${tokensIn}`,
      tokensOut: sql`${conversations.tokensOut} + ${tokensOut}`,
      costEur: sql`${conversations.costEur} + ${cost}`,
      updatedAt: new Date(),
    }).where(eq(conversations.id, conversationId));

    // Update user usage
    await db.update(usersProfile).set({
      usagePrompts: sql`${usersProfile.usagePrompts} + 1`,
      usageCompletions: sql`${usersProfile.usageCompletions} + 1`,
      usageTokensIn: sql`${usersProfile.usageTokensIn} + ${tokensIn}`,
      usageTokensOut: sql`${usersProfile.usageTokensOut} + ${tokensOut}`,
      usageCostEur: sql`${usersProfile.usageCostEur} + ${cost}`,
      updatedAt: new Date(),
    }).where(eq(usersProfile.userId, user.userId));

    // Calculate usage percentage for warnings
    const usagePercentage = (projectedCost / (wouldExceedCap as any)[profile.plan]) * 100;
    const showWarning = usagePercentage >= 70;

    return NextResponse.json({
      text,
      conversationId,
      tokensIn,
      tokensOut,
      costEur: cost,
      usage: {
        costEur: projectedCost,
        percentage: usagePercentage,
        warning: showWarning,
      },
      upsellHint: showWarning ? `You've used ${usagePercentage.toFixed(0)}% of your monthly AI budget. Consider upgrading.` : undefined,
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
