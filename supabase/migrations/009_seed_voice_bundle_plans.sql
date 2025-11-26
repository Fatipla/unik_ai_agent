-- Seed Voice Agent and Bundle Plans
-- Continuation of plan seeding

-- ============================================
-- VOICE AGENT PLANS
-- ============================================

-- Voice Standard Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'voice_standard_monthly',
  'voice',
  'standard',
  'monthly',
  'EUR',
  19.99,
  '{
    "max_conversations_per_month": 0,
    "max_voice_calls_per_month": 500,
    "has_widget_api": false,
    "has_kb_training": false,
    "has_basic_analytics": true,
    "has_advanced_analytics": false,
    "has_n8n_integration": false,
    "has_priority_support": false,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": true,
    "has_call_analytics": false,
    "has_custom_voice_training": false,
    "has_white_label": false,
    "trial_days": 7
  }'
) ON CONFLICT (id) DO NOTHING;

-- Voice Standard Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'voice_standard_yearly',
  'voice',
  'standard',
  'yearly',
  'EUR',
  191.90,
  '{
    "max_conversations_per_month": 0,
    "max_voice_calls_per_month": 500,
    "has_widget_api": false,
    "has_kb_training": false,
    "has_basic_analytics": true,
    "has_advanced_analytics": false,
    "has_n8n_integration": false,
    "has_priority_support": false,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": true,
    "has_call_analytics": false,
    "has_custom_voice_training": false,
    "has_white_label": false,
    "trial_days": 7
  }'
) ON CONFLICT (id) DO NOTHING;

-- Voice Pro Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'voice_pro_monthly',
  'voice',
  'pro',
  'monthly',
  'EUR',
  29.99,
  '{
    "max_conversations_per_month": 0,
    "max_voice_calls_per_month": 1500,
    "has_widget_api": false,
    "has_kb_training": false,
    "has_basic_analytics": true,
    "has_advanced_analytics": false,
    "has_n8n_integration": false,
    "has_priority_support": true,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": true,
    "has_call_analytics": true,
    "has_custom_voice_training": true,
    "has_white_label": false
  }'
) ON CONFLICT (id) DO NOTHING;

-- Voice Pro Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'voice_pro_yearly',
  'voice',
  'pro',
  'yearly',
  'EUR',
  287.90,
  '{
    "max_conversations_per_month": 0,
    "max_voice_calls_per_month": 1500,
    "has_widget_api": false,
    "has_kb_training": false,
    "has_basic_analytics": true,
    "has_advanced_analytics": false,
    "has_n8n_integration": false,
    "has_priority_support": true,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": true,
    "has_call_analytics": true,
    "has_custom_voice_training": true,
    "has_white_label": false
  }'
) ON CONFLICT (id) DO NOTHING;

-- Voice Enterprise Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'voice_enterprise_monthly',
  'voice',
  'enterprise',
  'monthly',
  'EUR',
  39.99,
  '{
    "max_conversations_per_month": 0,
    "max_voice_calls_per_month": null,
    "has_widget_api": false,
    "has_kb_training": false,
    "has_basic_analytics": true,
    "has_advanced_analytics": false,
    "has_n8n_integration": false,
    "has_priority_support": true,
    "has_dedicated_support": true,
    "has_custom_integrations": true,
    "has_audit_logs": true,
    "has_call_recording": true,
    "has_call_analytics": true,
    "has_custom_voice_training": true,
    "has_white_label": false
  }'
) ON CONFLICT (id) DO NOTHING;

-- Voice Enterprise Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'voice_enterprise_yearly',
  'voice',
  'enterprise',
  'yearly',
  'EUR',
  383.90,
  '{
    "max_conversations_per_month": 0,
    "max_voice_calls_per_month": null,
    "has_widget_api": false,
    "has_kb_training": false,
    "has_basic_analytics": true,
    "has_advanced_analytics": false,
    "has_n8n_integration": false,
    "has_priority_support": true,
    "has_dedicated_support": true,
    "has_custom_integrations": true,
    "has_audit_logs": true,
    "has_call_recording": true,
    "has_call_analytics": true,
    "has_custom_voice_training": true,
    "has_white_label": false
  }'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- BUNDLE PLANS (Chatbot + Voice)
