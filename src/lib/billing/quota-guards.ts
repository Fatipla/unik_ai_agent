import { db, usersProfile, paddleCustomers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { PLAN_LIMITS } from '@/lib/pricing';

export async function checkConversationQuota(userId: string): Promise<{ allowed: boolean; message?: string }> {
  const [profile] = await db.select()
    .from(usersProfile)
    .where(eq(usersProfile.userId, userId))
    .limit(1);

  if (!profile) {
    return { allowed: false, message: 'User not found' };
  }

  // Check if user hit usage ceiling
  if (profile.usageCeilHit) {
    return { 
      allowed: false, 
      message: 'Usage limit reached. Please upgrade your plan or wait for the next billing cycle.' 
    };
  }

  // Check plan limits
  const limits = PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS];
  if (profile.usagePrompts >= limits.maxPrompts) {
    return {
      allowed: false,
      message: `Monthly limit of ${limits.maxPrompts} conversations reached. Upgrade to continue.`
    };
  }

  // Check subscription status
  const [customer] = await db.select()
    .from(paddleCustomers)
    .where(eq(paddleCustomers.userId, userId))
    .limit(1);

  if (customer && customer.status !== 'active' && customer.status !== 'trialing') {
    return {
      allowed: false,
      message: 'Your subscription is not active. Please update your payment method.'
    };
  }

  return { allowed: true };
}

export async function checkVoiceQuota(userId: string): Promise<{ allowed: boolean; message?: string }> {
  const [profile] = await db.select()
    .from(usersProfile)
    .where(eq(usersProfile.userId, userId))
    .limit(1);

  if (!profile) {
    return { allowed: false, message: 'User not found' };
  }

  if (!profile.aiVoiceEnabled) {
    return { allowed: false, message: 'Voice agent not enabled for your plan' };
  }

  // Add voice-specific quota checks here
  return { allowed: true };
}

export async function checkFeatureAccess(userId: string, feature: 'api' | 'analytics' | 'whatsapp'): Promise<boolean> {
  const [profile] = await db.select()
    .from(usersProfile)
    .where(eq(usersProfile.userId, userId))
    .limit(1);

  if (!profile) return false;

  const plan = profile.plan;

  switch (feature) {
    case 'api':
      return plan !== 'free';
    case 'analytics':
      return plan === 'pro' || plan === 'business';
    case 'whatsapp':
      return plan === 'pro' || plan === 'business';
    default:
      return false;
  }
}
