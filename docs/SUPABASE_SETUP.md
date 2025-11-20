# Supabase Database Setup Guide

## Overview

This guide explains how to set up the Supabase Postgres database for Paddle billing integration.

---

## 📋 Prerequisites

- Supabase account (https://supabase.com)
- Supabase CLI installed (optional, for local dev)

---

## 🚀 Quick Start (Production)

### 1. Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `unik-ai-agent` (or your choice)
4. Database password: **Save this securely**
5. Region: Choose closest to your users
6. Click "Create new project"

### 2. Run Migrations

Go to **SQL Editor** in Supabase Dashboard and run each migration file in order:

#### Migration 1: Create Tables
```sql
-- Copy contents of supabase/migrations/001_create_billing_schema.sql
-- Paste and execute in SQL Editor
```

#### Migration 2: Enable RLS
```sql
-- Copy contents of supabase/migrations/002_enable_rls.sql
-- Paste and execute
```

#### Migration 3: Create RPC Functions
```sql
-- Copy contents of supabase/migrations/003_create_rpc_functions.sql
-- Paste and execute
```

#### Migration 4: Seed Entitlements
```sql
-- Copy contents of supabase/migrations/004_seed_entitlements.sql
-- Paste and execute
```

### 3. Get Connection Credentials

In Supabase Dashboard:
1. Go to **Settings → API**
2. Copy:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - anon/public key (SUPABASE_ANON_KEY)
   - service_role key (SUPABASE_SERVICE_ROLE)

### 4. Update Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE=your_service_role_key_here
```

---

## 🧪 Local Development (Optional)

### 1. Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase
```

### 2. Initialize Supabase

```bash
cd /app
supabase init
```

### 3. Start Local Supabase

```bash
supabase start
```

This starts:
- Postgres (port 54322)
- PostgREST API (port 54321)
- Studio UI (http://localhost:54323)

### 4. Apply Migrations Locally

```bash
supabase db push
```

### 5. View Local Studio

Open http://localhost:54323 to manage your local database.

---

## 📊 Database Schema Summary

### Tables

1. **customers**
   - Maps auth.users to Paddle customers
   - Stores paddle_customer_id

2. **subscriptions**
   - Active subscriptions per customer
   - Tracks plan_key, period, status, renewal dates

3. **invoices**
   - Billing history
   - Links to Paddle hosted invoice URLs

4. **payments**
   - Payment transaction records
   - Status tracking (succeeded/failed)

5. **webhook_events**
   - Paddle webhook event log
   - Dedupe via event_id

6. **entitlements**
   - Plan metadata (features, limits)
   - Used by dashboard for feature gating

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with strict policies:

### Customers
- Users can SELECT their own record
- Service role can INSERT/UPDATE

### Subscriptions, Invoices, Payments
- Users can SELECT via customer_id join
- Service role can INSERT/UPDATE/DELETE

### Webhook Events
- Service role only (full access)

### Entitlements
- Anyone can SELECT (public pricing info)
- Service role can INSERT/UPDATE

---

## 🛠️ RPC Functions

### `create_or_get_customer(user_id, email)`
Returns existing customer or creates new one.

**Usage:**
```sql
SELECT * FROM create_or_get_customer(
  auth.uid(),
  'user@example.com'
);
```

### `upsert_subscription_from_paddle(payload)`
Updates subscription from Paddle webhook data.

**Usage:**
```sql
SELECT * FROM upsert_subscription_from_paddle(
  '{"subscription_id": "sub_123", ...}'::jsonb
);
```

### `get_user_subscription(user_id)`
Returns active subscription for user.

**Usage:**
```sql
SELECT * FROM get_user_subscription(auth.uid());
```

---

## 🧪 Testing Schema

### Verify Tables Created

```sql
SELECT table_name 
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
```

Expected: 6 rows

### Verify RLS Enabled

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
  'customers',
  'subscriptions',
  'invoices',
  'payments',
  'webhook_events',
  'entitlements'
);
```

All should have `rowsecurity = true`

### Verify Policies

```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Should see policies for each table.

### Check Entitlements Seeded

```sql
SELECT plan_key, family, tier 
FROM entitlements
ORDER BY family, tier;
```

Expected: 9 rows (CHATBOT, VOICE, BUNDLE × STANDARD, PRO, ENTERPRISE)

---

## 🔄 Migration Workflow

### Add New Migration

```bash
supabase migration new migration_name
```

Edit the generated file, then:
```bash
supabase db push
```

### Deploy to Production

In Supabase Dashboard:
1. Go to **SQL Editor**
2. Copy migration SQL
3. Execute
4. Verify with test queries

---

## 🐛 Troubleshooting

### "Permission denied" errors
- Check RLS policies are correct
- Verify you're using service_role key for admin operations
- Check user is authenticated (auth.uid() returns value)

### Migrations fail
- Check tables don't already exist
- Migrations are idempotent - safe to re-run
- Check for syntax errors in SQL

### RPC functions not working
- Verify SECURITY DEFINER is set
- Check function permissions (GRANT EXECUTE)
- Ensure search_path includes 'public'

---

## 📈 Monitoring

### Active Subscriptions

```sql
SELECT 
  s.status,
  COUNT(*) as count
FROM subscriptions s
GROUP BY s.status;
```

### Revenue by Plan

```sql
SELECT 
  s.plan_key,
  COUNT(*) as subscribers
FROM subscriptions s
WHERE s.status IN ('active', 'trialing')
GROUP BY s.plan_key
ORDER BY subscribers DESC;
```

### Recent Webhook Events

```sql
SELECT 
  type,
  created_at
FROM webhook_events
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🔗 Resources

- **Supabase Docs**: https://supabase.com/docs
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **CLI Reference**: https://supabase.com/docs/reference/cli

---

## 🚀 Next Steps

After setting up Supabase:

1. Update Next.js app to use Supabase client
2. Configure webhook handler to use service_role
3. Test checkout flow writes to database
4. Verify dashboard reads user subscriptions
5. Monitor webhook events in production

---

**Setup Complete!** 🎉

Your Supabase database is ready for Paddle billing integration.
