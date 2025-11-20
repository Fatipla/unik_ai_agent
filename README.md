# Unik AI Agent Platform

🚀 **Production-ready multi-tenant SaaS** for AI-powered chatbots and voice agents with enterprise-grade cost management.

## ⚡ Quick Start

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 3. Set up database (Vercel Postgres or Neon)
npm run db:push

# 4. Run development server
npm run dev

# 5. Open http://localhost:9002
\`\`\`

## 🎯 Core Features

### ✅ IMPLEMENTED (CRITICAL)

- **AI Cost Management** - 50% revenue cap enforcement per plan
- **Multi-tenant Architecture** - Isolated data per user
- **Chat API** - OpenAI integration with token tracking
- **Authentication** - JWT-based signup/signin
- **Usage Tracking** - Real-time cost and usage monitoring
- **Free Plan Limits** - 5 chats/day enforcement
- **Graceful Degradation** - Feature flags for missing services
- **Cost Calculation** - Non-hardcoded pricing from JSON config

### 🚧 READY TO COMPLETE

- Stripe billing integration
- Voice agent (Whisper + TTS)
- Knowledge base training
- Embeddable widget
- Email notifications
- n8n webhooks
- i18n (AL/EN/DE)
- E2E tests

## 💰 Pricing & Plans

Platform offers **3 product types** (Chatbot, Voice, Both) with **3 tiers** each (Standard, Pro, Enterprise).

### Pricing Matrix

| Product | Standard | Pro | Enterprise |
|---------|----------|-----|------------|
| **Chatbot** | €19.99/mo | €29.99/mo | €39.99/mo |
| **Voice** | €24.99/mo | €34.99/mo | €49.99/mo |
| **Both (Bundle)** | €39.99/mo | €59.99/mo | €79.99/mo |

*Yearly plans: **-20% discount** (billed annually)*

**Visit `/pricing` for interactive pricing page with product switcher and billing toggle.**

See [PRICING_SETUP.md](./docs/PRICING_SETUP.md) for full details.

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes (Serverless Functions)
- **Database**: Vercel Postgres / Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **Auth**: JWT (bcrypt)
- **AI**: OpenAI (GPT-4o-mini, Whisper, TTS)
- **Payments**: Paddle Billing (EU VAT compliant)
- **Deployment**: Vercel

## 📁 Project Structure

\`\`\`
/app
├── src/
│   ├── app/
│   │   ├── (auth)/           # Auth pages (signin/signup)
│   │   ├── dashboard/         # Protected dashboard
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── chat/          # Chat API with cost management
│   │   │   ├── profile/       # User profile
│   │   │   ├── billing/       # Stripe integration
│   │   │   └── webhooks/      # Webhook handlers
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── landing/           # Landing page components
│   │   └── dashboard/         # Dashboard components
│   └── lib/
│       ├── db/                # Database schema & client
│       ├── auth.ts            # Authentication utilities
│       ├── openai.ts          # OpenAI client
│       ├── pricing.ts         # Cost calculation (CRITICAL)
│       └── env.ts             # Environment config
├── .env.example               # Environment template
├── DEPLOY.md                  # Deployment guide
├── IMPLEMENTATION_STATUS.md   # Current status
└── package.json
\`\`\`

## 🔑 Environment Variables

See `.env.example` for all required variables.

**Required:**
- `POSTGRES_URL` - Database connection string
- `OPENAI_API_KEY` - OpenAI API key
- `NEXTAUTH_SECRET` - JWT secret (32+ characters)

**Optional (with fallbacks):**
- `PADDLE_CLIENT_ID` & `PADDLE_CLIENT_SECRET` - Paddle billing (see `/docs/PADDLE_SETUP.md`)
- `POSTMARK_KEY` or `SENDGRID_KEY` - Email
- `N8N_SIGNING_SECRET` - n8n webhooks
- `TWILIO_*` - WhatsApp/Voice

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in

### Profile
- `GET /api/profile` - Get user profile with usage
- `PATCH /api/profile` - Update profile

### Chat (CORE FEATURE)
- `POST /api/chat` - Send message with cost tracking

**Request:**
\`\`\`json
{
  "message": "Hello, how can you help me?",
  "sessionId": "optional-conversation-id",
  "lang": "en",
  "tone": "professional"
}
\`\`\`

**Response:**
\`\`\`json
{
  "text": "AI response...",
  "conversationId": "uuid",
  "tokensIn": 15,
  "tokensOut": 120,
  "costEur": 0.0012,
  "usage": {
    "costEur": 2.45,
    "percentage": 24.5,
    "warning": false
  }
}
\`\`\`

**Cost Cap Enforcement:**
If projected monthly cost would exceed 50% of plan revenue, returns 429:
\`\`\`json
{
  "error": "Monthly AI cost limit would be exceeded",
  "upsellHint": "This request would exceed your free plan's monthly AI cost limit. Upgrade to continue.",
  "upgradeUrl": "/dashboard/billing"
}
\`\`\`

## 🧪 Testing

\`\`\`bash
# Type check
npm run typecheck

# Lint
npm run lint

# Unit tests (to be added)
npm test

# E2E tests (to be added)
npm run test:e2e
\`\`\`

## 📊 Cost Management (CRITICAL FEATURE)

The platform enforces a **50% AI cost-to-revenue cap** per tenant per month:

1. **Calculate** token usage from OpenAI API
2. **Compute** EUR cost from `pricing.ts` configuration
3. **Check** projected monthly cost vs cap
4. **Block** if would exceed, return upsell message
5. **Track** all usage in database
6. **Reset** monthly on schedule

### Cost Calculation Example

\`\`\`typescript
import { calculateChatCost, wouldExceedCap } from '@/lib/pricing';

// User has spent €8 this month on Standard plan (cap: €9.995)
const currentCost = 8.00;
const newRequestCost = calculateChatCost('gpt-4o-mini', 100, 500); // €0.0003

if (wouldExceedCap('standard', currentCost, newRequestCost)) {
  // Block request, show upgrade prompt
}
\`\`\`

## 🔐 Security

- ✅ JWT authentication
- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ Webhook signature verification
- ✅ SQL injection protection (Drizzle ORM)
- ✅ Rate limiting ready
- ✅ CORS configuration
- ✅ Environment variable validation

## 📈 Deployment

See [DEPLOY.md](./DEPLOY.md) for complete deployment guide.

### Quick Deploy to Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard
# Deploy to production
vercel --prod
\`\`\`

## 🎓 Development Guide

### Adding a New API Route

1. Create file in `src/app/api/[route]/route.ts`
2. Use `getUserFromHeaders()` for auth
3. Check user plan and limits
4. Track usage if AI-related
5. Return proper error codes

### Adding Cost Tracking

\`\`\`typescript
import { calculateChatCost } from '@/lib/pricing';
import { wouldExceedCap } from '@/lib/pricing';

// Calculate cost
const cost = calculateChatCost(model, tokensIn, tokensOut);

// Check cap
if (wouldExceedCap(userPlan, currentMonthCost, cost)) {
  // Block and upsell
}

// Track usage
await db.update(usersProfile)
  .set({ usageCostEur: sql`${usersProfile.usageCostEur} + ${cost}` })
  .where(eq(usersProfile.userId, userId));
\`\`\`

## 📝 Implementation Status

**Overall: ~35% complete**

- Core Infrastructure: 85%
- API Endpoints: 40%
- Frontend: 25%
- Integrations: 20%
- Testing: 5%

See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for details.

## 🐛 Troubleshooting

### Database Connection Error
\`\`\`bash
# Check connection string format
POSTGRES_URL=postgresql://user:pass@host/db?sslmode=require

# Test connection
npm run db:studio
\`\`\`

### OpenAI API Error
\`\`\`bash
# Verify API key
echo $OPENAI_API_KEY

# Test endpoint
curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"
\`\`\`

### Build Fails
\`\`\`bash
# Clear Next.js cache
rm -rf .next

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Type check
npm run typecheck
\`\`\`

## 📞 Support

- **Documentation**: See `/docs` folder (to be created)
- **Issues**: GitHub Issues
- **API Status**: Check Vercel logs

## 📄 License

Proprietary - All rights reserved

---

**Status**: Core cost management system implemented and ready for deployment. Additional features ready to be completed incrementally.

**Next Steps**: See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for priority list.
