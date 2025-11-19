import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeaders } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db, usersProfile } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!env.STRIPE_ENABLED || !stripe) {
    return NextResponse.json({
      portalUrl: 'https://billing.stripe.com/demo',
      stubbed: true,
      message: 'Stripe not enabled.',
    });
  }

  try {
    // Get user profile with Stripe customer ID
    const [profile] = await db.select()
      .from(usersProfile)
      .where(eq(usersProfile.userId, user.userId))
      .limit(1);

    if (!profile || !profile.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found' },
        { status: 404 }
      );
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${env.NEXTAUTH_URL}/dashboard/billing`,
    });

    return NextResponse.json({
      portalUrl: session.url,
    });
  } catch (error: any) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
