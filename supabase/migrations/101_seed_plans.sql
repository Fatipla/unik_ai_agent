-- ============================================================================
-- SEED PLANS DATA
-- ============================================================================
-- This migration seeds the plans table with all product tiers and billing periods
-- Products: Chatbot, Voice, Bundle
-- Tiers: Standard, Pro, Enterprise
-- Billing Periods: Monthly, Yearly
-- ============================================================================

-- Delete existing plans (idempotent)
DELETE FROM plans;

-- ============================================================================
-- CHATBOT PLANS
-- ============================================================================

-- Chatbot Standard Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('chatbot_standard_monthly', 'chatbot', 'standard', 'monthly', 'EUR', 29.00, true, '{
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
}'::jsonb);

-- Chatbot Standard Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('chatbot_standard_yearly', 'chatbot', 'standard', 'yearly', 'EUR', 290.00, true, '{
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
  "trial_days": 7,
  "savings_percent": 17
}'::jsonb);

-- Chatbot Pro Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('chatbot_pro_monthly', 'chatbot', 'pro', 'monthly', 'EUR', 99.00, true, '{
  "max_conversations_per_month": 2000,
  "max_voice_calls_per_month": 0,
  "has_widget_api": true,
  "has_kb_training": true,
  "has_basic_analytics": true,
  "has_advanced_analytics": true,
  "has_n8n_integration": true,
  "has_priority_support": true,
  "has_dedicated_support": false,
  "has_custom_integrations": true,
  "has_audit_logs": true,
  "has_call_recording": false,
  "has_call_analytics": false,
  "has_custom_voice_training": false,
  "has_white_label": false,
  "trial_days": 14
}'::jsonb);

-- Chatbot Pro Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('chatbot_pro_yearly', 'chatbot', 'pro', 'yearly', 'EUR', 990.00, true, '{
  "max_conversations_per_month": 2000,
  "max_voice_calls_per_month": 0,
  "has_widget_api": true,
  "has_kb_training": true,
  "has_basic_analytics": true,
  "has_advanced_analytics": true,
  "has_n8n_integration": true,
  "has_priority_support": true,
  "has_dedicated_support": false,
  "has_custom_integrations": true,
  "has_audit_logs": true,
  "has_call_recording": false,
  "has_call_analytics": false,
  "has_custom_voice_training": false,
  "has_white_label": false,
  "trial_days": 14,
  "savings_percent": 17
}'::jsonb);

-- Chatbot Enterprise Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('chatbot_enterprise_monthly', 'chatbot', 'enterprise', 'monthly', 'EUR', 299.00, true, '{
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
  "has_white_label": true,
  "trial_days": 30
}'::jsonb);

-- Chatbot Enterprise Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('chatbot_enterprise_yearly', 'chatbot', 'enterprise', 'yearly', 'EUR', 2990.00, true, '{
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
  "has_white_label": true,
  "trial_days": 30,
  "savings_percent": 17
}'::jsonb);

-- ============================================================================
-- VOICE PLANS
-- ============================================================================

-- Voice Standard Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('voice_standard_monthly', 'voice', 'standard', 'monthly', 'EUR', 49.00, true, '{
  "max_conversations_per_month": 0,
  "max_voice_calls_per_month": 100,
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
  "has_call_analytics": true,
  "has_custom_voice_training": false,
  "has_white_label": false,
  "trial_days": 7
}'::jsonb);

-- Voice Standard Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('voice_standard_yearly', 'voice', 'standard', 'yearly', 'EUR', 490.00, true, '{
  "max_conversations_per_month": 0,
  "max_voice_calls_per_month": 100,
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
  "has_call_analytics": true,
  "has_custom_voice_training": false,
  "has_white_label": false,
  "trial_days": 7,
  "savings_percent": 17
}'::jsonb);

-- Voice Pro Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('voice_pro_monthly', 'voice', 'pro', 'monthly', 'EUR', 149.00, true, '{
  "max_conversations_per_month": 0,
  "max_voice_calls_per_month": 500,
  "has_widget_api": false,
  "has_kb_training": false,
  "has_basic_analytics": true,
  "has_advanced_analytics": true,
  "has_n8n_integration": true,
  "has_priority_support": true,
  "has_dedicated_support": false,
  "has_custom_integrations": true,
  "has_audit_logs": true,
  "has_call_recording": true,
  "has_call_analytics": true,
  "has_custom_voice_training": true,
  "has_white_label": false,
  "trial_days": 14
}'::jsonb);

