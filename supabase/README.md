# Supabase Migrations

This folder contains SQL migrations for the Paddle billing database schema.

## 📁 Structure

```
supabase/
├── migrations/
│   ├── 001_create_billing_schema.sql    # Core tables
│   ├── 002_enable_rls.sql               # Row Level Security
│   ├── 003_create_rpc_functions.sql     # Helper functions
│   └── 004_seed_entitlements.sql        # Plan metadata
├── config.toml                          # Local dev config
├── seed.sql                             # Test data (optional)
└── README.md                            # This file
```

## 🚀 Quick Start

### Option 1: Supabase Dashboard (Production)

1. Go to Supabase Dashboard → SQL Editor
2. Copy each migration file (in order)
3. Paste and execute

### Option 2: Supabase CLI (Local Dev)

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db push

# View in Studio
open http://localhost:54323
```

## 📋 Migrations

### 001: Create Billing Schema
- Creates 6 tables: customers, subscriptions, invoices, payments, webhook_events, entitlements
- Adds indexes for performance
- Idempotent (safe to re-run)

### 002: Enable RLS
- Enables Row Level Security on all tables
- Creates policies for user/service_role access
- Ensures data isolation per user

### 003: Create RPC Functions
- `create_or_get_customer()` - Find or create customer
- `upsert_subscription_from_paddle()` - Update from webhook
- `get_user_subscription()` - Fetch active subscription

### 004: Seed Entitlements
- Inserts 9 plan definitions
- CHATBOT (Standard, Pro, Enterprise)
- VOICE (Standard, Pro, Enterprise)
- BUNDLE (Standard, Pro, Enterprise)

## ✅ Verification

Run in SQL Editor:
```bash
# Copy contents of /scripts/verify-supabase-schema.sql
# Should show all PASS ✅
```

## 🔑 Required ENV Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key
```

## 📚 Documentation

See `/docs/SUPABASE_SETUP.md` for complete setup guide.

## 🛠️ Troubleshooting

### Migrations fail with "already exists"
✅ **This is OK!** Migrations are idempotent - they check before creating.

### RLS blocks queries
- Use `SUPABASE_SERVICE_ROLE` for admin operations
- Use `SUPABASE_ANON_KEY` for user operations (must be authenticated)

### Functions not found
- Run migration 003 again
- Check GRANT EXECUTE permissions

## 🔄 Adding New Migrations

```bash
supabase migration new your_migration_name
```

Edit the generated file in `supabase/migrations/`, then:
```bash
supabase db push
```

---

**Happy migrating!** 🎉
