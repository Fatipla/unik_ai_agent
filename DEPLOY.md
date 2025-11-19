# Deployment Guide - Unik AI Agent

## Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **Database** - Vercel Postgres or Neon (https://neon.tech)
3. **OpenAI API Key** - Get from https://platform.openai.com
4. **Stripe Account** (optional) - https://stripe.com
5. **GitHub Repository** - Code pushed to GitHub

## Quick Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /app
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set project name: unik-ai-agent
# - Choose framework: Next.js
# - Override build command: npm run build
# - Override output directory: .next

# Set environment variables
vercel env add POSTGRES_URL
vercel env add OPENAI_API_KEY
vercel env add NEXTAUTH_SECRET
vercel env add STRIPE_SECRET_KEY
# ... add all variables from .env.example

# Deploy to production
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure Project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Add Environment Variables:
   ```
   POSTGRES_URL=postgresql://...
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-4o-mini
   NEXTAUTH_SECRET=generate-random-32-char-string
   NEXTAUTH_URL=https://your-domain.vercel.app
   STRIPE_ENABLED=true
   STRIPE_SECRET_KEY=sk_...
   (add all from .env.example)
   ```

5. Click "Deploy"

## Database Setup

### Using Vercel Postgres

```bash
# Create database in Vercel Dashboard
# Go to Storage > Create Database > Postgres

# Copy connection string to POSTGRES_URL

# Push schema
npm run db:generate  # Generate migration
npm run db:push      # Push to database
```

### Using Neon

```bash
# Create project at https://neon.tech
# Copy connection string

# Add to Vercel environment variables:
POSTGRES_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require

# Push schema
npm run db:push
```

## Stripe Setup

### 1. Create Products and Prices

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe
# or download from https://stripe.com/docs/stripe-cli

# Login
stripe login

# Create products and prices
stripe products create --name="Standard Plan" --description="500 conversations/month"
stripe prices create --product=prod_xxx --unit-amount=1999 --currency=eur --recurring[interval]=month

# Repeat for all plans and yearly options

# Copy price IDs to environment variables
STRIPE_PRICE_STD_M=price_...
STRIPE_PRICE_STD_Y=price_...
# ... etc
```

### 2. Set up Webhook

```bash
# In Stripe Dashboard > Developers > Webhooks
# Add endpoint: https://your-domain.vercel.app/api/webhooks/stripe

# Select events:
# - customer.subscription.created
# - customer.subscription.updated
# - customer.subscription.deleted
# - invoice.payment_succeeded
# - invoice.payment_failed

# Copy webhook signing secret
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Post-Deployment Setup

### 1. Test the API

```bash
# Sign up
curl -X POST https://your-domain.vercel.app/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"password123","displayName":"Test User"}'

# Sign in
curl -X POST https://your-domain.vercel.app/api/auth/signin \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"password123"}'

# Get profile (use token from signin)
curl https://your-domain.vercel.app/api/profile \\
  -H "Authorization: Bearer YOUR_TOKEN"

# Test chat
curl -X POST https://your-domain.vercel.app/api/chat \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"Hello, how are you?"}'
```

### 2. Create Seed Data

```bash
# Run seed script (to be created)
npm run seed
```

### 3. Monitor Logs

```bash
# View real-time logs
vercel logs --follow

# Or in Vercel Dashboard > Deployments > View Logs
```

## Domain Setup

### Custom Domain

1. Go to Vercel Dashboard > Project > Settings > Domains
2. Add your domain: `agent.unik.ai`
3. Configure DNS:
   ```
   CNAME  @  cname.vercel-dns.com
   ```
4. Wait for DNS propagation (up to 24 hours)
5. Update environment variables:
   ```
   NEXTAUTH_URL=https://agent.unik.ai
   WIDGET_ORIGIN=https://agent.unik.ai
   ALLOWED_ORIGINS=https://agent.unik.ai
   ```

## Continuous Deployment

### GitHub Integration

Vercel automatically deploys:
- **main branch** → Production
- **Pull requests** → Preview deployments

### Manual Deployment

```bash
# Production
vercel --prod

# Preview
vercel
```

## Monitoring & Observability

### Vercel Analytics

```bash
# Add to package.json
npm install @vercel/analytics

# Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking

Consider integrating:
- **Sentry** - Error tracking
- **LogDNA/Datadog** - Log aggregation
- **PostHog** - Product analytics

## Security Checklist

- [ ] Generate strong `NEXTAUTH_SECRET` (min 32 characters)
- [ ] Use environment variables for all secrets
- [ ] Enable Vercel Preview Protection for PRs
- [ ] Set up Stripe webhook signature verification
- [ ] Configure CORS properly in `ALLOWED_ORIGINS`
- [ ] Use Stripe test mode initially
- [ ] Set up database backups
- [ ] Enable Vercel Authentication for admin routes
- [ ] Review and test all API endpoints
- [ ] Set up rate limiting (Vercel Edge Config)

## Troubleshooting

### Build Fails

```bash
# Check logs
vercel logs

# Common issues:
# - Missing environment variables
# - TypeScript errors: npm run typecheck
# - Database connection: check POSTGRES_URL
```

### Database Connection Issues

```bash
# Test connection
psql $POSTGRES_URL

# Check SSL requirement (Neon needs sslmode=require)
POSTGRES_URL=postgresql://...?sslmode=require
```

### API Returns 500

```bash
# Check Vercel logs
vercel logs --follow

# Common causes:
# - Missing OPENAI_API_KEY
# - Invalid POSTGRES_URL
# - Stripe keys mismatch (test vs live)
```

## Rollback

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

## Cost Optimization

- Use Vercel Free tier for development
- Upgrade to Pro for production ($20/month)
- Neon Free tier: 3GB storage (sufficient for MVP)
- Vercel Postgres: Pay as you go
- Monitor OpenAI usage closely (cost cap enforced)

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Stripe Docs**: https://stripe.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs

## Next Steps

After successful deployment:

1. ✅ Test all API endpoints
2. ✅ Create test user accounts
3. ✅ Verify cost tracking works
4. ✅ Test Stripe checkout flow
5. ✅ Deploy widget code
6. ✅ Set up monitoring
7. ✅ Create documentation site
8. ✅ Run E2E tests
9. ✅ Performance audit
10. ✅ Security audit

---

**Deployment Status**: Ready for staging/production deployment
**Estimated Time**: 30-45 minutes for full setup
**Prerequisites Ready**: Database schema, API routes, cost management
