# Pricing Configuration Guide

## Overview

Pricing page përdor **Product Switcher** (Chatbot | Voice | Both) dhe **Billing Toggle** (Monthly | Yearly -20%).

---

## 📊 Pricing Matrix

### A) CHATBOT Plans

| Tier | Monthly | Yearly (monthly eq.) | Annual Total | Discount |
|------|---------|---------------------|--------------|----------|
| **Standard** | €19.99/mo | €15.99/mo | €191.88/yr | 20% |
| **Pro** | €29.99/mo | €23.99/mo | €287.88/yr | 20% |
| **Enterprise** | €39.99/mo | €31.99/mo | €383.88/yr | 20% |

**Features:**
- **Standard**: 10k messages, 1M tokens, 1 seat, basic analytics
- **Pro**: 100k messages, 10M tokens, 5 seats, custom branding, priority support
- **Enterprise**: 200k messages, 20M tokens, 10 seats, SSO, dedicated manager

---

### B) VOICE Plans

| Tier | Monthly | Yearly (monthly eq.) | Annual Total | Discount |
|------|---------|---------------------|--------------|----------|
| **Standard** | €24.99/mo | €19.99/mo | €239.88/yr | 20% |
| **Pro** | €34.99/mo | €27.99/mo | €335.88/yr | 20% |
| **Enterprise** | €49.99/mo | €39.99/mo | €479.88/yr | 20% |

**Features:**
- **Standard**: 300 min, 1 seat, voice agent (STT+TTS), call recording
- **Pro**: 3,000 min, 5 seats, custom voice profiles, barge-in, analytics
- **Enterprise**: 6,000 min, 10 seats, SSO, SLA, dedicated manager

---

### C) BUNDLE (Chatbot + Voice)

| Tier | Monthly | Yearly (monthly eq.) | Annual Total | Discount |
|------|---------|---------------------|--------------|----------|
| **Standard** | €39.99/mo | €31.99/mo | €383.88/yr | 20% |
| **Pro** | €59.99/mo | €47.99/mo | €575.88/yr | 20% |
| **Enterprise** | €79.99/mo | €63.99/mo | €767.88/yr | 20% |

**Features:**
- **Standard**: 20k messages, 600 min, 2M tokens, 3 seats, both agents
- **Pro**: 200k messages, 6,000 min, 20M tokens, 10 seats, all features
- **Enterprise**: Unlimited messages, unlimited minutes, unlimited tokens, unlimited seats

---

## 🔧 Paddle Configuration

### 1. Create Products in Paddle Dashboard

Go to **Catalog → Products** and create 9 products:

#### Chatbot Products:
```
1. Unik AI - Chatbot Standard
2. Unik AI - Chatbot Pro
3. Unik AI - Chatbot Enterprise
```

#### Voice Products:
```
4. Unik AI - Voice Standard
5. Unik AI - Voice Pro
6. Unik AI - Voice Enterprise
```

#### Bundle Products:
```
7. Unik AI - Bundle Standard
8. Unik AI - Bundle Pro
9. Unik AI - Bundle Enterprise
```

---

### 2. Create Prices (18 total)

For **each product**, create 2 prices:

#### Example for "Chatbot Standard":
- **Monthly**: €19.99/month (recurring)
  - Copy Price ID → `PRICE_CHATBOT_STANDARD_M`
  
- **Yearly**: €191.88/year (recurring, annual)
  - Copy Price ID → `PRICE_CHATBOT_STANDARD_Y`

Repeat for all 9 products (2 prices each = 18 total).

---

### 3. Configure Environment Variables

Update `.env.local`:

```env
# Chatbot
PRICE_CHATBOT_STANDARD_M=pri_01abc...
PRICE_CHATBOT_STANDARD_Y=pri_01def...
PRICE_CHATBOT_PRO_M=pri_01ghi...
PRICE_CHATBOT_PRO_Y=pri_01jkl...
PRICE_CHATBOT_ENTERPRISE_M=pri_01mno...
PRICE_CHATBOT_ENTERPRISE_Y=pri_01pqr...

# Voice
PRICE_VOICE_STANDARD_M=pri_01stu...
PRICE_VOICE_STANDARD_Y=pri_01vwx...
PRICE_VOICE_PRO_M=pri_01yza...
PRICE_VOICE_PRO_Y=pri_01bcd...
PRICE_VOICE_ENTERPRISE_M=pri_01efg...
PRICE_VOICE_ENTERPRISE_Y=pri_01hij...

# Bundle
PRICE_BUNDLE_STANDARD_M=pri_01klm...
PRICE_BUNDLE_STANDARD_Y=pri_01nop...
PRICE_BUNDLE_PRO_M=pri_01qrs...
PRICE_BUNDLE_PRO_Y=pri_01tuv...
PRICE_BUNDLE_ENTERPRISE_M=pri_01wxy...
PRICE_BUNDLE_ENTERPRISE_Y=pri_01zab...
```

---

### 4. Update Database

Insert price records into `paddle_prices` table:

