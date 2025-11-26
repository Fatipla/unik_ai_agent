# 🚀 HOW TO RUN - Unik AI Agent Platform

## Quick Start Guide for Development & Production

---

## 📋 Prerequisites

- Node.js 18+ and pnpm 10+
- Supabase account with a project
- Vercel account (for deployment)
- Git (for version control)

---

## 🏗️ Development Setup (Local)

### 1. Clone Repository

```bash
git clone https://github.com/Fatipla/unik_ai_agent.git
cd unik_ai_agent
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local and add your credentials
nano .env.local
```

**Minimum required variables:**
```bash
# Supabase Database
POSTGRES_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

# NextAuth
NEXTAUTH_SECRET=your-random-32-char-secret
NEXTAUTH_URL=http://localhost:9002

# OpenAI (for chat)
OPENAI_API_KEY=sk-xxxxx
OPENAI_MODEL=gpt-4o-mini
```

**Get NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Run Database Migrations

**Option A: Using script (requires psql installed):**
```bash
export POSTGRES_URL='your-supabase-connection-string'
./scripts/run-migrations.sh
```

**Option B: Manual (via Supabase Dashboard):**
1. Go to Supabase Dashboard → SQL Editor
2. Copy content from each migration file in `supabase/migrations/`
3. Run them in order (001 → 009)

**Verify migrations:**
```bash
# Should return 18
psql $POSTGRES_URL -c "SELECT COUNT(*) FROM plans;"
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit: `http://localhost:9002`

---

## 🧪 Testing APIs Locally

### Test Plans API:

```bash
# List all plans
curl http://localhost:9002/api/v1/plans | jq

# Expected: 18 plans returned
```

```bash
# Filter by product
curl "http://localhost:9002/api/v1/plans?product_type=bundle&billing_period=monthly" | jq
```

```bash
# Get comparison structure
curl http://localhost:9002/api/v1/plans/comparison | jq
```

### Test Authentication:

1. Go to `http://localhost:9002/dev-setup`
2. Create admin user:
   - Email: admin@test.com
   - Password: admin12345
   - Setup Key: change-me-in-production
3. Login at `/login`
4. Access `/admin` dashboard

### Test Pricing Page:

1. Visit `http://localhost:9002/pricing`
2. Switch between Chatbot/Voice/Bundle tabs
3. Toggle Monthly/Yearly billing
4. Verify cards display correctly

---

## 🚀 Production Deployment (Vercel)

### 1. Connect Repository to Vercel

1. Go to https://vercel.com/new
2. Import Git Repository: `Fatipla/unik_ai_agent`
3. Select branch: `main` (or `unik-ai-emergent`)
4. Click **Import**

### 2. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Database (REQUIRED)
POSTGRES_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

# Auth (REQUIRED)
NEXTAUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=https://your-vercel-app.vercel.app

# Google OAuth (OPTIONAL)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Paddle Billing (REQUIRED for payments)
PADDLE_VENDOR_ID=123456
PADDLE_CLIENT_ID=blt_xxx
PADDLE_CLIENT_SECRET=xxx
PADDLE_WEBHOOK_SECRET=pdl_xxx
PADDLE_ENV=sandbox  # Change to 'live' for production

# Paddle Price IDs (PUBLIC - must start with NEXT_PUBLIC_)
NEXT_PUBLIC_PADDLE_PRICE_CHATBOT_STANDARD_M=pri_01xxx
NEXT_PUBLIC_PADDLE_PRICE_CHATBOT_STANDARD_Y=pri_01yyy
# ... (add all 18 price IDs)

# OpenAI (REQUIRED for chat)
OPENAI_API_KEY=sk-xxxxx
OPENAI_MODEL=gpt-4o-mini