-- ============================================

-- Bundle Standard Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'bundle_standard_monthly',
  'bundle',
  'standard',
  'monthly',
  'EUR',
  34.99,
  '{
    "max_conversations_per_month": 500,
    "max_voice_calls_per_month": 500,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": false,
    "has_n8n_integration": false,
    "has_priority_support": false,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": true,
    "has_call_analytics": false,
    "has_custom_voice_training": false,
    "has_white_label": false,
    "trial_days": 7,
    "savings_percent": 12
  }'
) ON CONFLICT (id) DO NOTHING;

-- Bundle Standard Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'bundle_standard_yearly',
  'bundle',
  'standard',
  'yearly',
  'EUR',
  335.90,
  '{
    "max_conversations_per_month": 500,
    "max_voice_calls_per_month": 500,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": false,
    "has_n8n_integration": false,
    "has_priority_support": false,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": true,
    "has_call_analytics": false,
    "has_custom_voice_training": false,
    "has_white_label": false,
    "trial_days": 7,
    "savings_percent": 12
  }'
) ON CONFLICT (id) DO NOTHING;

-- Bundle Pro Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'bundle_pro_monthly',
  'bundle',
  'pro',
  'monthly',
  'EUR',
  49.99,
  '{
    "max_conversations_per_month": 1500,
    "max_voice_calls_per_month": 1500,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": true,
    "has_n8n_integration": true,
    "has_priority_support": true,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": true,
    "has_call_analytics": true,
    "has_custom_voice_training": true,
    "has_white_label": false,
    "savings_percent": 17
  }'
) ON CONFLICT (id) DO NOTHING;

-- Bundle Pro Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'bundle_pro_yearly',
  'bundle',
  'pro',
  'yearly',
  'EUR',
  479.90,
  '{
    "max_conversations_per_month": 1500,
    "max_voice_calls_per_month": 1500,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": true,
    "has_n8n_integration": true,
    "has_priority_support": true,
    "has_dedicated_support": false,
    "has_custom_integrations": false,
    "has_audit_logs": false,
    "has_call_recording": true,
    "has_call_analytics": true,
    "has_custom_voice_training": true,
    "has_white_label": false,
    "savings_percent": 17
  }'
) ON CONFLICT (id) DO NOTHING;

-- Bundle Enterprise Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'bundle_enterprise_monthly',
  'bundle',
  'enterprise',
  'monthly',
  'EUR',
  69.99,
  '{
    "max_conversations_per_month": null,
    "max_voice_calls_per_month": null,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": true,
    "has_n8n_integration": true,
    "has_priority_support": true,
    "has_dedicated_support": true,
    "has_custom_integrations": true,
    "has_audit_logs": true,
    "has_call_recording": true,
    "has_call_analytics": true,
    "has_custom_voice_training": true,
    "has_white_label": true,
    "savings_percent": 12
  }'
) ON CONFLICT (id) DO NOTHING;

-- Bundle Enterprise Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, limits)
VALUES (
  'bundle_enterprise_yearly',
  'bundle',
  'enterprise',
  'yearly',
  'EUR',
  671.90,
  '{
    "max_conversations_per_month": null,
    "max_voice_calls_per_month": null,
    "has_widget_api": true,
    "has_kb_training": true,
    "has_basic_analytics": true,
    "has_advanced_analytics": true,
    "has_n8n_integration": true,
    "has_priority_support": true,
    "has_dedicated_support": true,
    "has_custom_integrations": true,
    "has_audit_logs": true,
    "has_call_recording": true,
    "has_call_analytics": true,
    "has_custom_voice_training": true,
    "has_white_label": true,
    "savings_percent": 12
  }'
) ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  RAISE NOTICE 'All plans seeded successfully (18 plans: 6 Chatbot + 6 Voice + 6 Bundle)';
END $$;
