-- Seed entitlements (plan metadata)
-- Idempotent - uses ON CONFLICT to avoid duplicates

INSERT INTO entitlements (plan_key, family, tier, features)
VALUES
  -- CHATBOT PLANS
  (
    'CHATBOT_STANDARD',
    'CHATBOT',
    'STANDARD',
    '{
      "chatbot_enabled": true,
      "voice_enabled": false,
      "custom_branding": false,
      "api_access": true,
      "chat_messages_limit": 10000,
      "voice_minutes_limit": 0,
      "embedding_tokens_limit": 1000000,
      "seats_limit": 1,
      "priority_support": false,
      "sso_saml": false
    }'::jsonb
  ),
  (
    'CHATBOT_PRO',
    'CHATBOT',
    'PRO',
    '{
      "chatbot_enabled": true,
      "voice_enabled": false,
      "custom_branding": true,
      "api_access": true,
      "chat_messages_limit": 100000,
      "voice_minutes_limit": 0,
      "embedding_tokens_limit": 10000000,
      "seats_limit": 5,
      "priority_support": true,
      "sso_saml": false
    }'::jsonb
  ),
  (
    'CHATBOT_ENTERPRISE',
    'CHATBOT',
    'ENTERPRISE',
    '{
      "chatbot_enabled": true,
      "voice_enabled": false,
      "custom_branding": true,
      "api_access": true,
      "chat_messages_limit": 200000,
      "voice_minutes_limit": 0,
      "embedding_tokens_limit": 20000000,
      "seats_limit": 10,
      "priority_support": true,
      "sso_saml": true,
      "dedicated_manager": true
    }'::jsonb
  ),

  -- VOICE PLANS
  (
    'VOICE_STANDARD',
    'VOICE',
    'STANDARD',
    '{
      "chatbot_enabled": false,
      "voice_enabled": true,
      "custom_branding": false,
      "api_access": true,
      "chat_messages_limit": 0,
      "voice_minutes_limit": 300,
      "embedding_tokens_limit": 0,
      "seats_limit": 1,
      "priority_support": false,
      "sso_saml": false
    }'::jsonb
  ),
  (
    'VOICE_PRO',
    'VOICE',
    'PRO',
    '{
      "chatbot_enabled": false,
      "voice_enabled": true,
      "custom_branding": true,
      "api_access": true,
      "chat_messages_limit": 0,
      "voice_minutes_limit": 3000,
      "embedding_tokens_limit": 0,
      "seats_limit": 5,
      "priority_support": true,
      "sso_saml": false,
      "custom_voice_profiles": true
    }'::jsonb
  ),
  (
    'VOICE_ENTERPRISE',
    'VOICE',
    'ENTERPRISE',
    '{
      "chatbot_enabled": false,
      "voice_enabled": true,
      "custom_branding": true,
      "api_access": true,
      "chat_messages_limit": 0,
      "voice_minutes_limit": 6000,
      "embedding_tokens_limit": 0,
      "seats_limit": 10,
      "priority_support": true,
      "sso_saml": true,
      "dedicated_manager": true,
      "sla_guarantee": true
    }'::jsonb
  ),

  -- BUNDLE PLANS (Chatbot + Voice)
  (
    'BUNDLE_STANDARD',
    'BUNDLE',
    'STANDARD',
    '{
      "chatbot_enabled": true,
      "voice_enabled": true,
      "custom_branding": true,
      "api_access": true,
      "chat_messages_limit": 20000,
      "voice_minutes_limit": 600,
      "embedding_tokens_limit": 2000000,
      "seats_limit": 3,
      "priority_support": false,
      "sso_saml": false
    }'::jsonb
  ),
  (
    'BUNDLE_PRO',
    'BUNDLE',
    'PRO',
    '{
      "chatbot_enabled": true,
      "voice_enabled": true,
      "custom_branding": true,
      "api_access": true,
      "chat_messages_limit": 200000,
      "voice_minutes_limit": 6000,
      "embedding_tokens_limit": 20000000,
      "seats_limit": 10,
      "priority_support": true,
      "sso_saml": false,
      "webhooks": true,
      "integrations": true
    }'::jsonb
  ),
  (
    'BUNDLE_ENTERPRISE',
    'BUNDLE',
    'ENTERPRISE',
    '{
      "chatbot_enabled": true,
      "voice_enabled": true,
      "custom_branding": true,
      "api_access": true,
      "chat_messages_limit": -1,
      "voice_minutes_limit": -1,
      "embedding_tokens_limit": -1,
      "seats_limit": -1,
      "priority_support": true,
      "sso_saml": true,
      "dedicated_manager": true,
      "sla_guarantee": true,
      "white_label": true
    }'::jsonb
  )
ON CONFLICT (plan_key) 
DO UPDATE SET
  features = EXCLUDED.features,
  updated_at = now();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Entitlements seeded successfully (9 plans)';
END $$;
