-- NextAuth.js Schema Migration
-- Creates tables needed for NextAuth with Drizzle adapter

-- Users table (NextAuth core)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255),
  email varchar(255) NOT NULL UNIQUE,
  email_verified timestamp with time zone,
  image text,
  password_hash varchar(255),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

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
  expires timestamp with time zone NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Verification tokens
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier varchar(255) NOT NULL,
  token varchar(255) NOT NULL,
  expires timestamp with time zone NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompts_month integer DEFAULT 0,
  prompts_day integer DEFAULT 0,
  last_reset_day timestamp with time zone DEFAULT now(),
  last_reset_month timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_user_id ON usage(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_last_reset ON usage(last_reset_month);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'NextAuth schema created successfully';
END $$;
