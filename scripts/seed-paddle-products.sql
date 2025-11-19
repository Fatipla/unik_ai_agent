-- Seed Paddle products and prices in database
-- Run this after setting up your Paddle account and obtaining product/price IDs

-- Insert Paddle products
INSERT INTO paddle_products (product_id, name, description) VALUES
('pro_01jstarter123', 'Starter Plan', 'Perfect for small teams getting started with AI agents'),
('pro_01jpro456', 'Pro Plan', 'Advanced features for growing businesses'),
('pro_01jbusiness789', 'Business Plan', 'Enterprise-grade AI agent platform')
ON CONFLICT (product_id) DO NOTHING;

-- Insert Paddle prices (monthly)
INSERT INTO paddle_prices (price_id, product_id, plan_name, amount, currency, interval, trial_days) VALUES
('pri_01jstarter_monthly', 'pro_01jstarter123', 'starter', 1999, 'EUR', 'monthly', 7),
('pri_01jpro_monthly', 'pro_01jpro456', 'pro', 2999, 'EUR', 'monthly', 7),
('pri_01jbusiness_monthly', 'pro_01jbusiness789', 'business', 3999, 'EUR', 'monthly', 14)
ON CONFLICT (price_id) DO NOTHING;

-- Insert Paddle prices (yearly with 30% discount)
INSERT INTO paddle_prices (price_id, product_id, plan_name, amount, currency, interval, trial_days) VALUES
('pri_01jstarter_yearly', 'pro_01jstarter123', 'starter', 16799, 'EUR', 'yearly', 7),
('pri_01jpro_yearly', 'pro_01jpro456', 'pro', 25199, 'EUR', 'yearly', 7),
('pri_01jbusiness_yearly', 'pro_01jbusiness789', 'business', 33599, 'EUR', 'yearly', 14)
ON CONFLICT (price_id) DO NOTHING;
