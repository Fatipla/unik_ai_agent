-- Conversations & Voice Calls Schema
-- Tables for storing chat and voice interactions

-- Conversations table (Chatbot messages)
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id varchar(255),
  message text NOT NULL,
  response text NOT NULL,
  type varchar(50) DEFAULT 'chatbot', -- chatbot, voice
  tokens_used integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

-- Voice Calls table
CREATE TABLE IF NOT EXISTS voice_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  call_sid varchar(255),
  duration integer DEFAULT 0, -- in seconds
  status varchar(50) DEFAULT 'completed', -- initiated, in-progress, completed, failed
  transcript text,
  recording_url text,
  cost_eur decimal(10, 4) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  ended_at timestamp with time zone
);

CREATE INDEX IF NOT EXISTS idx_voice_calls_user_id ON voice_calls(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_calls_created_at ON voice_calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_calls_status ON voice_calls(status);

-- Admin users table (for role-based access)
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  role varchar(50) DEFAULT 'admin', -- admin, super_admin
  permissions text, -- JSON array of permissions
  created_at timestamp with time zone DEFAULT now()
);

-- Analytics aggregation table (for performance)
CREATE TABLE IF NOT EXISTS daily_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  total_users integer DEFAULT 0,
  active_users integer DEFAULT 0,
  total_conversations integer DEFAULT 0,
  total_voice_calls integer DEFAULT 0,
  total_revenue_eur decimal(10, 2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(date)
);

CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date DESC);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Conversations and calls schema created successfully';
END $$;
