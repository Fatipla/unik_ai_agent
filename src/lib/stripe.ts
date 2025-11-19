import Stripe from 'stripe';
import { env } from './env';

export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' })
  : null;

export const STRIPE_PRICES = {
  standard_monthly: env.STRIPE_PRICE_STD_M,
  standard_yearly: env.STRIPE_PRICE_STD_Y,
  pro_monthly: env.STRIPE_PRICE_PRO_M,
  pro_yearly: env.STRIPE_PRICE_PRO_Y,
  enterprise_monthly: env.STRIPE_PRICE_ENT_M,
  enterprise_yearly: env.STRIPE_PRICE_ENT_Y,
} as const;

export function getPlanFromPriceId(priceId: string): { plan: string; interval: string } | null {
  const mapping: Record<string, { plan: string; interval: string }> = {
    [STRIPE_PRICES.standard_monthly]: { plan: 'standard', interval: 'monthly' },
    [STRIPE_PRICES.standard_yearly]: { plan: 'standard', interval: 'yearly' },
    [STRIPE_PRICES.pro_monthly]: { plan: 'pro', interval: 'monthly' },
    [STRIPE_PRICES.pro_yearly]: { plan: 'pro', interval: 'yearly' },
    [STRIPE_PRICES.enterprise_monthly]: { plan: 'enterprise', interval: 'monthly' },
    [STRIPE_PRICES.enterprise_yearly]: { plan: 'enterprise', interval: 'yearly' },
  };
  return mapping[priceId] || null;
}
