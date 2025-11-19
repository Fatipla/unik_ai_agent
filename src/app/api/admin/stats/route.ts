import { NextRequest, NextResponse } from 'next/server';
import { db, usersProfile, conversations } from '@/lib/db';
import { sql, gte, and, eq } from 'drizzle-orm';
import { getUserFromHeaders } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Add admin role check
  // if (user.role !== 'admin') {
  //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // }

  try {
    // Users by plan
    const usersByPlan = await db.select({
      plan: usersProfile.plan,
      count: sql<number>`count(*)`,
    })
    .from(usersProfile)
    .groupBy(usersProfile.plan);

    // Total costs by plan
    const costsByPlan = await db.select({
      plan: usersProfile.plan,
      totalCost: sql<number>`sum(${usersProfile.usageCostEur})`,
    })
    .from(usersProfile)
    .groupBy(usersProfile.plan);

    // Users hitting cap
    const capBlocks = await db.select({
      count: sql<number>`count(*)`,
    })
    .from(usersProfile)
    .where(eq(usersProfile.usageCeilHit, true));

    // Daily conversations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyConversations = await db.select({
      date: sql<string>`date(${conversations.createdAt})`,
      count: sql<number>`count(*)`,
    })
    .from(conversations)
    .where(gte(conversations.createdAt, thirtyDaysAgo))
    .groupBy(sql`date(${conversations.createdAt})`)
    .orderBy(sql`date(${conversations.createdAt})`);

    // Top users by usage
    const topUsers = await db.select({
      userId: usersProfile.userId,
      email: usersProfile.email,
      plan: usersProfile.plan,
      costEur: usersProfile.usageCostEur,
      conversations: sql<number>`count(${conversations.id})`,
    })
    .from(usersProfile)
    .leftJoin(conversations, eq(conversations.userId, usersProfile.userId))
    .groupBy(usersProfile.userId, usersProfile.email, usersProfile.plan, usersProfile.usageCostEur)
    .orderBy(sql`sum(${usersProfile.usageCostEur}) desc`)
    .limit(10);

    return NextResponse.json({
      usersByPlan: usersByPlan.map(row => ({
        plan: row.plan,
        count: Number(row.count),
      })),
      costsByPlan: costsByPlan.map(row => ({
        plan: row.plan,
        totalCost: Number(row.totalCost || 0),
      })),
      capBlocks: Number(capBlocks[0]?.count || 0),
      dailyConversations: dailyConversations.map(row => ({
        date: row.date,
        count: Number(row.count),
      })),
      topUsers: topUsers.map(row => ({
        userId: row.userId,
        email: row.email,
        plan: row.plan,
        costEur: Number(row.costEur || 0),
        conversations: Number(row.conversations || 0),
      })),
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
