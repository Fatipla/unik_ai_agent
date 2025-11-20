import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { paddle } from '@/src/lib/paddle';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    if (!paddle) {
      return NextResponse.json(
        { error: 'Paddle is not configured' },
        { status: 500 }
      );
    }

    // Create checkout session
    const checkout = await paddle.checkouts.create({
      items: [
        {
          priceId,
          quantity: 1,
        },
      ],
      customData: {
        userId: (session.user as any).id,
        email: session.user.email,
      },
      customer: {
        email: session.user.email,
      },
      settings: {
        successUrl: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
        cancelUrl: `${process.env.NEXTAUTH_URL}/pricing?checkout=cancelled`,
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error: any) {
    console.error('Paddle checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
