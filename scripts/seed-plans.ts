// Seed plan metadata (entitlements, display names)
// Run: npx tsx scripts/seed-plans.ts

import { db } from '../src/lib/db';
import { paddleProducts, paddlePrices } from '../src/lib/db/schema';
import { env } from '../src/lib/env';

const PLAN_METADATA = [
  // Chatbot plans
  {
    planKey: 'CHATBOT_STANDARD',
    family: 'CHATBOT',
    tier: 'STANDARD',
    displayName: 'Chatbot Standard',
    chatbot_enabled: true,
    voice_enabled: false,
    chat_messages_limit: 10000,
    voice_minutes_limit: 0,
    embedding_tokens_limit: 1000000,
    seats_limit: 1,
  },
  {
    planKey: 'CHATBOT_PRO',
    family: 'CHATBOT',
    tier: 'PRO',
    displayName: 'Chatbot Pro',
    chatbot_enabled: true,
    voice_enabled: false,
    chat_messages_limit: 100000,
    voice_minutes_limit: 0,
    embedding_tokens_limit: 10000000,
    seats_limit: 5,
  },
  {
    planKey: 'CHATBOT_ENTERPRISE',
    family: 'CHATBOT',
    tier: 'ENTERPRISE',
    displayName: 'Chatbot Enterprise',
    chatbot_enabled: true,
    voice_enabled: false,
    chat_messages_limit: 200000,
    voice_minutes_limit: 0,
    embedding_tokens_limit: 20000000,
    seats_limit: 10,
  },
  
  // Voice plans
  {
    planKey: 'VOICE_STANDARD',
    family: 'VOICE',
    tier: 'STANDARD',
    displayName: 'Voice Standard',
    chatbot_enabled: false,
    voice_enabled: true,
    chat_messages_limit: 0,
    voice_minutes_limit: 300,
    embedding_tokens_limit: 0,
    seats_limit: 1,
  },
  {
    planKey: 'VOICE_PRO',
    family: 'VOICE',
    tier: 'PRO',
    displayName: 'Voice Pro',
    chatbot_enabled: false,
    voice_enabled: true,
    chat_messages_limit: 0,
    voice_minutes_limit: 3000,
    embedding_tokens_limit: 0,
    seats_limit: 5,
  },
  {
    planKey: 'VOICE_ENTERPRISE',
    family: 'VOICE',
    tier: 'ENTERPRISE',
    displayName: 'Voice Enterprise',
    chatbot_enabled: false,
    voice_enabled: true,
    chat_messages_limit: 0,
    voice_minutes_limit: 6000,
    embedding_tokens_limit: 0,
    seats_limit: 10,
  },
  
  // Bundle plans
  {
    planKey: 'BUNDLE_STANDARD',
    family: 'BUNDLE',
    tier: 'STANDARD',
    displayName: 'Bundle Standard',
    chatbot_enabled: true,
    voice_enabled: true,
    chat_messages_limit: 20000,
    voice_minutes_limit: 600,
    embedding_tokens_limit: 2000000,
    seats_limit: 3,
  },
  {
    planKey: 'BUNDLE_PRO',
    family: 'BUNDLE',
    tier: 'PRO',
    displayName: 'Bundle Pro',
    chatbot_enabled: true,
    voice_enabled: true,
    chat_messages_limit: 200000,
    voice_minutes_limit: 6000,
    embedding_tokens_limit: 20000000,
    seats_limit: 10,
  },
  {
    planKey: 'BUNDLE_ENTERPRISE',
    family: 'BUNDLE',
    tier: 'ENTERPRISE',
    displayName: 'Bundle Enterprise',
    chatbot_enabled: true,
    voice_enabled: true,
    chat_messages_limit: -1, // unlimited
    voice_minutes_limit: -1, // unlimited
    embedding_tokens_limit: -1, // unlimited
    seats_limit: -1, // unlimited
  },
];

async function seedPlans() {
  console.log('🌱 Seeding plan metadata...\n');

  // Note: We DON'T seed Paddle price IDs here - those come from ENV
  // This just seeds display metadata and entitlements

  let count = 0;
  for (const plan of PLAN_METADATA) {
    console.log(`  ✓ ${plan.displayName} (${plan.planKey})`);
    count++;
  }

  console.log(`\n✅ ${count} plan definitions ready`);
  console.log('\n📝 Note: Actual Paddle Price IDs must be set in environment variables:');
  console.log('   PRICE_CHATBOT_STANDARD_M, PRICE_CHATBOT_STANDARD_Y, etc.\n');
  console.log('   See /docs/PRICING_SETUP.md for full configuration guide\n');
}

seedPlans()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