# Admin Setup (OPTIONAL - for dev)
ADMIN_SETUP_SECRET=change-me-in-production
```

### 3. Deploy

```bash
# Push to trigger auto-deploy
git push origin main
```

Vercel will:
- Detect the push
- Run `pnpm build`
- Deploy automatically

### 4. Run Migrations (Production Database)

Use Supabase Dashboard SQL Editor to run all 9 migrations.

### 5. Verify Production

```bash
curl https://your-vercel-app.vercel.app/api/v1/plans | jq
# Should return 18 plans
```

---

## 📝 Common Commands

### Development:
```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server locally
pnpm typecheck        # TypeScript type checking
pnpm lint             # ESLint checking
```

### Database:
```bash
pnpm db:studio        # Open Drizzle Studio (GUI)
pnpm db:generate      # Generate Drizzle migrations
pnpm db:push          # Push schema changes to DB
```

### Testing:
```bash
pnpm test             # Run Jest tests
pnpm test:e2e         # Run Playwright E2E tests
```

---

## 🔍 Verification Checklist

### Local Development:
- [ ] `pnpm dev` starts without errors
- [ ] `http://localhost:9002` loads homepage
- [ ] `/pricing` shows 18 plans grouped by product
- [ ] `/login` and `/signup` forms work
- [ ] `/dashboard` requires authentication
- [ ] `/admin` requires admin user
- [ ] API `/api/v1/plans` returns 18 plans

### Production:
- [ ] Vercel deployment successful
- [ ] All environment variables set
- [ ] Migrations run in Supabase
- [ ] Plans API returns data
- [ ] Homepage loads
- [ ] Pricing page displays correctly
- [ ] Authentication flow works
- [ ] Paddle checkout initiates (if configured)

---

## 🐛 Troubleshooting

### Build Fails with "Module not found"

**Fix:**
```bash
rm -rf node_modules .next
pnpm install
pnpm build
```

### "POSTGRES_URL is not defined"

**Fix:** Add to `.env.local` or Vercel env vars

### "relation 'plans' does not exist"

**Fix:** Run database migrations (see Step 4 above)

### Plans API returns empty array

**Fix:**
```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM plans WHERE is_active = true;
-- If 0, run migrations 008 and 009
```

### "Failed to fetch" errors in browser

**Cause:** Backend not running or CORS issue

**Fix:**
- Check if dev server is running on port 9002
- Verify `NEXTAUTH_URL` matches your domain

---

## 📚 Key Endpoints

### Public Pages:
- `/` - Homepage
- `/pricing` - Pricing with product selector
- `/features` - Features showcase
- `/installation` - Integration guides
- `/contact` - Contact form
- `/login` - Login page
- `/signup` - Registration page

### Protected Pages:
- `/dashboard` - User dashboard (requires auth)
- `/admin` - Super admin dashboard (requires admin role)

### API Endpoints:
- `GET /api/v1/plans` - List all plans (with filters)
- `GET /api/v1/plans/comparison` - Grouped comparison data
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/setup-admin` - Create admin user (dev only)
- `GET /api/conversations` - User's chat history
- `GET /api/voice-calls` - User's call history
- `POST /api/chat` - OpenAI chat endpoint

---

## 🎯 Next Steps After Setup

1. **Create Admin User:**
   - Visit `/dev-setup`
   - Create your admin account
   - Login and access `/admin`

2. **Test Pricing Flow:**
   - Go to `/pricing`
   - Switch products and billing periods
   - Verify all 18 plans display

3. **Configure Paddle:**
   - Create products in Paddle Dashboard
   - Get price IDs for all 18 plans
   - Add to Vercel env vars

4. **Test Authentication:**
   - Register a test user
   - Login/Logout
   - Access protected routes

5. **Monitor Logs:**
   - Vercel → Deployment → Functions → Logs
   - Supabase → Logs Explorer

---

## 📖 Documentation Links

- **Full Supabase Integration:** See `SUPABASE_INTEGRATION_GUIDE.md`
- **Pricing Specification:** See `PRICING_REFACTOR_COMPLETE.md`
- **Dashboard Features:** See `DASHBOARDS_COMPLETE.md`
- **Dev Access:** See `DEV_ACCESS_GUIDE.md`

---

## ✅ Success!

When you see:
- ✅ Dev server running on port 9002
- ✅ 18 plans in database
- ✅ API returning data
- ✅ Pages loading without errors
- ✅ Vercel deployment successful

**You're ready to go! 🎉**

---

**Need Help?**
- Check Vercel logs for deployment issues
- Check Supabase logs for database issues
- Review `SUPABASE_INTEGRATION_GUIDE.md` for detailed steps
- Check browser console for frontend errors

**Last Updated:** November 2024
