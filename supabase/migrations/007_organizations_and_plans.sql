-- Organizations & Plans System
-- Complete refactor for multi-tenant SaaS with proper plan management

-- Organizations table (Multi-tenancy)
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  slug varchar(255) UNIQUE NOT NULL,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);

-- Organization members (many-to-many)
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role varchar(50) DEFAULT 'member', -- owner, admin, member
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON organization_members(user_id);

-- Plans table (Product catalog)
CREATE TABLE IF NOT EXISTS plans (
  id varchar(255) PRIMARY KEY, -- e.g. chatbot_standard_monthly
  product_type varchar(50) NOT NULL, -- chatbot, voice, bundle
  tier varchar(50) NOT NULL, -- standard, pro, enterprise
  billing_period varchar(50) NOT NULL, -- monthly, yearly
  currency varchar(10) DEFAULT 'EUR',
  price decimal(10, 2) NOT NULL,
  is_active boolean DEFAULT true,
  limits jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plans_product_type ON plans(product_type);
CREATE INDEX IF NOT EXISTS idx_plans_tier ON plans(tier);
CREATE INDEX IF NOT EXISTS idx_plans_billing_period ON plans(billing_period);
CREATE INDEX IF NOT EXISTS idx_plans_is_active ON plans(is_active);

-- New Subscriptions table (replaces old one)
CREATE TABLE IF NOT EXISTS subscriptions_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id varchar(255) NOT NULL REFERENCES plans(id),
  provider varchar(50) NOT NULL, -- stripe, paddle
  external_subscription_id varchar(255),
  status varchar(50) DEFAULT 'active', -- trialing, active, past_due, cancelled
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_v2_org_id ON subscriptions_v2(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_v2_plan_id ON subscriptions_v2(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_v2_provider ON subscriptions_v2(provider);
CREATE INDEX IF NOT EXISTS idx_subscriptions_v2_status ON subscriptions_v2(status);

-- New Usage table (with metrics JSONB)
CREATE TABLE IF NOT EXISTS usage_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  period_start timestamp with time zone NOT NULL,
  period_end timestamp with time zone NOT NULL,
  metrics jsonb DEFAULT '{"conversations_count": 0, "voice_calls_count": 0, "ai_tokens": 0}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_v2_org_id ON usage_v2(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_v2_period ON usage_v2(period_start, period_end);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Organizations and Plans system created successfully';
END $$;
