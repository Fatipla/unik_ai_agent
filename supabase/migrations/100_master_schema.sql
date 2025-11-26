-- ============================================================================
-- MASTER SCHEMA MIGRATION - Multi-Tenant SaaS Architecture
-- ============================================================================
-- This migration creates a complete, production-ready database schema
-- for a multi-tenant SaaS platform with AI agents, workflows, and voice AI.
-- 
-- Schema Design:
-- 1. Multi-Tenancy Core (organizations, users, api_keys)
-- 2. Messaging & Communication (channels, contacts, conversations, messages)
-- 3. AI & Knowledge Base (ai_agents, knowledge_sources, document_chunks)
-- 4. Workflows Engine (workflows, workflow_runs)
-- 5. Billing & Usage (plans, subscriptions, usage)
-- 6. Voice AI Module (call_sessions, call_turns, call_transcripts)
-- 7. Webhooks (webhook_subscriptions)
-- 8. Audit Logs (audit_logs)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. MULTI-TENANCY CORE
-- ============================================================================

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  slug varchar(255) UNIQUE NOT NULL,
  plan varchar(50) DEFAULT 'standard',
  status varchar(50) DEFAULT 'active', -- active, suspended, deleted
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);

-- Users table (unified)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  email varchar(255) NOT NULL UNIQUE,
  name varchar(255),
  password_hash varchar(255),
  role varchar(50) DEFAULT 'member', -- owner, admin, member
  email_verified timestamptz,
  image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  key_hash varchar(255) NOT NULL UNIQUE,
  key_prefix varchar(20) NOT NULL,
  permissions jsonb DEFAULT '[]'::jsonb,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);

-- ============================================================================
-- 2. MESSAGING & COMMUNICATION
-- ============================================================================

-- Channels table
CREATE TABLE IF NOT EXISTS channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  type varchar(50) NOT NULL, -- widget, whatsapp, voice, api
  settings jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_channels_organization_id ON channels(organization_id);
CREATE INDEX IF NOT EXISTS idx_channels_type ON channels(type);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email varchar(255),
  phone varchar(50),
  name varchar(255),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contacts_organization_id ON contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);

-- Conversations table (refactored)
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  channel_id uuid REFERENCES channels(id) ON DELETE SET NULL,
  status varchar(50) DEFAULT 'active', -- active, closed, archived
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_organization_id ON conversations(organization_id);
CREATE INDEX IF NOT EXISTS idx_conversations_contact_id ON conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_conversations_channel_id ON conversations(channel_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);

-- Messages table (refactored)
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  direction varchar(20) NOT NULL, -- inbound, outbound
  role varchar(50), -- user, assistant, system
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- ============================================================================
-- 3. AI & KNOWLEDGE BASE
-- ============================================================================

