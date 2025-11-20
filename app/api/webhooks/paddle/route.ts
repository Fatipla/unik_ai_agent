import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { db } from '@/src/lib/db';
import { webhookEvents, customers, subscriptions } from '@/src/lib/db/schema';
import { eq } from 'drizzle-orm';

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || '';

function verifyPaddleWebhook(signature: string, rawBody: string): boolean {
  if (!PADDLE_WEBHOOK_SECRET) {
    console.warn('PADDLE_WEBHOOK_SECRET not configured');
    return false;
  }

  try {
    const hmac = crypto
      .createHmac('sha256', PADDLE_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(hmac)
    );
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const signature = headersList.get('paddle-signature') || '';
    const rawBody = await req.text();

    // Verify signature
    if (!verifyPaddleWebhook(signature, rawBody)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const { event_id, event_type, data } = payload;

    // Check for duplicate events (idempotency)
    const existingEvent = await db.query.webhookEvents.findFirst({
      where: eq(webhookEvents.eventId, event_id),
    });

    if (existingEvent) {
      console.log(`Duplicate event ${event_id}, skipping`);
      return NextResponse.json({ received: true });
    }

    // Log the event
    await db.insert(webhookEvents).values({
      eventId: event_id,
      type: event_type,
      payload,
      processed: false,
    });

    // Handle different event types
    switch (event_type) {
      case 'checkout.completed':
      case 'transaction.completed':
        await handleCheckoutCompleted(data);
        break;

      case 'subscription.created':
        await handleSubscriptionCreated(data);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(data);
        break;

      case 'subscription.canceled':
        await handleSubscriptionCanceled(data);
        break;

      case 'payment.failed':
        await handlePaymentFailed(data);
        break;

      default:
        console.log(`Unhandled event type: ${event_type}`);
    }

    // Mark event as processed
    await db
      .update(webhookEvents)
      .set({ processed: true })
      .where(eq(webhookEvents.eventId, event_id));

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(data: any) {
  const userId = data.custom_data?.userId;
  const email = data.customer?.email;
  const paddleCustomerId = data.customer_id;

  if (!userId || !email) {
    console.error('Missing user data in checkout.completed');
    return;
  }

  // Create or update customer
  const existingCustomer = await db.query.customers.findFirst({
    where: eq(customers.userId, userId),
  });

  if (!existingCustomer) {
    await db.insert(customers).values({
      userId,
      email,
      paddleCustomerId,
    });
  }
}

async function handleSubscriptionCreated(data: any) {
  const paddleSubscriptionId = data.id;
  const paddleCustomerId = data.customer_id;
  const status = data.status;
  const planKey = data.items?.[0]?.price?.description || 'UNKNOWN';
  const period = data.billing_cycle?.interval === 'year' ? 'Y' : 'M';
  const currentPeriodStart = new Date(data.current_billing_period?.starts_at);
  const currentPeriodEnd = new Date(data.current_billing_period?.ends_at);

  // Find customer
  const customer = await db.query.customers.findFirst({
    where: eq(customers.paddleCustomerId, paddleCustomerId),
  });

  if (!customer) {
    console.error('Customer not found for subscription.created');
    return;
  }

  // Create subscription
  await db.insert(subscriptions).values({
    customerId: customer.id,
    planKey,
    period,
    paddleSubscriptionId,
    status,
    currentPeriodStart,
    currentPeriodEnd,
  });
}

async function handleSubscriptionUpdated(data: any) {
  const paddleSubscriptionId = data.id;
  const status = data.status;
  const currentPeriodStart = new Date(data.current_billing_period?.starts_at);
  const currentPeriodEnd = new Date(data.current_billing_period?.ends_at);

  // Update subscription
  await db
    .update(subscriptions)
    .set({
      status,
      currentPeriodStart,
      currentPeriodEnd,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.paddleSubscriptionId, paddleSubscriptionId));
}

async function handleSubscriptionCanceled(data: any) {
  const paddleSubscriptionId = data.id;
  const cancelAt = data.scheduled_change?.effective_at
    ? new Date(data.scheduled_change.effective_at)
    : new Date();

  // Update subscription
  await db
    .update(subscriptions)
    .set({
      status: 'canceled',
      cancelAt,
      cancelAtPeriodEnd: true,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.paddleSubscriptionId, paddleSubscriptionId));
}

async function handlePaymentFailed(data: any) {
  console.error('Payment failed:', data);
  // Implement notification logic here (email customer, etc.)
}
