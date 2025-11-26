-- Seed Plans with Monthly & Yearly variants
-- Yearly price = 12 × monthly × 0.8 (20% discount)

-- ============================================
-- CHATBOT PLANS
-- ============================================

-- Chatbot Standard Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'chatbot_standard_monthly',
  'chatbot',
  'standard',
  'monthly',
  'EUR',
  19.99,
  '{
    "max_conversations_per_month": 500,
    "max_voice_calls_per_month": 0,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": false,
    "has_n8n_integration": false,
    "has_priority_support": false,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": false,
    "has_call_analytics": false,
    "has_custom_voice_training": false,
    "has_white_label": false,
    "trial_days": 7
  }'
) ON CONFLICT (id) DO NOTHING;

-- Chatbot Standard Yearly (20% off)
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'chatbot_standard_yearly',
  'chatbot',
  'standard',
  'yearly',
  'EUR',
  191.90, -- 19.99 × 12 × 0.8
  '{
    "max_conversations_per_month": 500,
    "max_voice_calls_per_month": 0,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": false,
    "has_n8n_integration": false,
    "has_priority_support": false,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": false,
    "has_call_analytics": false,
    "has_custom_voice_training": false,
    "has_white_label": false,
    "trial_days": 7
  }'
) ON CONFLICT (id) DO NOTHING;

-- Chatbot Pro Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'chatbot_pro_monthly',
  'chatbot',
  'pro',
  'monthly',
  'EUR',
  29.99,
  '{
    "max_conversations_per_month": 1500,
    "max_voice_calls_per_month": 0,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": true,
    "has_n8n_integration": true,
    "has_priority_support": true,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": false,
    "has_call_analytics": false,
    "has_custom_voice_training": false,
    "has_white_label": false
  }'
) ON CONFLICT (id) DO NOTHING;

-- Chatbot Pro Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'chatbot_pro_yearly',
  'chatbot',
  'pro',
  'yearly',
  'EUR',
  287.90, -- 29.99 × 12 × 0.8
  '{
    "max_conversations_per_month": 1500,
    "max_voice_calls_per_month": 0,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": true,
    "has_n8n_integration": true,
    "has_priority_support": true,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": false,
    "has_call_analytics": false,
    "has_custom_voice_training": false,
    "has_white_label": false
  }'
) ON CONFLICT (id) DO NOTHING;

-- Chatbot Enterprise Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'chatbot_enterprise_monthly',
  'chatbot',
  'enterprise',
  'monthly',
  'EUR',
  39.99,
  '{
    "max_conversations_per_month": null,
    "max_voice_calls_per_month": 0,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": true,
    "has_n8n_integration": true,
    "has_priority_support": true,
    "has_dedicated_support": true,
    "has_custom_integrations": true,
    "has_audit_logs": true,
    "has_call_recording": false,
    "has_call_analytics": false,
    "has_custom_voice_training": false,
    "has_white_label": false
  }'
) ON CONFLICT (id) DO NOTHING;

-- Chatbot Enterprise Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'chatbot_enterprise_yearly',
  'chatbot',
  'enterprise',
  'yearly',
  'EUR',
  383.90, -- 39.99 × 12 × 0.8
  '{
    "max_conversations_per_month": null,
    "max_voice_calls_per_month": 0,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": true,
    "has_n8n_integration": true,
    "has_priority_support": true,
    "has_dedicated_support": true,
    "has_custom_integrations": true,
    "has_audit_logs": true,
    "has_call_recording": false,
    "has_call_analytics": false,
    "has_custom_voice_training": false,
    "has_white_label": false
  }'
) ON CONFLICT (id) DO NOTHING;

-- Continue with Voice and Bundle plans...
-- (I'll add these in the next part to keep the file manageable)

DO $$
BEGIN
  RAISE NOTICE 'Plans seeded successfully (Chatbot plans added)';
END $$;
