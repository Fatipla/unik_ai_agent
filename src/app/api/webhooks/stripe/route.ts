import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPlanFromPriceId } from '@/lib/stripe';
import { db, usersProfile, webhooksLog, stripeCustomers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';
import { env } from '@/lib/env';
import { getCurrentMonthString } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  if (!env.STRIPE_ENABLED || !stripe) {
    return NextResponse.json({ received: true, stubbed: true });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Idempotency check
  const payloadHash = createHash('sha256').update(body).digest('hex');
  const existing = await db.select()
    .from(webhooksLog)
    .where(eq(webhooksLog.payloadHash, payloadHash))
    .limit(1);

  if (existing.length > 0) {
    console.log('[WEBHOOK] Duplicate event:', event.id);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Log webhook
  await db.insert(webhooksLog).values({
    provider: 'stripe',
    payloadHash,
    status: 'processing',
    retries: 0,
  });

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as any;
        const customerId = subscription.customer;
        const priceId = subscription.items.data[0]?.price.id;
        const planInfo = getPlanFromPriceId(priceId);

        if (!planInfo) break;

        // Find user by Stripe customer ID
        const [profile] = await db.select()
          .from(usersProfile)
          .where(eq(usersProfile.stripeCustomerId, customerId))
          .limit(1);

        if (profile) {
          // Update user plan
          await db.update(usersProfile)
            .set({
              plan: planInfo.plan as any,
              billingInterval: planInfo.interval as any,
              activePriceId: priceId,
              usageCeilHit: false, // Reset on subscription change
              updatedAt: new Date(),
            })
            .where(eq(usersProfile.userId, profile.userId));

          // Update stripe_customers table
          await db.insert(stripeCustomers).values({
            userId: profile.userId,
            customerId,
            subscriptionId: subscription.id,
            priceId,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          }).onConflictDoUpdate({
            target: stripeCustomers.userId,
            set: {
              subscriptionId: subscription.id,
              priceId,
              status: subscription.status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });

          console.log('[WEBHOOK] Updated subscription for user:', profile.email, planInfo);
        } else {
          // User doesn't exist yet - store customer ID for later linking
          const email = subscription.customer_email || subscription.metadata?.email;
          if (email) {
            const [user] = await db.select()
              .from(usersProfile)
              .where(eq(usersProfile.email, email))
              .limit(1);

            if (user) {
              await db.update(usersProfile)
                .set({
                  stripeCustomerId: customerId,
                  plan: planInfo.plan as any,
                  billingInterval: planInfo.interval as any,
                  activePriceId: priceId,
                  usageCeilHit: false,
                })
                .where(eq(usersProfile.userId, user.userId));
            }
          }
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object as any;
        await db.update(usersProfile)
          .set({
            plan: 'free',
            billingInterval: 'monthly',
            activePriceId: null,
            stripeCustomerId: deletedSub.customer,
          })
          .where(eq(usersProfile.stripeCustomerId, deletedSub.customer));
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as any;
        console.log('[WEBHOOK] Payment succeeded:', invoice.id);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as any;
        console.log('[WEBHOOK] Payment failed:', failedInvoice.id);
        break;
    }

    // Mark as processed
    await db.update(webhooksLog)
      .set({ status: 'processed' })
      .where(eq(webhooksLog.payloadHash, payloadHash));

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[WEBHOOK] Processing error:', error);
    
    // Mark as failed
    await db.update(webhooksLog)
      .set({ status: 'failed' })
      .where(eq(webhooksLog.payloadHash, payloadHash));

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