-- AI Agents table
CREATE TABLE IF NOT EXISTS ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  instructions text,
  model varchar(100) DEFAULT 'gpt-4',
  settings jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_agents_organization_id ON ai_agents(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_is_active ON ai_agents(is_active);

-- Knowledge Sources table
CREATE TABLE IF NOT EXISTS knowledge_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  type varchar(50) NOT NULL, -- url, file, text
  location text,
  status varchar(50) DEFAULT 'pending', -- pending, processing, ready, failed
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_sources_organization_id ON knowledge_sources(organization_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_status ON knowledge_sources(status);

-- Document Chunks table (for vector embeddings)
CREATE TABLE IF NOT EXISTS document_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_source_id uuid NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  content text NOT NULL,
  embedding_vector vector(1536), -- For OpenAI embeddings
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_document_chunks_knowledge_source_id ON document_chunks(knowledge_source_id);

-- ============================================================================
-- 4. WORKFLOWS ENGINE
-- ============================================================================

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  description text,
  definition jsonb NOT NULL, -- Workflow steps and logic
  triggers jsonb DEFAULT '[]'::jsonb, -- Trigger conditions
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflows_organization_id ON workflows(organization_id);
CREATE INDEX IF NOT EXISTS idx_workflows_is_active ON workflows(is_active);

-- Workflow Runs table
CREATE TABLE IF NOT EXISTS workflow_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status varchar(50) DEFAULT 'running', -- running, completed, failed
  input_data jsonb,
  output_data jsonb,
  error_message text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow_id ON workflow_runs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON workflow_runs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_started_at ON workflow_runs(started_at);

-- ============================================================================
-- 5. BILLING & USAGE
-- ============================================================================

-- Plans table (Product catalog)
CREATE TABLE IF NOT EXISTS plans (
  id varchar(255) PRIMARY KEY, -- chatbot_standard_monthly
  product_type varchar(50) NOT NULL, -- chatbot, voice, bundle
  tier varchar(50) NOT NULL, -- standard, pro, enterprise
  billing_period varchar(50) NOT NULL, -- monthly, yearly
  currency varchar(10) DEFAULT 'EUR',
  price decimal(10, 2) NOT NULL,
  is_active boolean DEFAULT true,
  limits jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plans_product_type ON plans(product_type);
CREATE INDEX IF NOT EXISTS idx_plans_tier ON plans(tier);
CREATE INDEX IF NOT EXISTS idx_plans_is_active ON plans(is_active);

-- Subscriptions table (unified)
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id varchar(255) NOT NULL REFERENCES plans(id),
  provider varchar(50) NOT NULL, -- stripe, paddle
  external_subscription_id varchar(255),
  status varchar(50) DEFAULT 'active', -- trialing, active, past_due, cancelled
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Usage table (metrics tracking)
CREATE TABLE IF NOT EXISTS usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  metrics jsonb DEFAULT '{"conversations_count": 0, "voice_calls_count": 0, "ai_tokens": 0}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_organization_id ON usage(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_period ON usage(period_start, period_end);

-- ============================================================================
-- 6. VOICE AI MODULE
-- ============================================================================

-- Call Sessions table
CREATE TABLE IF NOT EXISTS call_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  external_call_id varchar(255),
  direction varchar(20) NOT NULL, -- inbound, outbound
  status varchar(50) DEFAULT 'initiated', -- initiated, ringing, in-progress, completed, failed
  duration_seconds integer,
  recording_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_call_sessions_organization_id ON call_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_contact_id ON call_sessions(contact_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_status ON call_sessions(status);

-- Call Turns table (conversation turns within a call)
CREATE TABLE IF NOT EXISTS call_turns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_session_id uuid NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  speaker varchar(20) NOT NULL, -- user, agent
  text text NOT NULL,
  audio_url text,
  duration_seconds integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_turns_call_session_id ON call_turns(call_session_id);

-- Call Transcripts table (full transcript)
CREATE TABLE IF NOT EXISTS call_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_session_id uuid NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  full_text text NOT NULL,
  language varchar(10),
  confidence_score decimal(3, 2),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_transcripts_call_session_id ON call_transcripts(call_session_id);

-- ============================================================================
-- 7. WEBHOOKS
-- ============================================================================

-- Webhook Subscriptions table
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  url text NOT NULL,
  events jsonb DEFAULT '[]'::jsonb, -- Array of event types
  secret varchar(255) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_organization_id ON webhook_subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_is_active ON webhook_subscriptions(is_active);

-- ============================================================================
-- 8. AUDIT LOGS
-- ============================================================================

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action varchar(100) NOT NULL,
  resource_type varchar(100) NOT NULL,
  resource_id uuid,
  changes jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- 9. NEXTAUTH COMPATIBILITY TABLES
-- ============================================================================
-- These tables are kept for NextAuth.js compatibility

-- Accounts table (OAuth providers)
CREATE TABLE IF NOT EXISTS accounts (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type varchar(255) NOT NULL,
  provider varchar(255) NOT NULL,
  provider_account_id varchar(255) NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type varchar(255),
  scope varchar(255),
  id_token text,
  session_state varchar(255),
  PRIMARY KEY (provider, provider_account_id)
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  session_token varchar(255) NOT NULL PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Verification tokens
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier varchar(255) NOT NULL,
  token varchar(255) NOT NULL,
  expires timestamptz NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ============================================================================
-- 10. PADDLE BILLING COMPATIBILITY (Optional - keep if using Paddle)
-- ============================================================================

-- Webhook Events table (for Paddle webhooks)
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  dedupe_key text UNIQUE NOT NULL, -- Paddle event_id
  payload jsonb NOT NULL,
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_dedupe ON webhook_events(dedupe_key);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Master schema migration completed successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Created tables:';
  RAISE NOTICE '  - Multi-Tenancy: organizations, users, api_keys';
  RAISE NOTICE '  - Messaging: channels, contacts, conversations, messages';
  RAISE NOTICE '  - AI & Knowledge: ai_agents, knowledge_sources, document_chunks';
  RAISE NOTICE '  - Workflows: workflows, workflow_runs';
  RAISE NOTICE '  - Billing: plans, subscriptions, usage';
  RAISE NOTICE '  - Voice AI: call_sessions, call_turns, call_transcripts';
  RAISE NOTICE '  - Webhooks: webhook_subscriptions, webhook_events';
  RAISE NOTICE '  - Audit: audit_logs';
  RAISE NOTICE '  - Auth: accounts, sessions, verification_tokens';
  RAISE NOTICE '========================================';
END $$;
