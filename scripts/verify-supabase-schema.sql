-- Verification Script for Supabase Billing Schema
-- Run this in Supabase SQL Editor to verify setup

-- 1. Check all tables exist
SELECT 
  'Tables Check' as test_name,
  CASE 
    WHEN COUNT(*) = 6 THEN 'PASS ✅'
    ELSE 'FAIL ❌ - Expected 6, got ' || COUNT(*)::text
  END as result
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'customers',
  'subscriptions',
  'invoices',
  'payments',
  'webhook_events',
  'entitlements'
);

-- 2. Check RLS enabled on all tables
SELECT 
  'RLS Check' as test_name,
  CASE 
    WHEN COUNT(*) = 6 THEN 'PASS ✅'
    ELSE 'FAIL ❌ - RLS not enabled on all tables'
  END as result
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
  'customers',
  'subscriptions',
  'invoices',
  'payments',
  'webhook_events',
  'entitlements'
)
AND rowsecurity = true;

-- 3. Check policies exist
SELECT 
  'Policies Check' as test_name,
  CASE 
    WHEN COUNT(*) >= 12 THEN 'PASS ✅'
    ELSE 'FAIL ❌ - Expected at least 12 policies, got ' || COUNT(*)::text
  END as result
FROM pg_policies
WHERE schemaname = 'public';

-- 4. Check indexes exist
SELECT 
  'Indexes Check' as test_name,
  CASE 
    WHEN COUNT(*) >= 10 THEN 'PASS ✅'
    ELSE 'FAIL ❌ - Expected at least 10 indexes, got ' || COUNT(*)::text
  END as result
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN (
  'customers',
  'subscriptions',
  'invoices',
  'payments',
  'webhook_events',
  'entitlements'
);

-- 5. Check RPC functions exist
SELECT 
  'RPC Functions Check' as test_name,
  CASE 
    WHEN COUNT(*) = 3 THEN 'PASS ✅'
    ELSE 'FAIL ❌ - Expected 3 functions, got ' || COUNT(*)::text
  END as result
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
  'create_or_get_customer',
  'upsert_subscription_from_paddle',
  'get_user_subscription'
);

-- 6. Check entitlements seeded
SELECT 
  'Entitlements Seed Check' as test_name,
  CASE 
    WHEN COUNT(*) = 9 THEN 'PASS ✅'
    ELSE 'FAIL ❌ - Expected 9 plans, got ' || COUNT(*)::text
  END as result
FROM entitlements;

-- 7. List all tables with row counts
SELECT 
  'Table Row Counts' as info,
  'customers: ' || (SELECT COUNT(*) FROM customers) || 
  ', subscriptions: ' || (SELECT COUNT(*) FROM subscriptions) ||
  ', invoices: ' || (SELECT COUNT(*) FROM invoices) ||
  ', payments: ' || (SELECT COUNT(*) FROM payments) ||
  ', webhook_events: ' || (SELECT COUNT(*) FROM webhook_events) ||
  ', entitlements: ' || (SELECT COUNT(*) FROM entitlements) as counts;

-- 8. List all entitlements (should be 9)
SELECT 
  plan_key,
  family,
  tier,
  features->>'chatbot_enabled' as chatbot,
  features->>'voice_enabled' as voice,
  features->>'chat_messages_limit' as msg_limit,
  features->>'voice_minutes_limit' as voice_limit
FROM entitlements
ORDER BY family, tier;

-- Success message
SELECT '🎉 Schema verification complete!' as status;
