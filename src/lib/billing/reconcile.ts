import { paddle } from '@/lib/paddle';
import { db, usersProfile, paddleCustomers, paddlePayments } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';

export async function reconcilePaddleData() {
  if (!env.PADDLE_ENABLED || !paddle) {
    console.log('[Reconcile] Paddle not enabled, skipping');
    return;
  }

  console.log('[Reconcile] Starting daily reconciliation');

  // Get all users with Paddle customer IDs
  const profiles = await db.select()
    .from(usersProfile);

  for (const profile of profiles) {
    if (!profile.paddleCustomerId) continue;

    try {
      // Fetch subscription from Paddle
      const [customer] = await db.select()
        .from(paddleCustomers)
        .where(eq(paddleCustomers.userId, profile.userId))
        .limit(1);

      if (!customer || !customer.subscriptionId) continue;

      // Get subscription details from Paddle API
      const subscription = await paddle.subscriptions.get(customer.subscriptionId);

      // Sync subscription status
      if (subscription.status !== customer.status) {
        await db.update(paddleCustomers)
          .set({
            status: subscription.status,
            currentPeriodEnd: subscription.currentBillingPeriod?.endsAt 
              ? new Date(subscription.currentBillingPeriod.endsAt) 
              : null,
            updatedAt: new Date(),
          })
          .where(eq(paddleCustomers.userId, profile.userId));

        console.log(`[Reconcile] Updated subscription status for ${profile.email}: ${subscription.status}`);
      }

      // Sync plan if mismatch
      const priceId = subscription.items[0]?.price?.id;
      if (priceId !== profile.activePriceId) {
        // Fetch plan info from database
        const [priceInfo] = await db.select()
          .from(paddlePrices)
          .where(eq(paddlePrices.priceId, priceId))
          .limit(1);

        if (priceInfo) {
          await db.update(usersProfile)
            .set({
              plan: priceInfo.planName as any,
              activePriceId: priceId,
              updatedAt: new Date(),
            })
            .where(eq(usersProfile.userId, profile.userId));

          console.log(`[Reconcile] Updated plan for ${profile.email}: ${priceInfo.planName}`);
        }
      }
    } catch (error: any) {
      console.error(`[Reconcile] Error for user ${profile.email}:`, error.message);
    }
  }

  console.log('[Reconcile] Daily reconciliation complete');
}

// Run as cron job
export async function GET() {
  await reconcilePaddleData();
  return Response.json({ success: true });
}
