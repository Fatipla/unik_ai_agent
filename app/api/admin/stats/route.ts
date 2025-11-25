import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db } from '@/src/lib/db';
import { users } from '@/src/lib/db/schema-nextauth';
import { subscriptions } from '@/src/lib/db/schema-billing';
import { conversations, voiceCalls, adminUsers } from '@/src/lib/db/schema-conversations';
import { sql, eq, count, sum, gte } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.userId, (session.user as any).id),
    });

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    // Get stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Total users
    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Active subscriptions
    const activeSubsResult = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'));
    const activeSubscriptions = activeSubsResult[0]?.count || 0;

    // Total conversations
    const totalConvsResult = await db.select({ count: count() }).from(conversations);
    const totalConversations = totalConvsResult[0]?.count || 0;

    // Total voice calls
    const totalCallsResult = await db.select({ count: count() }).from(voiceCalls);
    const totalVoiceCalls = totalCallsResult[0]?.count || 0;

    // Recent activity (last 30 days)
    const recentConvsResult = await db
      .select({ count: count() })
      .from(conversations)
      .where(gte(conversations.createdAt, thirtyDaysAgo));
    const recentConversations = recentConvsResult[0]?.count || 0;

    const recentCallsResult = await db
      .select({ count: count() })
      .from(voiceCalls)
      .where(gte(voiceCalls.createdAt, thirtyDaysAgo));
    const recentVoiceCalls = recentCallsResult[0]?.count || 0;

    return NextResponse.json({
      totalUsers,
      activeSubscriptions,
      totalConversations,
      totalVoiceCalls,
      recentActivity: {
        conversations: recentConversations,
        voiceCalls: recentVoiceCalls,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
