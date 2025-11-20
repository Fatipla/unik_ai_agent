-- Row Level Security policies

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- Tenants: users can see their own tenant
CREATE POLICY tenant_select ON tenants
  FOR SELECT
  USING (id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

-- Profiles: users can see profiles in their tenant
CREATE POLICY profile_select ON profiles
  FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

-- Subscriptions: users can see their tenant's subscription
CREATE POLICY subscription_select ON subscriptions
  FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

-- Agents: users can CRUD agents in their tenant
CREATE POLICY agent_select ON agents
  FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY agent_insert ON agents
  FOR INSERT
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin', 'editor')));

CREATE POLICY agent_update ON agents
  FOR UPDATE
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin', 'editor')));

CREATE POLICY agent_delete ON agents
  FOR DELETE
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin')));

-- KB Sources: same as agents
CREATE POLICY kb_source_select ON kb_sources
  FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY kb_source_insert ON kb_sources
  FOR INSERT
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin', 'editor')));

-- Conversations: users can see conversations in their tenant
CREATE POLICY conversation_select ON conversations
  FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

-- Messages: users can see messages in conversations they have access to
CREATE POLICY message_select ON messages
  FOR SELECT
  USING (conversation_id IN (
    SELECT id FROM conversations 
    WHERE tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid())
  ));

-- Voice sessions: same as conversations
CREATE POLICY voice_session_select ON voice_sessions
  FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

-- Agent keys: NEVER expose secret in SELECT; encrypt/decrypt only on server
CREATE POLICY agent_key_select ON agent_keys
  FOR SELECT
  USING (agent_id IN (
    SELECT id FROM agents 
    WHERE tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid())
  ));

-- Usage events: users can see their tenant's usage
CREATE POLICY usage_event_select ON usage_events
  FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()));
