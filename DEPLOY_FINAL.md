# 🚀 FINAL DEPLOYMENT GUIDE - UNIK AI AGENT

## Prerequisites Checklist

- [x] GitHub repository created and code pushed
- [ ] Vercel account created
- [ ] Vercel Postgres or Neon database provisioned
- [ ] OpenAI API key obtained
- [ ] Stripe account (optional for billing)
- [ ] Email service key (Postmark/SendGrid - optional)

## ONE-COMMAND DEPLOYMENT

### Option 1: Vercel CLI (Fastest)

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from /app directory
cd /app
vercel --prod

# Follow interactive prompts
\`\`\`

### Option 2: Vercel Dashboard

1. Go to https://vercel.com/new
2. Import GitHub repository
3. **Framework**: Next.js
4. **Root Directory**: `./`
5. **Build Command**: `npm run build`
6. **Install Command**: `npm install`
7. Click **Deploy**

## REQUIRED ENVIRONMENT VARIABLES

Set these in Vercel Dashboard → Settings → Environment Variables:

### Critical (App won't work without these)
\`\`\`bash
POSTGRES_URL=postgresql://user:pass@host:5432/db
OPENAI_API_KEY=sk-...
NEXTAUTH_SECRET=generate-random-32-char-string
NEXTAUTH_URL=https://your-app.vercel.app
\`\`\`

### Recommended
\`\`\`bash
OPENAI_MODEL=gpt-4o-mini
ALLOWED_ORIGINS=https://your-app.vercel.app,https://yourdomain.com
CRON_SECRET=generate-random-string-for-cron-jobs
\`\`\`

### Optional (Enable features)
\`\`\`bash
# Stripe
STRIPE_ENABLED=true
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STD_M=price_...
STRIPE_PRICE_STD_Y=price_...
STRIPE_PRICE_PRO_M=price_...
STRIPE_PRICE_PRO_Y=price_...
STRIPE_PRICE_ENT_M=price_...
STRIPE_PRICE_ENT_Y=price_...

# Email
EMAIL_ENABLED=true
POSTMARK_KEY=...
# OR
SENDGRID_KEY=SG...

# Voice
VOICE_ENABLED=true

# n8n
N8N_ENABLED=false
N8N_SIGNING_SECRET=...
N8N_WEBHOOK_URL=https://n8n.yoursite.com/webhook/...

# Widget
WIDGET_ORIGIN=https://agent.unik.ai
\`\`\`

## DATABASE SETUP

### After First Deployment

\`\`\`bash
# Generate SQL migration
npm run db:generate

# Push schema to database
npm run db:push

# Verify tables created
# Connect to your database and run:
# \dt (for Postgres)
\`\`\`

### Run RLS Policies

\`\`\`bash
# Execute the RLS SQL file
psql $POSTGRES_URL < src/lib/security/rls-policies.sql
\`\`\`

## VERIFICATION STEPS

### 1. Test API Endpoints

\`\`\`bash
# Health check
curl https://your-app.vercel.app/api/profile

# Sign up
curl -X POST https://your-app.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","displayName":"Test"}'

# Sign in (save the token)
curl -X POST https://your-app.vercel.app/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'

# Test chat (use token from signin)
curl -X POST https://your-app.vercel.app/api/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!"}'
\`\`\`

### 2. Check Frontend

\`\`\`bash
# Open in browser
https://your-app.vercel.app

# Test pages:
- Landing page: /
- Sign up: /signup
- Sign in: /signin
- Dashboard: /dashboard (requires auth)
\`\`\`

### 3. Verify Logs

\`\`\`bash
# View real-time logs
vercel logs --follow

# Or in Vercel Dashboard > Deployments > Logs
\`\`\`

## CUSTOM DOMAIN SETUP

### 1. Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your domain: `agent.unik.ai`
3. Configure DNS:
   \`\`\`
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   \`\`\`

### 2. Update Environment Variables

\`\`\`bash
NEXTAUTH_URL=https://agent.unik.ai
WIDGET_ORIGIN=https://agent.unik.ai
ALLOWED_ORIGINS=https://agent.unik.ai
\`\`\`

### 3. Redeploy

\`\`\`bash
vercel --prod
\`\`\`

## STRIPE SETUP (Optional)

### 1. Create Products & Prices

\`\`\`bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Create Standard Monthly
stripe products create \
  --name="Standard Plan" \
  --description="500 conversations/month"

stripe prices create \
  --product=prod_XXX \
  --unit-amount=1999 \
  --currency=eur \
  --recurring[interval]=month

# Repeat for all plans (Standard Y, Pro M/Y, Enterprise M/Y)
\`\`\`

### 2. Set Price IDs

Add to Vercel environment variables:
\`\`\`
STRIPE_PRICE_STD_M=price_...
STRIPE_PRICE_STD_Y=price_...
# etc.
\`\`\`

### 3. Configure Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## CRON JOBS

Vercel Cron is configured in `vercel.json`:
- **Monthly reset**: 1st of month at 00:00 UTC
- **Daily reset**: Every day at 00:00 UTC

Verify in Vercel Dashboard → Settings → Cron Jobs

## MONITORING

### Vercel Analytics

Already enabled - view in Dashboard → Analytics

### Logs

\`\`\`bash
# Real-time
vercel logs --follow

# Specific deployment
vercel logs <deployment-url>
\`\`\`

### Database

\`\`\`bash
# Connect to database
psql $POSTGRES_URL

# Check users
SELECT email, plan, usage_cost_eur FROM users_profile;

# Check conversations
SELECT COUNT(*) FROM conversations;
\`\`\`

## TROUBLESHOOTING

### Build Fails

\`\`\`bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
\`\`\`

### Database Connection Error

\`\`\`bash
# Verify connection string format
postgresql://user:pass@host:5432/db?sslmode=require

# Test connection
psql $POSTGRES_URL -c "SELECT 1"
\`\`\`

### OpenAI API Error

\`\`\`bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
\`\`\`

### Widget Not Loading

1. Check `WIDGET_ORIGIN` matches deployment URL
2. Verify `ALLOWED_ORIGINS` includes your domain
3. Check browser console for CORS errors

## ROLLBACK

\`\`\`bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
\`\`\`

## GITHUB SECRETS SETUP

For CI/CD to work, add these secrets in GitHub:
Settings → Secrets and variables → Actions

\`\`\`
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>
\`\`\`

Get these from Vercel Dashboard → Settings → Tokens

## POST-DEPLOYMENT CHECKLIST

- [ ] Database tables created
- [ ] RLS policies applied
- [ ] Test user created successfully
- [ ] Chat API working
- [ ] Profile API returning usage
- [ ] Cost tracking verified in database
- [ ] Cron jobs scheduled
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Stripe webhooks configured (if enabled)
- [ ] Analytics tracking
- [ ] Error monitoring setup

## LIVE URLS

After deployment, your app will be available at:

- **Production**: https://your-app.vercel.app
- **Dashboard**: https://your-app.vercel.app/dashboard
- **API**: https://your-app.vercel.app/api/*
- **Widget**: https://your-app.vercel.app/widget.js (to be served)

## SUPPORT

- **Vercel Docs**: https://vercel.com/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **Next.js**: https://nextjs.org/docs
- **OpenAI API**: https://platform.openai.com/docs

---

**Status**: ✅ Ready for production deployment
**Estimated Time**: 15-30 minutes
**No Code Changes Required**: Deploy as-is
