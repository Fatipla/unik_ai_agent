import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema-nextauth';
import { adminUsers } from '@/lib/db/schema-conversations';
import { customers, subscriptions } from '@/lib/db/schema-billing';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
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
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all users with their subscriptions
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(100);

    // Enrich with subscription data
    const enrichedUsers = await Promise.all(
      allUsers.map(async (user) => {
        const customer = await db.query.customers.findFirst({
          where: eq(customers.userId, user.id),
        });

        let subscription = null;
        if (customer) {
          subscription = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.customerId, customer.id),
          });
        }

        return {
          ...user,
          plan: subscription?.planKey || 'Free',
          status: subscription?.status || 'inactive',
        };
      })
    );

    return NextResponse.json({ users: enrichedUsers });
  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
