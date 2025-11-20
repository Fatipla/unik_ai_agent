import { NextRequest, NextResponse } from 'next/server';
import { db, usersProfile, conversations, messages, emails, paddleCustomers, trainingJobs, voiceCalls } from '@/lib/db';
import { getUserFromHeaders } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { paddle } from '@/lib/paddle';

export async function POST(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { confirmEmail } = await request.json();

    // Verify email confirmation
    if (confirmEmail !== user.email) {
      return NextResponse.json(
        { error: 'Email confirmation does not match' },
        { status: 400 }
      );
    }

    // Get user profile
    const [profile] = await db.select().from(usersProfile).where(eq(usersProfile.userId, user.userId)).limit(1);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Cancel Stripe subscription if exists
    if (profile.stripeCustomerId && stripe) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: profile.stripeCustomerId,
          status: 'active',
        });

        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id);
        }
      } catch (error) {
        console.error('Error canceling Stripe subscription:', error);
      }
    }

    // Delete user data (cascade will handle related records)
    // Order matters due to foreign keys
    await db.delete(voiceCalls).where(eq(voiceCalls.userId, user.userId));
    await db.delete(trainingJobs).where(eq(trainingJobs.userId, user.userId));
    await db.delete(stripeCustomers).where(eq(stripeCustomers.userId, user.userId));
    await db.delete(emails).where(eq(emails.userId, user.userId));
    
    // Delete messages through conversations
    const userConversations = await db.select({ id: conversations.id })
      .from(conversations)
      .where(eq(conversations.userId, user.userId));
    
    for (const conv of userConversations) {
      await db.delete(messages).where(eq(messages.conversationId, conv.id));
    }
    
    await db.delete(conversations).where(eq(conversations.userId, user.userId));
    await db.delete(usersProfile).where(eq(usersProfile.userId, user.userId));

    return NextResponse.json({
      success: true,
      message: 'Account and all associated data have been permanently deleted',
    });
  } catch (error: any) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