-- Voice Pro Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('voice_pro_yearly', 'voice', 'pro', 'yearly', 'EUR', 1490.00, true, '{
  "max_conversations_per_month": 0,
  "max_voice_calls_per_month": 500,
  "has_widget_api": false,
  "has_kb_training": false,
  "has_basic_analytics": true,
  "has_advanced_analytics": true,
  "has_n8n_integration": true,
  "has_priority_support": true,
  "has_dedicated_support": false,
  "has_custom_integrations": true,
  "has_audit_logs": true,
  "has_call_recording": true,
  "has_call_analytics": true,
  "has_custom_voice_training": true,
  "has_white_label": false,
  "trial_days": 14,
  "savings_percent": 17
}'::jsonb);

-- Voice Enterprise Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('voice_enterprise_monthly', 'voice', 'enterprise', 'monthly', 'EUR', 399.00, true, '{
  "max_conversations_per_month": 0,
  "max_voice_calls_per_month": null,
  "has_widget_api": false,
  "has_kb_training": false,
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
  "trial_days": 30
}'::jsonb);

-- Voice Enterprise Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('voice_enterprise_yearly', 'voice', 'enterprise', 'yearly', 'EUR', 3990.00, true, '{
  "max_conversations_per_month": 0,
  "max_voice_calls_per_month": null,
  "has_widget_api": false,
  "has_kb_training": false,
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
  "trial_days": 30,
  "savings_percent": 17
}'::jsonb);

-- ============================================================================
-- BUNDLE PLANS (Chatbot + Voice)
-- ============================================================================

-- Bundle Standard Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('bundle_standard_monthly', 'bundle', 'standard', 'monthly', 'EUR', 69.00, true, '{
  "max_conversations_per_month": 500,
  "max_voice_calls_per_month": 100,
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
  "has_call_analytics": true,
  "has_custom_voice_training": false,
  "has_white_label": false,
  "trial_days": 7,
  "savings_percent": 12
}'::jsonb);

-- Bundle Standard Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('bundle_standard_yearly', 'bundle', 'standard', 'yearly', 'EUR', 690.00, true, '{
  "max_conversations_per_month": 500,
  "max_voice_calls_per_month": 100,
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
  "has_call_analytics": true,
  "has_custom_voice_training": false,
  "has_white_label": false,
  "trial_days": 7,
  "savings_percent": 17
}'::jsonb);

-- Bundle Pro Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('bundle_pro_monthly', 'bundle', 'pro', 'monthly', 'EUR', 219.00, true, '{
  "max_conversations_per_month": 2000,
  "max_voice_calls_per_month": 500,
  "has_widget_api": true,
  "has_kb_training": true,
  "has_basic_analytics": true,
  "has_advanced_analytics": true,
  "has_n8n_integration": true,
  "has_priority_support": true,
  "has_dedicated_support": false,
  "has_custom_integrations": true,
  "has_audit_logs": true,
  "has_call_recording": true,
  "has_call_analytics": true,
  "has_custom_voice_training": true,
  "has_white_label": false,
  "trial_days": 14,
  "savings_percent": 12
}'::jsonb);

-- Bundle Pro Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('bundle_pro_yearly', 'bundle', 'pro', 'yearly', 'EUR', 2190.00, true, '{
  "max_conversations_per_month": 2000,
  "max_voice_calls_per_month": 500,
  "has_widget_api": true,
  "has_kb_training": true,
  "has_basic_analytics": true,
  "has_advanced_analytics": true,
  "has_n8n_integration": true,
  "has_priority_support": true,
  "has_dedicated_support": false,
  "has_custom_integrations": true,
  "has_audit_logs": true,
  "has_call_recording": true,
  "has_call_analytics": true,
  "has_custom_voice_training": true,
  "has_white_label": false,
  "trial_days": 14,
  "savings_percent": 17
}'::jsonb);

-- Bundle Enterprise Monthly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('bundle_enterprise_monthly', 'bundle', 'enterprise', 'monthly', 'EUR', 599.00, true, '{
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
  "trial_days": 30,
  "savings_percent": 14
}'::jsonb);

-- Bundle Enterprise Yearly
INSERT INTO plans (id, product_type, tier, billing_period, currency, price, is_active, limits) VALUES
('bundle_enterprise_yearly', 'bundle', 'enterprise', 'yearly', 'EUR', 5990.00, true, '{
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
  "trial_days": 30,
  "savings_percent": 17
}'::jsonb);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
DECLARE
  plan_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO plan_count FROM plans;
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Plans seeded successfully!';
  RAISE NOTICE 'Total plans: %', plan_count;
  RAISE NOTICE '  - Chatbot: 6 plans (3 tiers × 2 periods)';
  RAISE NOTICE '  - Voice: 6 plans (3 tiers × 2 periods)';
  RAISE NOTICE '  - Bundle: 6 plans (3 tiers × 2 periods)';
  RAISE NOTICE '========================================';
END $$;
