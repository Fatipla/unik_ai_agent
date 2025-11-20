-- Unik AI Agent - Core Schema
-- Multi-tenant SaaS with Paddle billing, Chatbot + Voice agents

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Tenants (organizations)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (users linked to auth.users via Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  locale TEXT NOT NULL DEFAULT 'sq',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product catalog mirror
CREATE TABLE plans (
  key TEXT PRIMARY KEY, -- 'CHATBOT_STARTER_M', 'VOICE_PRO_Y', 'BUNDLE_PRO_M', etc.
  family TEXT NOT NULL CHECK (family IN ('CHATBOT', 'VOICE', 'BUNDLE')),
  tier TEXT NOT NULL CHECK (tier IN ('STARTER', 'PRO')),
  period TEXT NOT NULL CHECK (period IN ('M', 'Y')),
  paddle_price_id TEXT NOT NULL UNIQUE
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
  plan_key TEXT NOT NULL REFERENCES plans(key),
  paddle_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'paused')),
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entitlements per plan
CREATE TABLE entitlements (
  plan_key TEXT REFERENCES plans(key),
  feature TEXT NOT NULL, -- 'CHATBOT_ENABLED', 'VOICE_ENABLED', 'CUSTOM_BRANDING', 'API_ACCESS', etc.
  value JSONB NOT NULL,
  PRIMARY KEY (plan_key, feature)
);

-- Quotas per plan
CREATE TABLE quotas (
  plan_key TEXT REFERENCES plans(key),
  metric TEXT NOT NULL, -- 'CHAT_MESSAGES', 'VOICE_MINUTES', 'EMBED_TOKENS', 'SEATS'
  limit_int INT NOT NULL,
  PRIMARY KEY (plan_key, metric)
);

-- Usage events (rolling counter)
CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  units INT NOT NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_usage_tenant_metric_created ON usage_events(tenant_id, metric, created_at);

-- Agents (chatbot or voice)
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('chatbot', 'voice')),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  model TEXT NOT NULL,
  temperature NUMERIC NOT NULL DEFAULT 0.7,
  system_prompt TEXT NOT NULL DEFAULT '',
  voice_profile TEXT,
  language TEXT NOT NULL DEFAULT 'sq',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_agents_tenant_type ON agents(tenant_id, type);

-- Knowledge base sources
CREATE TABLE kb_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('url', 'file', 'raw')),
  status TEXT NOT NULL DEFAULT 'ready',
  tokens INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base chunks (with embeddings)
CREATE TABLE kb_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES kb_sources(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(3072), -- text-embedding-3-large dimension
  ord INT NOT NULL DEFAULT 0
);
CREATE INDEX idx_kb_chunks_source ON kb_chunks(source_id);
CREATE INDEX idx_kb_chunks_embedding ON kb_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  title TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX idx_conversations_agent ON conversations(agent_id);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens INT NOT NULL DEFAULT 0,
  latency_ms INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);

-- Voice sessions
CREATE TABLE voice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);
CREATE INDEX idx_voice_sessions_tenant ON voice_sessions(tenant_id);

-- Agent API keys (encrypted)
CREATE TABLE agent_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  secret TEXT NOT NULL, -- encrypted with ENCRYPTION_KEY_32B
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_agent_keys_agent ON agent_keys(agent_id);

-- Webhook events log (idempotency)
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  retries INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_webhook_events_hash ON webhook_events(payload_hash);
