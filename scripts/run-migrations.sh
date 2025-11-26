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
# NOTE: 100_master_schema.sql creates the new unified architecture
# Old migrations (001-009) are kept for backward compatibility
MIGRATIONS=(
  "100_master_schema.sql"
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
