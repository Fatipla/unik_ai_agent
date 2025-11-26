# 🚀 Supabase Integration - Complete Setup Guide

## 📋 Overview

This project uses **Supabase** as the managed PostgreSQL database, connected via **Drizzle ORM** and deployed on **Vercel** with CI/CD.

---

## 🗄️ Database Schema Summary

### Pricing & Subscription System (18 Plans)

**Tables:**
1. **`plans`** - Product catalog (18 variants)
   - 3 products: Chatbot, Voice, Bundle
   - 3 tiers: Standard, Pro, Enterprise
   - 2 billing periods: Monthly, Yearly (20% discount)

2. **`organizations`** - Multi-tenant support
3. **`organization_members`** - User-org relationships
4. **`subscriptions_v2`** - Org → Plan links (Stripe/Paddle)
5. **`usage_v2`** - Metrics tracking (conversations, calls, tokens)

**Total Plans:** 18 (3 × 3 × 2)

---

## ⚙️ Environment Variables

### Required for Vercel Deployment:

Add these to **Vercel → Settings → Environment Variables**:

```bash
# Database (Supabase)
POSTGRES_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

# OR use individual components:
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth (already configured)
NEXTAUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=https://your-vercel-url.vercel.app

# Paddle Billing (already configured)
PADDLE_VENDOR_ID=...
PADDLE_CLIENT_ID=...
PADDLE_CLIENT_SECRET=...
PADDLE_WEBHOOK_SECRET=...

# OpenAI (already configured)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

### How to Get Supabase Connection String:

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **Database**
3. Scroll to **Connection string** section
4. Copy **Transaction** mode connection string
5. Format: `postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`

---

## 🔧 Database Connection Setup

### Drizzle Configuration

**File:** `/app/src/lib/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import * as schemas from './schemas';

// Uses POSTGRES_URL from environment
// Vercel automatically provides this when connected to Supabase
export const db = drizzle(vercelSql, { schema: schemas });
```

**How it works:**
- `@vercel/postgres` automatically reads `POSTGRES_URL` env var
- Drizzle uses this connection for all queries
- Compatible with Supabase PostgreSQL (v15+)

---

## 📝 Running Migrations

### Prerequisites:
- Supabase project created
- `POSTGRES_URL` configured in Vercel (or locally in `.env`)

### Option 1: Via Supabase Dashboard (Recommended for First Setup)

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor**
3. Run migrations **in order**:

```sql
-- Migration 001: Billing Schema (legacy)
-- Copy content from: supabase/migrations/001_create_billing_schema.sql
-- Paste and RUN

-- Migration 002: RLS Policies
-- Copy content from: supabase/migrations/002_enable_rls.sql
-- Paste and RUN

-- Migration 003: RPC Functions
-- Copy content from: supabase/migrations/003_create_rpc_functions.sql
-- Paste and RUN

-- Migration 004: Entitlements Seed
-- Copy content from: supabase/migrations/004_seed_entitlements.sql
-- Paste and RUN

-- Migration 005: NextAuth Schema
-- Copy content from: supabase/migrations/005_nextauth_schema.sql
-- Paste and RUN

-- Migration 006: Conversations & Calls
-- Copy content from: supabase/migrations/006_conversations_and_calls.sql
-- Paste and RUN

-- Migration 007: Organizations & Plans (NEW SYSTEM)
-- Copy content from: supabase/migrations/007_organizations_and_plans.sql
-- Paste and RUN

-- Migration 008: Seed Chatbot Plans
-- Copy content from: supabase/migrations/008_seed_plans.sql
-- Paste and RUN

-- Migration 009: Seed Voice & Bundle Plans
-- Copy content from: supabase/migrations/009_seed_voice_bundle_plans.sql
-- Paste and RUN
```

### Option 2: Via CLI (For Development)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref [YOUR-PROJECT-REF]

# Run all migrations
supabase db push

# OR manually push each migration
psql $POSTGRES_URL -f supabase/migrations/001_create_billing_schema.sql
psql $POSTGRES_URL -f supabase/migrations/002_enable_rls.sql
# ... repeat for all 9 migrations
```

### Verification:

After running migrations, verify in SQL Editor:

```sql
-- Check plans table
SELECT COUNT(*) FROM plans;
-- Expected: 18

-- List all plans
SELECT id, product_type, tier, billing_period, price 
FROM plans 
ORDER BY product_type, tier, billing_period;

-- Check organizations table exists
SELECT COUNT(*) FROM organizations;
```

---

## 🧪 Testing APIs Locally

### 1. Setup Local Environment

```bash
# Clone repo
git clone https://github.com/Fatipla/unik_ai_agent.git
cd unik_ai_agent

# Install dependencies
pnpm install

# Create .env.local
cp .env.example .env.local

# Add your Supabase connection string
echo "POSTGRES_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres" >> .env.local
```

### 2. Run Dev Server

```bash
pnpm dev
# Opens on http://localhost:9002
```

### 3. Test API Endpoints

```bash
# List all plans
curl http://localhost:9002/api/v1/plans | jq

# Filter by product type
curl "http://localhost:9002/api/v1/plans?product_type=bundle" | jq

# Filter by billing period
curl "http://localhost:9002/api/v1/plans?billing_period=yearly" | jq

# Get comparison data (grouped structure)
curl http://localhost:9002/api/v1/plans/comparison | jq
```

### Expected Response (GET /api/v1/plans):

