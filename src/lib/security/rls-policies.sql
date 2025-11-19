-- Row Level Security Policies for Unik AI Agent
-- Run these after creating tables

-- Enable RLS on all user tables
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_calls ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "Users can view own profile" ON users_profile
  FOR SELECT USING (user_id = current_user_id());

-- Users can update their own profile (except protected fields)
CREATE POLICY "Users can update own profile" ON users_profile
  FOR UPDATE USING (user_id = current_user_id())
  WITH CHECK (
    user_id = current_user_id() AND
    plan = (SELECT plan FROM users_profile WHERE user_id = current_user_id()) AND
    usage_cost_eur = (SELECT usage_cost_eur FROM users_profile WHERE user_id = current_user_id()) AND
    usage_ceil_hit = (SELECT usage_ceil_hit FROM users_profile WHERE user_id = current_user_id())
  );

-- Only service role can update plan, usage, cost
-- (Client connections cannot bypass this)

-- Conversations: users own their data
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (user_id = current_user_id());

CREATE POLICY "Users can insert own conversations" ON conversations
  FOR INSERT WITH CHECK (user_id = current_user_id());

-- Messages: users can only access messages in their conversations
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = current_user_id()
    )
  );

CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = current_user_id()
    )
  );

-- Emails: users own their emails
CREATE POLICY "Users can view own emails" ON emails
  FOR SELECT USING (user_id = current_user_id());

CREATE POLICY "Users can insert own emails" ON emails
  FOR INSERT WITH CHECK (user_id = current_user_id());

-- Stripe customers: read only
CREATE POLICY "Users can view own stripe data" ON stripe_customers
  FOR SELECT USING (user_id = current_user_id());

-- Training jobs: users own their jobs
CREATE POLICY "Users can view own training jobs" ON training_jobs
  FOR SELECT USING (user_id = current_user_id());

CREATE POLICY "Users can insert own training jobs" ON training_jobs
  FOR INSERT WITH CHECK (user_id = current_user_id());

-- Voice calls: users own their calls
CREATE POLICY "Users can view own voice calls" ON voice_calls
  FOR SELECT USING (user_id = current_user_id());

CREATE POLICY "Users can insert own voice calls" ON voice_calls
  FOR INSERT WITH CHECK (user_id = current_user_id());

-- Helper function to get current user ID from JWT
CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid AS $$
  SELECT nullif(current_setting('app.user_id', TRUE), '')::uuid;
$$ LANGUAGE SQL STABLE;
