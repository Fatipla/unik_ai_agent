-- Enable Row Level Security on all billing tables
-- Idempotent - safe to run multiple times

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own customer record" ON customers;
DROP POLICY IF EXISTS "Service role can insert customers" ON customers;
DROP POLICY IF EXISTS "Service role can update customers" ON customers;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;

DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
DROP POLICY IF EXISTS "Service role can manage invoices" ON invoices;

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Service role can manage payments" ON payments;

DROP POLICY IF EXISTS "Service role can manage webhook events" ON webhook_events;

DROP POLICY IF EXISTS "Anyone can view entitlements" ON entitlements;
DROP POLICY IF EXISTS "Service role can manage entitlements" ON entitlements;

-- CUSTOMERS POLICIES
-- Users can view their own customer record
CREATE POLICY "Users can view own customer record"
  ON customers
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert customers
CREATE POLICY "Service role can insert customers"
  ON customers
  FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Service role can update customers
CREATE POLICY "Service role can update customers"
  ON customers
  FOR UPDATE
  USING (auth.jwt()->>'role' = 'service_role');

-- SUBSCRIPTIONS POLICIES
-- Users can view their own subscriptions (via customer)
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = subscriptions.customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Service role can manage subscriptions (via webhook)
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- INVOICES POLICIES
-- Users can view their own invoices
CREATE POLICY "Users can view own invoices"
  ON invoices
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = invoices.customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Service role can manage invoices
CREATE POLICY "Service role can manage invoices"
  ON invoices
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- PAYMENTS POLICIES
-- Users can view their own payments (via invoice -> customer)
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      JOIN customers ON customers.id = invoices.customer_id
      WHERE invoices.id = payments.invoice_id
      AND customers.user_id = auth.uid()
    )
  );

-- Service role can manage payments
CREATE POLICY "Service role can manage payments"
  ON payments
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- WEBHOOK_EVENTS POLICIES
-- Only service role can access webhook events
CREATE POLICY "Service role can manage webhook events"
  ON webhook_events
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- ENTITLEMENTS POLICIES
-- Anyone can read entitlements (for pricing page, etc.)
CREATE POLICY "Anyone can view entitlements"
  ON entitlements
  FOR SELECT
  USING (true);

-- Only service role can modify entitlements
CREATE POLICY "Service role can manage entitlements"
  ON entitlements
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'RLS policies created successfully';
END $$;
