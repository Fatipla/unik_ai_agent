-- Create test user for login testing
-- Password: test123 (hashed with bcrypt)
INSERT INTO users_profile (
  user_id,
  email,
  password_hash,
  display_name,
  plan,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'test@unik.ai',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- test123
  'Test User',
  'free',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