```json
{
  "plans": [
    {
      "id": "chatbot_standard_monthly",
      "product_type": "chatbot",
      "tier": "standard",
      "billing_period": "monthly",
      "currency": "EUR",
      "price": 19.99,
      "max_conversations_per_month": 500,
      "max_voice_calls_per_month": 0,
      "has_widget_api": true,
      "has_kb_training": true,
      "has_basic_analytics": true,
      "has_advanced_analytics": false,
      "trial_days": 7
    }
  ],
  "count": 18
}
```

---

## 🚀 Deployment to Vercel

### Automatic Deployment (CI/CD)

1. **Push to GitHub:**
```bash
git add .
git commit -m "feat: Supabase integration complete"
git push origin main
```

2. **Vercel Auto-Deploy:**
   - Vercel detects the push
   - Runs build automatically
   - Deploys to production

### Environment Variables Setup:

Before first deploy, ensure in **Vercel Dashboard**:

1. Go to **Project Settings** → **Environment Variables**
2. Add **ALL** required variables (see section above)
3. Most important: `POSTGRES_URL` for Supabase connection
4. Click **Save** and **Redeploy**

### Verify Production Deployment:

```bash
# Replace with your Vercel URL
curl https://your-app.vercel.app/api/v1/plans | jq

# Should return 18 plans
```

---

## 📊 Database Schema Reference

### Plans Table Structure:

```sql
CREATE TABLE plans (
  id varchar(255) PRIMARY KEY,           -- e.g., chatbot_standard_monthly
  product_type varchar(50) NOT NULL,     -- chatbot | voice | bundle
  tier varchar(50) NOT NULL,             -- standard | pro | enterprise
  billing_period varchar(50) NOT NULL,   -- monthly | yearly
  currency varchar(10) DEFAULT 'EUR',
  price decimal(10,2) NOT NULL,
  is_active boolean DEFAULT true,
  limits jsonb NOT NULL,                 -- Feature flags + quotas
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

### Limits JSONB Example:

```json
{
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
}
```

---

## 🔄 Migration Strategy

### Fresh Database (New Project):
Run all 9 migrations in order (001-009)

### Existing Database:
- Migrations are **idempotent** (safe to re-run)
- Uses `CREATE TABLE IF NOT EXISTS`
- Uses `ON CONFLICT DO NOTHING` for inserts

### Rollback Strategy:
If needed, drop new tables:

```sql
DROP TABLE IF EXISTS usage_v2 CASCADE;
DROP TABLE IF EXISTS subscriptions_v2 CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
```

---

## 🎯 Pricing Specification Compliance

### ✅ Verified Implementation:

**18 Plans:**
- ✅ Chatbot: 6 variants (Standard/Pro/Enterprise × Monthly/Yearly)
- ✅ Voice: 6 variants
- ✅ Bundle: 6 variants

**Yearly Discount:**
- ✅ Formula: `yearly = monthly × 12 × 0.8` (20% off)
- ✅ Examples:
  - €19.99/mo → €191.90/yr (20% off)
  - €29.99/mo → €287.90/yr (20% off)

**Feature Flags:**
- ✅ 15+ boolean flags in JSONB `limits`
- ✅ Flattened in API responses for easy frontend consumption

**Multi-Provider Support:**
- ✅ `provider` field: `stripe` | `paddle`
- ✅ `external_subscription_id` for mapping

**Usage Tracking:**
- ✅ `metrics` JSONB with `conversations_count`, `voice_calls_count`, `ai_tokens`
- ✅ Per organization + period tracking

**API Endpoints:**
- ✅ `GET /api/v1/plans` with filters
- ✅ `GET /api/v1/plans/comparison` with grouped structure

---

## 🐛 Troubleshooting

### Issue: "Connection refused" or "ECONNREFUSED"

**Cause:** `POSTGRES_URL` not set or incorrect

**Fix:**
```bash
# Verify connection string
echo $POSTGRES_URL

# Test connection
psql $POSTGRES_URL -c "SELECT 1;"
```

---

### Issue: "relation 'plans' does not exist"

**Cause:** Migrations not run

**Fix:** Run migrations 007, 008, 009 in Supabase SQL Editor

---

### Issue: "SELECT COUNT(*) FROM plans" returns 0

**Cause:** Seed migrations (008, 009) not run

**Fix:** Run 008 and 009 to insert 18 plans

---

### Issue: API returns empty array

**Cause:** Plans not active or filtered out

**Fix:**
```sql
-- Check if plans exist
SELECT COUNT(*) FROM plans WHERE is_active = true;

-- Reset active flag if needed
UPDATE plans SET is_active = true;
```

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs/guides/database
- **Drizzle ORM:** https://orm.drizzle.team/docs/overview
- **Vercel Postgres:** https://vercel.com/docs/storage/vercel-postgres

---

## ✅ Quick Checklist

Before going to production:

- [ ] Supabase project created
- [ ] `POSTGRES_URL` added to Vercel env vars
- [ ] All 9 migrations run successfully
- [ ] `SELECT COUNT(*) FROM plans` returns 18
- [ ] API test passes: `curl /api/v1/plans`
- [ ] Comparison API works: `curl /api/v1/plans/comparison`
- [ ] Frontend can fetch and display plans
- [ ] Paddle webhook configured (if using billing)

---

## 🎉 Success Criteria

When everything is working:
- ✅ 18 plans in database
- ✅ API returns all plans with filters
- ✅ Comparison endpoint returns grouped data
- ✅ Vercel deployment successful
- ✅ Frontend pricing page loads data from API

**You're ready for production!** 🚀

---

**Last Updated:** November 2024  
**Compatible With:** Supabase PostgreSQL 15+, Drizzle ORM 0.x, Vercel
