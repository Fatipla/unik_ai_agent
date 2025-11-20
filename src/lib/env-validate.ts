// Environment variable validation - run at server boot
// Fails fast with clear error if required keys are missing

import { env } from './env';

const REQUIRED_PADDLE_KEYS = [
  'PADDLE_VENDOR_ID',
  'PADDLE_CLIENT_ID',
  'PADDLE_CLIENT_SECRET',
  'PADDLE_WEBHOOK_SECRET',
  'PADDLE_ENV',
] as const;

const REQUIRED_PRICE_KEYS = [
  // Chatbot
  'PRICE_CHATBOT_STANDARD_M',
  'PRICE_CHATBOT_STANDARD_Y',
  'PRICE_CHATBOT_PRO_M',
  'PRICE_CHATBOT_PRO_Y',
  'PRICE_CHATBOT_ENTERPRISE_M',
  'PRICE_CHATBOT_ENTERPRISE_Y',
  // Voice
  'PRICE_VOICE_STANDARD_M',
  'PRICE_VOICE_STANDARD_Y',
  'PRICE_VOICE_PRO_M',
  'PRICE_VOICE_PRO_Y',
  'PRICE_VOICE_ENTERPRISE_M',
  'PRICE_VOICE_ENTERPRISE_Y',
  // Bundle
  'PRICE_BUNDLE_STANDARD_M',
  'PRICE_BUNDLE_STANDARD_Y',
  'PRICE_BUNDLE_PRO_M',
  'PRICE_BUNDLE_PRO_Y',
  'PRICE_BUNDLE_ENTERPRISE_M',
  'PRICE_BUNDLE_ENTERPRISE_Y',
] as const;

export function validateEnv() {
  const missing: string[] = [];

  // Check Paddle core keys
  for (const key of REQUIRED_PADDLE_KEYS) {
    const value = env[key as keyof typeof env];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missing.push(key);
    }
  }

  // Check all 18 price IDs
  for (const key of REQUIRED_PRICE_KEYS) {
    const value = env[key as keyof typeof env];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error('\n❌ MISSING REQUIRED ENVIRONMENT VARIABLES:\n');
    missing.forEach(key => console.error(`  - ${key}`));
    console.error('\n📚 See /docs/PRICING_SETUP.md for configuration guide\n');
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing ${missing.length} required environment variables`);
    } else {
      console.warn('⚠️  Running in dev mode with missing env vars - Paddle features will be stubbed\n');
    }
  } else {
    console.log('✅ All required environment variables present');
  }
}

// Auto-run in production
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  validateEnv();
}
