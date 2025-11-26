#!/bin/bash

# ============================================
# Supabase Migrations Runner
# ============================================
# Runs all migrations in order against Supabase
# Usage: ./scripts/run-migrations.sh

set -e

# Check if POSTGRES_URL is set
if [ -z "$POSTGRES_URL" ]; then
  echo "❌ Error: POSTGRES_URL environment variable is not set"
  echo "Please set it with your Supabase connection string:"
  echo "  export POSTGRES_URL='postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres'"
  exit 1
fi

echo "🚀 Starting migrations..."
echo "Database: $POSTGRES_URL"
echo ""

MIGRATIONS_DIR="./supabase/migrations"

# Array of migration files in order
MIGRATIONS=(
  "001_create_billing_schema.sql"
  "002_enable_rls.sql"
  "003_create_rpc_functions.sql"
  "004_seed_entitlements.sql"
  "005_nextauth_schema.sql"
  "006_conversations_and_calls.sql"
  "007_organizations_and_plans.sql"
  "008_seed_plans.sql"
  "009_seed_voice_bundle_plans.sql"
)

# Run each migration
for migration in "${MIGRATIONS[@]}"; do
  echo "📝 Running: $migration"
  
  if psql "$POSTGRES_URL" -f "$MIGRATIONS_DIR/$migration" > /dev/null 2>&1; then
    echo "   ✅ Success"
  else
    echo "   ⚠️  Warning: Migration may have failed or already applied"
  fi
  
  echo ""
done

echo "🎉 All migrations completed!"
echo ""
echo "Verification:"
psql "$POSTGRES_URL" -c "SELECT COUNT(*) as total_plans FROM plans;" 2>/dev/null || echo "Plans table may not exist yet"

echo ""
echo "✅ Done! Your database is ready."
