import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db } from '@/src/lib/db';
import { eq } from 'drizzle-orm';
import { subscriptions, customers } from '@/src/lib/db/schema-billing';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find customer by user_id
    const customer = await db.query.customers.findFirst({
      where: eq(customers.userId, (session.user as any).id),
    });

    if (!customer) {
      return NextResponse.json({
        plan: 'Free',
        status: 'active',
        tier: 'STANDARD',
      });
    }

    // Find active subscription
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.customerId, customer.id),
    });

    if (!subscription) {
      return NextResponse.json({
        plan: 'Free',
        status: 'active',
        tier: 'STANDARD',
      });
    }

    return NextResponse.json({
      plan: subscription.planKey,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      tier: subscription.planKey?.split('_')[1] || 'STANDARD',
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    );
  }
}
