-- Supabase Billing Schema for Paddle
-- Idempotent migration - only creates missing objects

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, -- maps to auth.users.id
  email text NOT NULL,
  paddle_customer_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for customers (only if not exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_customers_user_id') THEN
    CREATE INDEX idx_customers_user_id ON customers(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_customers_paddle_id') THEN
    CREATE INDEX idx_customers_paddle_id ON customers(paddle_customer_id);
  END IF;
END $$;

-- 2. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  plan_key text NOT NULL, -- CHATBOT_PRO, VOICE_STANDARD, BUNDLE_ENTERPRISE
  period text NOT NULL, -- 'M' | 'Y'
  paddle_subscription_id text UNIQUE,
  status text NOT NULL, -- trialing|active|past_due|canceled
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  over_limit boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for subscriptions
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_plan_key') THEN
    CREATE INDEX idx_subscriptions_plan_key ON subscriptions(plan_key);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_status') THEN
    CREATE INDEX idx_subscriptions_status ON subscriptions(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_paddle_id') THEN
    CREATE INDEX idx_subscriptions_paddle_id ON subscriptions(paddle_subscription_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_customer_id') THEN
    CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
  END IF;
END $$;

-- 3. INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paddle_invoice_id text UNIQUE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  number text,
  hosted_url text,
  status text, -- issued|paid|void
  amount_total numeric(12,2),
  currency text,
  issued_at timestamptz,
  paid_at timestamptz,
  raw_json jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for invoices
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_invoices_paddle_id') THEN
    CREATE INDEX idx_invoices_paddle_id ON invoices(paddle_invoice_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_invoices_customer_id') THEN
    CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
  END IF;
END $$;

-- 4. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paddle_payment_id text UNIQUE,
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
  status text, -- succeeded|failed
  amount numeric(12,2),
  currency text,
  raw_json jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for payments
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_paddle_id') THEN
    CREATE INDEX idx_payments_paddle_id ON payments(paddle_payment_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_invoice_id') THEN
    CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
  END IF;
END $$;

-- 5. WEBHOOK_EVENTS TABLE
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  dedupe_key text UNIQUE NOT NULL, -- Paddle event_id
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add index for webhook_events
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_webhook_events_dedupe') THEN
    CREATE INDEX idx_webhook_events_dedupe ON webhook_events(dedupe_key);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_webhook_events_type') THEN
    CREATE INDEX idx_webhook_events_type ON webhook_events(type);
  END IF;
END $$;

-- 6. ENTITLEMENTS TABLE (plan metadata)
CREATE TABLE IF NOT EXISTS entitlements (
  plan_key text PRIMARY KEY,
  family text NOT NULL, -- CHATBOT|VOICE|BUNDLE
  tier text NOT NULL, -- STANDARD|PRO|ENTERPRISE
  features jsonb NOT NULL, -- { chatbot_enabled, voice_enabled, limits... }
  updated_at timestamptz DEFAULT now()
);

-- Add index for entitlements
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_entitlements_family_tier') THEN
    CREATE INDEX idx_entitlements_family_tier ON entitlements(family, tier);
  END IF;
END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Billing schema tables created successfully (or already exist)';
END $$;
