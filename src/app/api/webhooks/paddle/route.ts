import { NextRequest, NextResponse } from 'next/server';
import { paddle } from '@/lib/paddle';
import { db, usersProfile, webhooksLog, paddleCustomers, paddleInvoices, paddlePayments, paddlePrices } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';
import { env } from '@/lib/env';

async function verifyPaddleSignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    // Parse Paddle signature format: ts=timestamp;h1=hash
    const parts = signature.split(';').reduce((acc: any, part) => {
      const [key, value] = part.split('=');
      acc[key] = value;
      return acc;
    }, {});

    const timestamp = parts.ts;
    const hash = parts.h1;

    // Verify timestamp is within 5 minutes
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp)) > 300) {
      return false;
    }

    // Compute expected hash
    const crypto = await import('crypto');
    const payload = `${timestamp}:${body}`;
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return hash === expectedHash;
  } catch (err) {
    console.error('[Paddle] Signature verification error:', err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!env.PADDLE_ENABLED || !paddle) {
    return NextResponse.json({ received: true, stubbed: true });
  }

  const body = await request.text();
  const signature = request.headers.get('paddle-signature');

  if (!signature) {
    console.error('[Paddle Webhook] No signature header');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  // Verify webhook signature
  let event: any;
  try {
    event = JSON.parse(body);
    // Paddle SDK verification (simplified - adjust to actual SDK method)
    const isValid = await verifyPaddleSignature(body, signature, env.PADDLE_WEBHOOK_SECRET);
    if (!isValid) {
      throw new Error('Invalid signature');
    }
  } catch (err: any) {
    console.error('[Paddle Webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const payloadHash = createHash('sha256').update(body).digest('hex');
  const [existing] = await db.select()
    .from(webhooksLog)
    .where(eq(webhooksLog.payloadHash, payloadHash))
    .limit(1);

  if (existing) {
    console.log('[Paddle Webhook] Duplicate event:', event.event_id);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Log webhook
  const [webhookLog] = await db.insert(webhooksLog).values({
    provider: 'paddle',
    eventType: event.event_type,
    payloadHash,
    status: 'processing',
    retries: 0,
  }).returning();

  try {
    const eventType = event.event_type;
    const eventData = event.data;

    switch (eventType) {
      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.resumed':
        await handleSubscriptionEvent(eventData);
        break;

      case 'subscription.paused':
        await handleSubscriptionPaused(eventData);
        break;

      case 'subscription.canceled':
        await handleSubscriptionCanceled(eventData);
        break;

      case 'subscription.payment_method.updated':
        await handlePaymentMethodUpdated(eventData);
        break;

      case 'transaction.completed':
        await handleTransactionCompleted(eventData);
        break;

      case 'transaction.payment_failed':
        await handlePaymentFailed(eventData);
        break;

      case 'transaction.chargeback':
        await handleChargeback(eventData);
        break;

      case 'refund.created':
        await handleRefundCreated(eventData);
        break;

      case 'invoice.issued':
      case 'invoice.paid':
        await handleInvoiceEvent(eventData, eventType);
        break;

      default:
        console.log('[Paddle Webhook] Unhandled event type:', eventType);
    }

    // Mark as processed
    await db.update(webhooksLog)
      .set({ status: 'processed' })
      .where(eq(webhooksLog.id, webhookLog.id));

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Paddle Webhook] Processing error:', error);
    
    // Mark as failed and increment retry counter
    await db.update(webhooksLog)
      .set({ 
        status: 'failed',
        retries: webhookLog.retries + 1
      })
      .where(eq(webhooksLog.id, webhookLog.id));

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle subscription created/updated/resumed
async function handleSubscriptionEvent(subscription: any) {
  const customerId = subscription.customer_id;
  const subscriptionId = subscription.id;
  const priceId = subscription.items[0]?.price?.id;
  const status = subscription.status;

  if (!priceId) return;

  // Get plan info from database
  const [price] = await db.select()
    .from(paddlePrices)
    .where(eq(paddlePrices.priceId, priceId))
    .limit(1);

  if (!price) {
    console.error('[Paddle] Price not found:', priceId);
    return;
  }

  // Find user by Paddle customer ID
  const [profile] = await db.select()
    .from(usersProfile)
    .where(eq(usersProfile.paddleCustomerId, customerId))
    .limit(1);

  if (profile) {
    // Update user plan
    await db.update(usersProfile)
      .set({
        plan: price.planName as any,
        billingInterval: price.interval as any,
        activePriceId: priceId,
        usageCeilHit: false, // Reset on subscription change
        updatedAt: new Date(),
      })
      .where(eq(usersProfile.userId, profile.userId));

    // Update paddle_customers table
    await db.insert(paddleCustomers).values({
      userId: profile.userId,
      customerId,
      subscriptionId,
      priceId,
      status,
      currentPeriodEnd: subscription.current_billing_period?.ends_at ? new Date(subscription.current_billing_period.ends_at) : null,
      cancelAt: subscription.scheduled_change?.action === 'cancel' ? new Date(subscription.scheduled_change.effective_at) : null,
    }).onConflictDoUpdate({
      target: paddleCustomers.userId,
      set: {
        subscriptionId,
        priceId,
        status,
        currentPeriodEnd: subscription.current_billing_period?.ends_at ? new Date(subscription.current_billing_period.ends_at) : null,
        cancelAt: subscription.scheduled_change?.action === 'cancel' ? new Date(subscription.scheduled_change.effective_at) : null,
        updatedAt: new Date(),
      },
    });

    console.log('[Paddle Webhook] Updated subscription for user:', profile.email, price.planName);
  }
}

// Handle subscription canceled
async function handleSubscriptionCanceled(subscription: any) {
  const customerId = subscription.customer_id;

  const [profile] = await db.select()
    .from(usersProfile)
    .where(eq(usersProfile.paddleCustomerId, customerId))
    .limit(1);

  if (profile) {
    await db.update(usersProfile)
      .set({
        plan: 'free',
        billingInterval: 'monthly',
        activePriceId: null,
        updatedAt: new Date(),
      })
      .where(eq(usersProfile.userId, profile.userId));

    console.log('[Paddle Webhook] Subscription canceled for user:', profile.email);
  }
}

async function handleSubscriptionPaused(subscription: any) {
  const customerId = subscription.customer_id;

  const [profile] = await db.select()
    .from(usersProfile)
    .where(eq(usersProfile.paddleCustomerId, customerId))
    .limit(1);

  if (profile) {
    await db.update(paddleCustomers)
      .set({
        status: 'paused',
        updatedAt: new Date(),
      })
      .where(eq(paddleCustomers.userId, profile.userId));

    console.log('[Paddle Webhook] Subscription paused for user:', profile.email);
  }
}

async function handlePaymentMethodUpdated(subscription: any) {
  const customerId = subscription.customer_id;

  const [profile] = await db.select()
    .from(usersProfile)
    .where(eq(usersProfile.paddleCustomerId, customerId))
    .limit(1);

  if (profile) {
    console.log('[Paddle Webhook] Payment method updated for user:', profile.email);
    // Additional logic if needed (e.g., clear dunning flags)
  }
}

// Handle transaction completed (payment succeeded)
async function handleTransactionCompleted(transaction: any) {
  const customerId = transaction.customer_id;

  const [profile] = await db.select()
    .from(usersProfile)
    .where(eq(usersProfile.paddleCustomerId, customerId))
    .limit(1);

  if (profile) {
    // Store payment record
    await db.insert(paddlePayments).values({
      userId: profile.userId,
      paymentId: transaction.id,
      subscriptionId: transaction.subscription_id || null,
      amount: parseInt(transaction.details.totals.total),
      currency: transaction.currency_code,
      status: 'completed',
    });

    console.log('[Paddle Webhook] Payment succeeded:', transaction.id);
  }
}

// Handle payment failed
async function handlePaymentFailed(transaction: any) {
  const customerId = transaction.customer_id;

  const [profile] = await db.select()
    .from(usersProfile)
    .where(eq(usersProfile.paddleCustomerId, customerId))
    .limit(1);

  if (profile) {
    // Store failed payment
    await db.insert(paddlePayments).values({
      userId: profile.userId,
      paymentId: transaction.id,
      subscriptionId: transaction.subscription_id || null,
      amount: parseInt(transaction.details.totals.total),
      currency: transaction.currency_code,
      status: 'failed',
    });

    // Mark user as over limit if this was an overage charge
    if (transaction.billing_period) {
      await db.update(usersProfile)
        .set({ usageCeilHit: true })
        .where(eq(usersProfile.userId, profile.userId));
    }

    console.log('[Paddle Webhook] Payment failed:', transaction.id);
  }
}

async function handleChargeback(transaction: any) {
  const customerId = transaction.customer_id;

  const [profile] = await db.select()
    .from(usersProfile)
    .where(eq(usersProfile.paddleCustomerId, customerId))
    .limit(1);

  if (profile) {
    // Mark payment as charged back
    await db.update(paddlePayments)
      .set({ status: 'charged_back' })
      .where(eq(paddlePayments.paymentId, transaction.id));

    // Suspend user account
    await db.update(usersProfile)
      .set({
        plan: 'free',
        usageCeilHit: true,
        updatedAt: new Date(),
      })
      .where(eq(usersProfile.userId, profile.userId));

    console.log('[Paddle Webhook] Chargeback received:', transaction.id);
  }
}

async function handleRefundCreated(refund: any) {
  const transactionId = refund.transaction_id;

  // Find the original payment
  const [payment] = await db.select()
    .from(paddlePayments)
    .where(eq(paddlePayments.paymentId, transactionId))
    .limit(1);

  if (payment) {
    // Create refund record (could add separate table if needed)
    await db.insert(paddlePayments).values({
      userId: payment.userId,
      paymentId: refund.id,
      subscriptionId: payment.subscriptionId,
      amount: -parseInt(refund.amount), // Negative for refund
      currency: refund.currency_code,
      status: 'refunded',
    });

    console.log('[Paddle Webhook] Refund created:', refund.id);
  }
}

// Handle invoice events
async function handleInvoiceEvent(invoice: any, eventType: string) {
  const customerId = invoice.customer_id;

  const [profile] = await db.select()
    .from(usersProfile)
    .where(eq(usersProfile.paddleCustomerId, customerId))
    .limit(1);

  if (profile) {
    await db.insert(paddleInvoices).values({
      userId: profile.userId,
      invoiceId: invoice.id,
      invoiceNumber: invoice.number || null,
      amount: parseInt(invoice.totals.total),
      currency: invoice.currency_code,
      status: invoice.status,
      invoiceUrl: invoice.pdf_url || null,
      paidAt: eventType === 'invoice.paid' && invoice.paid_at ? new Date(invoice.paid_at) : null,
    }).onConflictDoUpdate({
      target: paddleInvoices.invoiceId,
      set: {
        status: invoice.status,
        paidAt: eventType === 'invoice.paid' && invoice.paid_at ? new Date(invoice.paid_at) : null,
      },
    });

    console.log('[Paddle Webhook] Invoice event:', eventType, invoice.id);
  }
}
