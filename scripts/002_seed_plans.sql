-- Seed Paddle plans
-- These must match your Paddle product catalog

INSERT INTO public.products (paddle_product_id, name, description) VALUES
  ('pro_starter', 'Starter', 'Perfect for small teams getting started'),
  ('pro_pro', 'Pro', 'For growing businesses'),
  ('pro_business', 'Business', 'Enterprise-grade features')
ON CONFLICT (paddle_product_id) DO NOTHING;

-- Insert prices (Monthly)
INSERT INTO public.prices (product_id, paddle_price_id, currency, unit_amount, interval, trial_days)
SELECT 
  p.id,
  CASE 
    WHEN p.paddle_product_id = 'pro_starter' THEN 'pri_starter_monthly'
    WHEN p.paddle_product_id = 'pro_pro' THEN 'pri_pro_monthly'
    WHEN p.paddle_product_id = 'pro_business' THEN 'pri_business_monthly'
  END,
  'EUR',
  CASE 
    WHEN p.paddle_product_id = 'pro_starter' THEN 1900
    WHEN p.paddle_product_id = 'pro_pro' THEN 4900
    WHEN p.paddle_product_id = 'pro_business' THEN 9900
  END,
  'month',
  7
FROM public.products p
ON CONFLICT (paddle_price_id) DO NOTHING;

-- Insert prices (Yearly)
INSERT INTO public.prices (product_id, paddle_price_id, currency, unit_amount, interval, trial_days)
SELECT 
  p.id,
  CASE 
    WHEN p.paddle_product_id = 'pro_starter' THEN 'pri_starter_yearly'
    WHEN p.paddle_product_id = 'pro_pro' THEN 'pri_pro_yearly'
    WHEN p.paddle_product_id = 'pro_business' THEN 'pri_business_yearly'
  END,
  'EUR',
  CASE 
    WHEN p.paddle_product_id = 'pro_starter' THEN 18240  -- 19*12*0.8 (20% discount)
    WHEN p.paddle_product_id = 'pro_pro' THEN 47040     -- 49*12*0.8
    WHEN p.paddle_product_id = 'pro_business' THEN 95040 -- 99*12*0.8
  END,
  'year',
  7
FROM public.products p
ON CONFLICT (paddle_price_id) DO NOTHING;
