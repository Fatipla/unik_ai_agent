-- RPC Helper Functions for Paddle Billing
-- Idempotent - safe to run multiple times

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS create_or_get_customer(uuid, text);
DROP FUNCTION IF EXISTS upsert_subscription_from_paddle(jsonb);
DROP FUNCTION IF EXISTS get_user_subscription(uuid);

-- 1. CREATE OR GET CUSTOMER
-- Returns existing customer or creates a new one
CREATE OR REPLACE FUNCTION create_or_get_customer(
  p_user_id uuid,
  p_email text
)
RETURNS customers
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer customers;
BEGIN
  -- Try to find existing customer
  SELECT * INTO v_customer
  FROM customers
  WHERE user_id = p_user_id
  LIMIT 1;

  -- If not found, create new
  IF NOT FOUND THEN
    INSERT INTO customers (user_id, email)
    VALUES (p_user_id, p_email)
    RETURNING * INTO v_customer;
  END IF;

  RETURN v_customer;
END;
$$;

-- 2. UPSERT SUBSCRIPTION FROM PADDLE WEBHOOK
-- Updates or inserts subscription data from Paddle webhook payload
CREATE OR REPLACE FUNCTION upsert_subscription_from_paddle(
  p_payload jsonb
)
RETURNS subscriptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subscription subscriptions;
  v_paddle_sub_id text;
  v_customer_id uuid;
  v_paddle_customer_id text;
BEGIN
  -- Extract Paddle subscription ID
  v_paddle_sub_id := p_payload->>'subscription_id';
  v_paddle_customer_id := p_payload->>'customer_id';

  -- Find customer by paddle_customer_id
  SELECT id INTO v_customer_id
  FROM customers
  WHERE paddle_customer_id = v_paddle_customer_id
  LIMIT 1;

  -- If customer not found, raise exception
  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'Customer not found for paddle_customer_id: %', v_paddle_customer_id;
  END IF;

  -- Upsert subscription
  INSERT INTO subscriptions (
    customer_id,
    paddle_subscription_id,
    plan_key,
    period,
    status,
    current_period_start,
    current_period_end,
    cancel_at,
    cancel_at_period_end,
    updated_at
  )
  VALUES (
    v_customer_id,
    v_paddle_sub_id,
    p_payload->>'plan_key',
    p_payload->>'period',
    p_payload->>'status',
    (p_payload->>'current_period_start')::timestamptz,
    (p_payload->>'current_period_end')::timestamptz,
    (p_payload->>'cancel_at')::timestamptz,
    COALESCE((p_payload->>'cancel_at_period_end')::boolean, false),
    now()
  )
  ON CONFLICT (paddle_subscription_id)
  DO UPDATE SET
    status = EXCLUDED.status,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    cancel_at = EXCLUDED.cancel_at,
    cancel_at_period_end = EXCLUDED.cancel_at_period_end,
    updated_at = now()
  RETURNING * INTO v_subscription;

  RETURN v_subscription;
END;
$$;

-- 3. GET USER SUBSCRIPTION
-- Returns active subscription for a user
CREATE OR REPLACE FUNCTION get_user_subscription(
  p_user_id uuid
)
RETURNS TABLE (
  subscription_id uuid,
  plan_key text,
  period text,
  status text,
  current_period_end timestamptz,
  cancel_at_period_end boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.plan_key,
    s.period,
    s.status,
    s.current_period_end,
    s.cancel_at_period_end
  FROM subscriptions s
  JOIN customers c ON c.id = s.customer_id
  WHERE c.user_id = p_user_id
  AND s.status IN ('active', 'trialing', 'past_due')
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_or_get_customer TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION upsert_subscription_from_paddle TO service_role;
GRANT EXECUTE ON FUNCTION get_user_subscription TO authenticated, service_role;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'RPC functions created successfully';
END $$;
