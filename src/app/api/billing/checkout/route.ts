import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeaders } from '@/lib/auth';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!env.STRIPE_ENABLED || !stripe) {
    return NextResponse.json({
      checkoutUrl: 'https://stripe.com/checkout/demo',
      stubbed: true,
      message: 'Stripe not enabled. Set STRIPE_ENABLED=true and add API keys.',
    });
  }

  try {
    const { priceId, interval } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID required' }, { status: 400 });
    }

    // Create or retrieve Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.userId,
      },
    });

    // Create checkout session with 7-day trial for Standard plan
    const isStandard = priceId === STRIPE_PRICES.standard_monthly || priceId === STRIPE_PRICES.standard_yearly;
    
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: isStandard ? {
        trial_period_days: 7,
      } : undefined,
      success_url: `${env.NEXTAUTH_URL}/dashboard?checkout=success`,
      cancel_url: `${env.NEXTAUTH_URL}/dashboard/billing?checkout=cancelled`,
      metadata: {
        userId: user.userId,
        interval,
      },
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
