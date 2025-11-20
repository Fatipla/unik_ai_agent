# Paddle Billing Setup Guide

Ky dokument shpjegon si të konfiguroni Paddle Billing për **Unik AI Agent** platform.

## 🎯 Hyrje

**Paddle** është një platformë e plotë për billing dhe payments për SaaS, që menaxhon automatikisht:
- ✅ Subscriptions (monthly & yearly)
- ✅ VAT/Taksat për EU dhe global
- ✅ Invoicing dhe receipts
- ✅ Failed payment recovery
- ✅ Customer portal për cancel/upgrade
- ✅ Proration dhe credits

---

## 📋 Hapat e Setup

### 1. Krijoni Paddle Account

#### Sandbox Account (për testing):
1. Shkoni në: https://sandbox-vendors.paddle.com/signup
2. Krijoni account të ri
3. Verifikoni email-in tuaj

#### Live Account (për production):
1. Shkoni në: https://vendors.paddle.com/signup
2. Kompletoni business details dhe verification
3. Lidh bank account për payouts

---

### 2. Merrni API Credentials

#### Në Paddle Dashboard:

**Developer Tools → Authentication**

1. **Vendor ID** - Gjeni në top-right corner të dashboard
2. **Client ID** & **Client Secret**:
   - Shkoni në: Developer Tools → API Keys
   - Klikoni "Generate New API Key"
   - Ruani Client ID dhe Client Secret (shfaqet vetëm një herë!)

3. **Webhook Secret**:
   - Shkoni në: Developer Tools → Webhooks
   - Klikoni "Add Webhook"
   - URL: `https://your-domain.com/api/webhooks/paddle`
   - Events: Zgjidhni "All Events" ose:
     - `subscription.created`
     - `subscription.updated`
     - `subscription.canceled`
     - `subscription.paused`
     - `subscription.resumed`
     - `transaction.completed`
     - `transaction.payment_failed`
   - Ruani Webhook Secret

---

### 3. Krijoni Products dhe Prices

Shkoni në: **Catalog → Products**

#### Product 1: Starter Plan

```
Name: Unik AI Agent - Starter
Description: Perfect for small businesses getting started with AI agents
Type: Subscription

Prices:
- Monthly: €19.99/month (trial: 7 days)
- Yearly: €167.92/year (30% discount)

Features:
- 500 conversations/month
- Chatbot Widget & API
- Knowledge Base Training
- Basic Analytics
- Email Support
```

**Ruani Price IDs:**
- `PADDLE_PRICE_STARTER` (monthly)
- `PADDLE_PRICE_STARTER_YEARLY` (yearly)

#### Product 2: Pro Plan

```
Name: Unik AI Agent - Pro
Description: Advanced features for growing businesses
Type: Subscription

Prices:
- Monthly: €29.99/month (trial: 7 days)
- Yearly: €251.92/year (30% discount)

Features:
- 1,500 conversations/month
- Everything in Starter
- Voice Agent (60 min/month)
- WhatsApp Integration
- n8n Webhooks
- Advanced Analytics
- Priority Support
```

**Ruani Price IDs:**
- `PADDLE_PRICE_PRO` (monthly)
- `PADDLE_PRICE_PRO_YEARLY` (yearly)

#### Product 3: Business Plan

```
Name: Unik AI Agent - Business
Description: Enterprise-grade solution with unlimited usage
Type: Subscription

Prices:
- Monthly: €39.99/month (trial: 14 days)
- Yearly: €335.92/year (30% discount)

Features:
- Unlimited conversations
- Everything in Pro
- Unlimited Voice Agent minutes
- Custom Integrations
- Dedicated Support
- SLA Guarantee
- White-label Option
```

**Ruani Price IDs:**
- `PADDLE_PRICE_BUSINESS` (monthly)
- `PADDLE_PRICE_BUSINESS_YEARLY` (yearly)

---

### 4. Konfiguroni Environment Variables

Krijoni ose update `.env.local`:

```env
# Paddle Configuration
PADDLE_VENDOR_ID=123456
PADDLE_CLIENT_ID=your_client_id_here
PADDLE_CLIENT_SECRET=your_client_secret_here
PADDLE_WEBHOOK_SECRET=your_webhook_secret_here
PADDLE_ENV=sandbox  # Ndryshoni në 'live' për production
PADDLE_ENABLED=true

# Product IDs
PADDLE_PRODUCT_STARTER=pro_01abc123
PADDLE_PRODUCT_PRO=pro_01def456
PADDLE_PRODUCT_BUSINESS=pro_01ghi789

# Price IDs (Monthly)
PADDLE_PRICE_STARTER=pri_01starter_monthly
PADDLE_PRICE_PRO=pri_01pro_monthly
PADDLE_PRICE_BUSINESS=pri_01business_monthly

# Price IDs (Yearly)
PADDLE_PRICE_STARTER_YEARLY=pri_01starter_yearly
PADDLE_PRICE_PRO_YEARLY=pri_01pro_yearly
PADDLE_PRICE_BUSINESS_YEARLY=pri_01business_yearly
```

---

### 5. Populate Database me Prices

Ekzekutoni këtë SQL në database tuaj:

