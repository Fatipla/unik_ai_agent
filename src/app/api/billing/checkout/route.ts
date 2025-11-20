import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeaders } from '@/lib/auth';
import { paddle } from '@/lib/paddle';
import { db, usersProfile, paddlePrices, paddleCustomers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';

// Price ID mapping helper
function getPriceId(planKey: string, period: 'M' | 'Y'): string {
  const key = `PRICE_${planKey}_${period}` as keyof typeof env;
  const priceId = env[key];
  return typeof priceId === 'string' ? priceId : '';
}

export async function POST(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!env.PADDLE_ENABLED || !paddle) {
    return NextResponse.json({
      checkoutUrl: 'https://paddle.com/checkout/demo',
      stubbed: true,
      message: 'Paddle not enabled. Set PADDLE_ENABLED=true and add API keys.',
    });
  }

  try {
    const { planKey, period, couponCode } = await request.json();

    // Validate inputs
    if (!planKey || !period) {
      return NextResponse.json({ error: 'planKey and period required' }, { status: 400 });
    }

    if (!['M', 'Y'].includes(period)) {
      return NextResponse.json({ error: 'period must be M or Y' }, { status: 400 });
    }

    // Map planKey + period to PRICE_* env var
    const priceId = getPriceId(planKey, period);

    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for ${planKey}_${period}` },
        { status: 400 }
      );
    }

    // Get user profile
    const [profile] = await db.select()
      .from(usersProfile)
      .where(eq(usersProfile.userId, user.userId))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Create or get Paddle customer
    let customerId = profile.paddleCustomerId;
    
    if (!customerId) {
      // Create new Paddle customer
      const customer = await paddle.customers.create({
        email: user.email,
        name: profile.displayName || undefined,
      });
      
      customerId = customer.id;
      
      // Update user profile with customer ID
      await db.update(usersProfile)
        .set({ paddleCustomerId: customerId })
        .where(eq(usersProfile.userId, user.userId));
    }

    // Create checkout transaction with trial
    const transaction = await paddle.transactions.create({
      items: [
        {
          priceId: priceId,
          quantity: 1,
        },
      ],
      customerId: customerId,
      customData: {
        userId: user.userId,
        planKey,
        period,
      },
      discountId: couponCode || undefined,
    });

    return NextResponse.json({
      checkoutUrl: transaction.checkoutUrl,
      transactionId: transaction.id,
    });
  } catch (error: any) {
    console.error('[Paddle Checkout Error]:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}
