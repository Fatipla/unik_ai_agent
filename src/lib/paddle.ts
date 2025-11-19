import { Paddle, Environment } from '@paddle/paddle-node-sdk';
import { env } from './env';

// Ensure this never runs on client
if (typeof window !== 'undefined') {
  throw new Error('paddle.ts must only be imported on the server');
}

// Initialize Paddle client (singleton)
export const paddle = env.PADDLE_CLIENT_ID && env.PADDLE_CLIENT_SECRET
  ? new Paddle(env.PADDLE_CLIENT_ID, {
      environment: env.PADDLE_ENV === 'live' ? Environment.production : Environment.sandbox,
      clientSecret: env.PADDLE_CLIENT_SECRET,
    })
  : null;

// Paddle Product/Price IDs (configured via ENV or database)
export interface PaddlePlan {
  name: 'starter' | 'pro' | 'business';
  displayName: string;
  priceId: string;
  productId: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  trialDays: number;
  features: {
    conversations: number;
    voiceAgentMinutes: number;
    whatsappIntegration: boolean;
    apiAccess: boolean;
    advancedAnalytics: boolean;
    dedicatedSupport: boolean;
  };
}

// Helper to get plan info from Paddle price ID
export function getPlanFromPaddlePriceId(priceId: string, plans: PaddlePlan[]): PaddlePlan | null {
  return plans.find(p => p.priceId === priceId) || null;
}

export async function getPaddlePlans(): Promise<PaddlePlan[]> {
  // In production, fetch from database (paddle_prices table)
  // For now, use environment variables
  return [
    {
      name: 'starter',
      displayName: 'Starter',
      priceId: env.PADDLE_PRICE_STARTER || 'pri_01j...',
      productId: env.PADDLE_PRODUCT_STARTER || 'pro_01j...',
      amount: 1999, // €19.99
      currency: 'EUR',
      interval: 'month',
      trialDays: 7,
      features: {
        conversations: 500,
        voiceAgentMinutes: 0,
        whatsappIntegration: false,
        apiAccess: true,
        advancedAnalytics: false,
        dedicatedSupport: false,
      },
    },
    {
      name: 'pro',
      displayName: 'Pro',
      priceId: env.PADDLE_PRICE_PRO || 'pri_01j...',
      productId: env.PADDLE_PRODUCT_PRO || 'pro_01j...',
      amount: 2999, // €29.99
      currency: 'EUR',
      interval: 'month',
      trialDays: 7,
      features: {
        conversations: 1500,
        voiceAgentMinutes: 60,
        whatsappIntegration: true,
        apiAccess: true,
        advancedAnalytics: true,
        dedicatedSupport: false,
      },
    },
    {
      name: 'business',
      displayName: 'Business',
      priceId: env.PADDLE_PRICE_BUSINESS || 'pri_01j...',
      productId: env.PADDLE_PRODUCT_BUSINESS || 'pro_01j...',
      amount: 3999, // €39.99
      currency: 'EUR',
      interval: 'month',
      trialDays: 14,
      features: {
        conversations: -1, // unlimited
        voiceAgentMinutes: -1, // unlimited
        whatsappIntegration: true,
        apiAccess: true,
        advancedAnalytics: true,
        dedicatedSupport: true,
      },
    },
  ];
}
