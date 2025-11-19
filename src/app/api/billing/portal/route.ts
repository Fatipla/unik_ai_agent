import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeaders } from '@/lib/auth';
import { paddle } from '@/lib/paddle';
import { db, usersProfile } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!env.PADDLE_ENABLED || !paddle) {
    return NextResponse.json({
      portalUrl: 'https://billing.paddle.com/demo',
      stubbed: true,
      message: 'Paddle not enabled.',
    });
  }

  try {
    // Get user profile with Paddle customer ID
    const [profile] = await db.select()
      .from(usersProfile)
      .where(eq(usersProfile.userId, user.userId))
      .limit(1);

    if (!profile || !profile.paddleCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found' },
        { status: 404 }
      );
    }

    // Generate customer portal session
    const portalSession = await paddle.customers.getPortalSession(
      profile.paddleCustomerId,
      {
        returnUrl: `${env.SITE_URL}/dashboard/billing`,
      }
    );

    return NextResponse.json({
      portalUrl: portalSession.urls.overview,
    });
  } catch (error: any) {
    console.error('[Paddle Portal Error]:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session', details: error.message },
      { status: 500 }
    );
  }
}