```sql
-- Insert Paddle Products
INSERT INTO paddle_products (product_id, name, description)
VALUES
  ('pro_01starter', 'Starter Plan', 'Perfect for small businesses'),
  ('pro_01pro', 'Pro Plan', 'Advanced features for growing businesses'),
  ('pro_01business', 'Business Plan', 'Enterprise-grade solution')
ON CONFLICT (product_id) DO NOTHING;

-- Insert Paddle Prices
INSERT INTO paddle_prices (price_id, product_id, plan_name, amount, currency, interval, trial_days)
VALUES
  -- Starter
  ('pri_starter_m', 'pro_01starter', 'starter', 1999, 'EUR', 'monthly', 7),
  ('pri_starter_y', 'pro_01starter', 'starter', 16792, 'EUR', 'yearly', 7),
  
  -- Pro
  ('pri_pro_m', 'pro_01pro', 'pro', 2999, 'EUR', 'monthly', 7),
  ('pri_pro_y', 'pro_01pro', 'pro', 25192, 'EUR', 'yearly', 7),
  
  -- Business
  ('pri_business_m', 'pro_01business', 'business', 3999, 'EUR', 'monthly', 14),
  ('pri_business_y', 'pro_01business', 'business', 33592, 'EUR', 'yearly', 14)
ON CONFLICT (price_id) DO UPDATE SET
  amount = EXCLUDED.amount,
  trial_days = EXCLUDED.trial_days;
```

**Zëvendësoni `price_id` dhe `product_id` me values nga Paddle Dashboard!**

---

### 6. Test Checkout Flow

#### Në Sandbox Environment:

1. Start server: `npm run dev`
2. Shkoni në: http://localhost:9002/dashboard/billing
3. Klikoni "Upgrade" për një plan
4. Do të hapet Paddle checkout overlay
5. Përdorni test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Failure**: `4000 0000 0000 0002`
   - CVV: çdo 3 shifra
   - Date: çdo datë në të ardhmen

6. Kompletoni checkout
7. Verifikoni që webhook është pranuar në `/api/webhooks/paddle`
8. Kontrolloni që `paddle_customers` table është update

---

### 7. Test Webhook Locally

Përdorni **ngrok** për të testuar webhooks në local:

```bash
# Install ngrok
npm install -g ngrok

# Ekspozoni local server
ngrok http 9002

# Copy HTTPS URL (p.sh. https://abc123.ngrok.io)
# Shkoni në Paddle Dashboard → Webhooks
# Update webhook URL: https://abc123.ngrok.io/api/webhooks/paddle
```

---

### 8. Customer Portal

Për të lejuar users të menaxhojnë subscription:

1. Në billing page, klikoni "Manage Subscription"
2. API do të gjenerojë portal URL përmes `/api/billing/portal`
3. Portal lejon:
   - Update payment method
   - Cancel subscription
   - View invoices
   - Upgrade/downgrade plan

---

## 🧪 Testing Checklist

- [ ] Sandbox account krijuar
- [ ] API credentials marrë dhe ruajtur
- [ ] Products dhe prices krijuar në Paddle
- [ ] Environment variables konfiguruar
- [ ] Database populated me prices
- [ ] Checkout flow tested (success + failure)
- [ ] Webhook events received dhe processed
- [ ] Portal link funksionon
- [ ] Subscription cancel punon
- [ ] Upgrade/downgrade punon

---

## 🚀 Go Live

Kur jeni gati për production:

1. **Krijoni Live Account** në Paddle (jo sandbox)
2. **Kompletoni business verification**
3. **Krijoni të njëjtat products në live environment**
4. **Update `.env.production`:**
   ```env
   PADDLE_ENV=live
   PADDLE_CLIENT_ID=live_client_id
   PADDLE_CLIENT_SECRET=live_secret
   ```
5. **Update webhook URL** në live dashboard
6. **Test me real card** (shumë të vogla, p.sh. €1)
7. **Monitor webhooks** dhe logs

---

## 📞 Support

- **Paddle Documentation**: https://developer.paddle.com
- **API Reference**: https://developer.paddle.com/api-reference
- **Community Forum**: https://paddle.com/community

---

## ⚠️ Important Notes

### Graceful Degradation
Nëse Paddle nuk është konfiguruar (`PADDLE_ENABLED=false`), aplikacioni do të:
- Shfaqë billing page me "Setup Required" message
- Return stub URLs për checkout dhe portal
- Lejojë testing pa billing

### VAT Handling
Paddle menaxhon automatikisht VAT për EU. Ju nuk duhet të llogaritni VAT manually.

### Trial Periods
- Starter/Pro: 7 ditë trial
- Business: 14 ditë trial
- User nuk chargohet deri në fund të trial

### Failed Payments
Paddle do të:
1. Provoj automatikisht 4 herë (në 3, 5, 7, 10 ditë)
2. Dërgoj dunning emails
3. Nëse dështon: subscription.canceled webhook
4. Aplikacioni rikthehet në Free plan

---

## 🔐 Security

- ✅ **Webhook signatures** janë verified në `/api/webhooks/paddle`
- ✅ **Client secrets** janë stored në environment (jo në code)
- ✅ **Paddle handles** PCI compliance për payment data
- ✅ **Database** encrypted at rest (Vercel Postgres)

---

**Të lumtur coding!** 🚀
