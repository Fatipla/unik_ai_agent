-- Supabase Seed Data for Development
-- Creates test users and sample subscriptions

-- Note: This assumes you have a test user in auth.users
-- Run this AFTER creating a test user via Supabase Auth

-- Insert test customer (replace with your test user_id)
-- Example:
-- INSERT INTO customers (user_id, email, paddle_customer_id)
-- VALUES (
--   'your-test-user-uuid-here',
--   'test@example.com',
--   'ctm_test123'
-- )
-- ON CONFLICT (user_id) DO NOTHING;

-- Insert test subscription
-- Example:
-- INSERT INTO subscriptions (
--   customer_id,
--   plan_key,
--   period,
--   paddle_subscription_id,
--   status,
--   current_period_start,
--   current_period_end
-- )
-- SELECT
--   c.id,
--   'BUNDLE_PRO',
--   'M',
--   'sub_test123',
--   'trialing',
--   now(),
--   now() + interval '7 days'
-- FROM customers c
-- WHERE c.email = 'test@example.com'
-- ON CONFLICT (paddle_subscription_id) DO NOTHING;

-- Verify seed data
SELECT 'Customers:' as info, count(*) FROM customers
UNION ALL
SELECT 'Subscriptions:', count(*) FROM subscriptions
UNION ALL
SELECT 'Entitlements:', count(*) FROM entitlements;
