import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeaders } from '@/lib/auth';
import { paddle } from '@/lib/paddle';
import { db, usersProfile, paddlePrices, paddleCustomers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';

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
    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID required' }, { status: 400 });
    }

    // Get user profile
    const [profile] = await db.select()
      .from(usersProfile)
      .where(eq(usersProfile.userId, user.userId))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get price details from database
    const [price] = await db.select()
      .from(paddlePrices)
      .where(eq(paddlePrices.priceId, priceId))
      .limit(1);

    if (!price) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
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
      },
      discountId: undefined, // Add discount logic if needed
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
