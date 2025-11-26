import { db } from '@/lib/db';
import { usage } from '@/lib/db/schema-nextauth';
import { subscriptions, customers } from '@/lib/db/schema-billing';
import { eq } from 'drizzle-orm';

const PLAN_LIMITS: Record<string, number> = {
  Free: 100,
  STANDARD: 500,
  PRO: 1500,
  ENTERPRISE: -1, // Unlimited
};

export async function canUsePrompt(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  remaining?: number;
}> {
  try {
    // Get user usage
    const userUsage = await db.query.usage.findFirst({
      where: eq(usage.userId, userId),
    });

    if (!userUsage) {
      // Create usage record if doesn't exist
      await db.insert(usage).values({
        userId,
        promptsMonth: 0,
        promptsDay: 0,
      });
      return { allowed: true, remaining: PLAN_LIMITS.Free };
    }

    // Check if we need to reset monthly usage
    const now = new Date();
    const lastReset = userUsage.lastResetMonth ? new Date(userUsage.lastResetMonth) : new Date(0);
    if (
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear()
    ) {
      // Reset monthly usage
      await db
        .update(usage)
        .set({
          promptsMonth: 0,
          lastResetMonth: now,
          updatedAt: now,
        })
        .where(eq(usage.userId, userId));

      userUsage.promptsMonth = 0;
    }

    // Get user's plan
    const customer = await db.query.customers.findFirst({
      where: eq(customers.userId, userId),
    });

    let planTier = 'Free';
    if (customer) {
      const subscription = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.customerId, customer.id),
      });

      if (subscription && subscription.status === 'active') {
        planTier = subscription.planKey?.split('_')[1] || 'STANDARD';
      }
    }

    const limit = PLAN_LIMITS[planTier] || PLAN_LIMITS.Free;

    // Unlimited plan
    if (limit === -1) {
      return { allowed: true };
    }

    // Check if user has exceeded limit
    const promptsMonth = userUsage.promptsMonth || 0;
    if (promptsMonth >= limit) {
      return {
        allowed: false,
        reason: `Monthly limit of ${limit} prompts reached. Upgrade your plan to continue.`,
        remaining: 0,
      };
    }

    return {
      allowed: true,
      remaining: limit - promptsMonth,
    };
  } catch (error) {
    console.error('Usage guard error:', error);
    return { allowed: true }; // Fail open to avoid blocking users
  }
}

export async function incrementUsage(userId: string): Promise<void> {
  try {
    const userUsage = await db.query.usage.findFirst({
      where: eq(usage.userId, userId),
    });

    if (!userUsage) {
      await db.insert(usage).values({
        userId,
        promptsMonth: 1,
        promptsDay: 1,
      });
      return;
    }

    await db
      .update(usage)
      .set({
        promptsMonth: (userUsage.promptsMonth || 0) + 1,
        promptsDay: (userUsage.promptsDay || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(usage.userId, userId));
  } catch (error) {
    console.error('Increment usage error:', error);
  }
}
