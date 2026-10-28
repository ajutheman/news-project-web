#!/usr/bin/env bash
# export-backend.sh : Prepares and exports the backend repository for news-project-backend
set -e

BACKEND_DIR="export/news-project-backend"

echo "Creating backend repository directory at $BACKEND_DIR..."
mkdir -p "$BACKEND_DIR"

echo "Copying Supabase schema, migrations, and seeds..."
cp -r supabase "$BACKEND_DIR/"
cp .env.example "$BACKEND_DIR/"

cat << 'EOF' > "$BACKEND_DIR/README.md"
# The Profit - Malayalam News Portal Backend (Supabase / Postgres)

Postgres database schema, migrations, RLS security policies, and seed data for The Profit News Portal.

## Architecture & Schema
- Postgres 15+ on Supabase (ap-south-1 Mumbai)
- 37 news categories (20 top-level + 17 sub-categories)
- Full-text search with `pg_trgm` and `to_tsvector`
- Row-Level Security (RLS) on all 22 tables
- Razorpay payments and memberships webhook table

## Getting Started
```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Start local Supabase
supabase start

# Run migrations & seed data
supabase db reset
```

## Repository Structure
- `supabase/migrations/0001_init.sql`: Core schema, RLS policies, indexing, triggers
- `supabase/migrations/0002_auth_webhooks.sql`: Auth hooks & webhook idempotency
- `supabase/seed.sql`: 37 categories tree & default subscription plans
- `supabase/seed-articles.sql`: Test news articles
EOF

cat << 'EOF' > "$BACKEND_DIR/.gitignore"
.env*.local
.DS_Store
.supabase
EOF

echo "Initializing git for backend..."
cd "$BACKEND_DIR"
if [ ! -d ".git" ]; then
  git init
  git branch -M main
  git remote add origin https://github.com/ajutheman/news-project-backend.git
fi
git add .
git commit -m "feat: initial Supabase backend schema, migrations, and seeds" || true
git branch -f develop main

echo "Backend repository prepared at $BACKEND_DIR!"
echo "To push:"
echo "  cd $BACKEND_DIR"
echo "  git push -u origin main"
echo "  git push -u origin develop"