```sql
-- Chatbot
INSERT INTO paddle_prices (price_id, product_id, plan_name, amount, currency, interval, trial_days)
VALUES
  ('pri_chatbot_standard_m', 'pro_chatbot_standard', 'standard', 1999, 'EUR', 'monthly', 14),
  ('pri_chatbot_standard_y', 'pro_chatbot_standard', 'standard', 19188, 'EUR', 'yearly', 14),
  ('pri_chatbot_pro_m', 'pro_chatbot_pro', 'pro', 2999, 'EUR', 'monthly', 14),
  ('pri_chatbot_pro_y', 'pro_chatbot_pro', 'pro', 28788, 'EUR', 'yearly', 14),
  ('pri_chatbot_enterprise_m', 'pro_chatbot_enterprise', 'enterprise', 3999, 'EUR', 'monthly', 30),
  ('pri_chatbot_enterprise_y', 'pro_chatbot_enterprise', 'enterprise', 38388, 'EUR', 'yearly', 30),
  
-- Voice
  ('pri_voice_standard_m', 'pro_voice_standard', 'standard', 2499, 'EUR', 'monthly', 14),
  ('pri_voice_standard_y', 'pro_voice_standard', 'standard', 23988, 'EUR', 'yearly', 14),
  ('pri_voice_pro_m', 'pro_voice_pro', 'pro', 3499, 'EUR', 'monthly', 14),
  ('pri_voice_pro_y', 'pro_voice_pro', 'pro', 33588, 'EUR', 'yearly', 14),
  ('pri_voice_enterprise_m', 'pro_voice_enterprise', 'enterprise', 4999, 'EUR', 'monthly', 30),
  ('pri_voice_enterprise_y', 'pro_voice_enterprise', 'enterprise', 47988, 'EUR', 'yearly', 30),
  
-- Bundle
  ('pri_bundle_standard_m', 'pro_bundle_standard', 'standard', 3999, 'EUR', 'monthly', 14),
  ('pri_bundle_standard_y', 'pro_bundle_standard', 'standard', 38388, 'EUR', 'yearly', 14),
  ('pri_bundle_pro_m', 'pro_bundle_pro', 'pro', 5999, 'EUR', 'monthly', 14),
  ('pri_bundle_pro_y', 'pro_bundle_pro', 'pro', 57588, 'EUR', 'yearly', 14),
  ('pri_bundle_enterprise_m', 'pro_bundle_enterprise', 'enterprise', 7999, 'EUR', 'monthly', 30),
  ('pri_bundle_enterprise_y', 'pro_bundle_enterprise', 'enterprise', 76788, 'EUR', 'yearly', 30)
ON CONFLICT (price_id) DO NOTHING;
```

**Note**: Replace `price_id` and `product_id` me actual values nga Paddle Dashboard!

---

## 🧪 Testing Checklist

- [ ] All 18 PRICE_* env vars configured
- [ ] Paddle products created (9 products)
- [ ] Paddle prices created (18 prices: 2 per product)
- [ ] Database seeded with prices
- [ ] Visit `/pricing` page
- [ ] Toggle between Chatbot | Voice | Both - cards update correctly
- [ ] Toggle Monthly/Yearly - prices show -20% discount
- [ ] "Save 20%" badge appears when Yearly selected
- [ ] Click "Start Free Trial" - redirects to Paddle checkout
- [ ] Checkout uses correct price ID (check URL or webhook)
- [ ] Complete test purchase in sandbox
- [ ] Webhook updates subscription in database

---

## 🚀 Go Live

When ready for production:

1. Create same products in **live** Paddle environment
2. Get new price IDs for live
3. Update `.env.production` with live price IDs
4. Set `PADDLE_ENV=live`
5. Test with small real payment
6. Monitor webhooks

---

## 📐 Discount Calculation

Yearly pricing uses **20% discount**:

```
Yearly Price = Monthly Price × 12 × 0.80

Example (Bundle Pro):
€59.99 × 12 × 0.80 = €575.90/year
€575.90 / 12 = €47.99/month equivalent
```

---

## 🎨 UI Components

### Product Switcher
Segmented control with 3 options:
- Chatbot (text-only plans)
- Voice Agent (voice-only plans)
- Both (bundle plans with Chatbot + Voice)

### Billing Toggle
Two options:
- Monthly (default)
- Yearly (shows -20% badge)

### Pricing Cards
- 3 columns: Standard | Pro | Enterprise
- Pro is highlighted (scale-105, border-primary)
- Features list with checkmarks
- CTA button opens Paddle checkout

---

## 🔗 API Flow

```
User clicks "Start Free Trial"
    ↓
POST /api/billing/checkout
    body: { planKey: "CHATBOT_STANDARD", period: "M" }
    ↓
Server maps: CHATBOT_STANDARD_M → env.PRICE_CHATBOT_STANDARD_M
    ↓
Paddle creates checkout session
    ↓
User completes payment
    ↓
Webhook: subscription.created
    ↓
Database updated: paddle_customers + usersProfile.plan
```

---

## ⚙️ Plan Keys

Frontend sends `planKey` në këtë format:

```
CHATBOT_STANDARD
CHATBOT_PRO
CHATBOT_ENTERPRISE
VOICE_STANDARD
VOICE_PRO
VOICE_ENTERPRISE
BUNDLE_STANDARD
BUNDLE_PRO
BUNDLE_ENTERPRISE
```

API combines me `period` ('M' ose 'Y') për të marrë `PRICE_*` env var.

---

**Setup Complete!** 🎉
