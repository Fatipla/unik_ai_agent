# 🚀 Paddle Integration Setup Guide

This guide will help you configure Paddle Billing for the Unik AI Agent platform.

## 📋 Prerequisites

Before you begin, you need:

1. **Paddle Account**: Sign up at [paddle.com](https://paddle.com) (free to start)
2. **Verified Seller Profile**: Complete your business details in Paddle Dashboard
3. **API Access**: Enable API access in your Paddle account settings

---

## 🔑 Step 1: Get Your Paddle Credentials

### 1.1 Get Vendor ID
1. Login to [Paddle Dashboard](https://vendors.paddle.com)
2. Go to **Developer Tools** → **Authentication**
3. Copy your **Vendor ID** (or Seller ID in newer UI)

### 1.2 Get API Keys
1. In the same page, click **Create API Key**
2. Name it: "Unik AI Agent Production"
3. Copy the **Client ID** and **Client Secret**
4. ⚠️ **Save the Client Secret immediately** - you won't see it again!

### 1.3 Get Webhook Secret
1. Go to **Developer Tools** → **Notifications**
2. Click **Add Notification Destination**
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/paddle`
4. Select these event types:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.paused`
   - `subscription.resumed`
   - `transaction.completed`
   - `transaction.payment_failed`
5. Copy the **Webhook Secret**

---

## 🛍️ Step 2: Create Products in Paddle

### Starter Plan
1. Go to **Catalog** → **Products** → **Add Product**
2. Fill in:
   - **Name**: Starter - Unik AI Agent
   - **Description**: 500 conversations per month, Chatbot Widget & API, Knowledge Base Training, Basic Analytics
   - **Tax Category**: SaaS - Software as a Service

### Pro Plan
1. Create another product:
   - **Name**: Pro - Unik AI Agent
   - **Description**: 1,500 conversations per month, Voice Agent, n8n Integration, Advanced Analytics, Priority Support
   - **Tax Category**: SaaS - Software as a Service

### Business Plan
1. Create the third product:
   - **Name**: Business - Unik AI Agent
   - **Description**: Unlimited conversations, Voice Agent, Dedicated Support, Custom Integrations, White-label Options
   - **Tax Category**: SaaS - Software as a Service

---

## 💰 Step 3: Create Prices

For **each product**, create 2 prices (Monthly & Yearly):

### Starter Plan Prices

#### Monthly Price
- **Billing Type**: Subscription
- **Billing Period**: Monthly
- **Amount**: €19.99
- **Currency**: EUR
- **Trial Period**: 7 days
- **Copy the Price ID**: `pri_xxxxx` → Save this as `PADDLE_PRICE_STARTER`

#### Yearly Price
- **Billing Type**: Subscription
- **Billing Period**: Yearly
- **Amount**: €167.92 (30% discount: €19.99 × 12 × 0.7)
- **Currency**: EUR
- **Trial Period**: 7 days
- **Copy the Price ID**: Save this as `PADDLE_PRICE_STARTER_YEARLY`

### Pro Plan Prices

#### Monthly Price
- **Amount**: €29.99
- **Trial Period**: 7 days
- **Copy Price ID** → `PADDLE_PRICE_PRO`

#### Yearly Price
- **Amount**: €251.92 (€29.99 × 12 × 0.7)
- **Trial Period**: 7 days
- **Copy Price ID** → `PADDLE_PRICE_PRO_YEARLY`

### Business Plan Prices

#### Monthly Price
- **Amount**: €39.99
- **Trial Period**: 14 days
- **Copy Price ID** → `PADDLE_PRICE_BUSINESS`

#### Yearly Price
- **Amount**: €335.92 (€39.99 × 12 × 0.7)
- **Trial Period**: 14 days
- **Copy Price ID** → `PADDLE_PRICE_BUSINESS_YEARLY`

---

## ⚙️ Step 4: Configure Environment Variables

Create or update your `.env` file:

```bash
# Paddle Configuration
PADDLE_ENV=sandbox                    # Use 'sandbox' for testing, 'live' for production
PADDLE_VENDOR_ID=your_vendor_id_here
PADDLE_CLIENT_ID=your_client_id_here
PADDLE_CLIENT_SECRET=your_client_secret_here
PADDLE_WEBHOOK_SECRET=your_webhook_secret_here
PADDLE_ENABLED=true

# Paddle Price IDs (from Step 3)
PADDLE_PRICE_STARTER=pri_starter_monthly_id
PADDLE_PRICE_STARTER_YEARLY=pri_starter_yearly_id
PADDLE_PRICE_PRO=pri_pro_monthly_id
PADDLE_PRICE_PRO_YEARLY=pri_pro_yearly_id
PADDLE_PRICE_BUSINESS=pri_business_monthly_id
PADDLE_PRICE_BUSINESS_YEARLY=pri_business_yearly_id

# Your App URL (for webhook callbacks)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 🗄️ Step 5: Seed Database (Optional)

If you want to store product/price info in your database:

```bash
npm run db:seed
```

This will populate the `paddle_prices` table with your product catalog.

---

## ✅ Step 6: Test Your Setup

### 6.1 Test Checkout Flow

1. Start your app: `npm run dev`
2. Go to `/dashboard/billing`
3. Click "Upgrade" on any plan
4. You should see the Paddle checkout overlay
5. Use test card: **4242 4242 4242 4242**

### 6.2 Verify Webhook

1. Complete a test subscription
2. Check your app logs for: `[Paddle Webhook] Subscription created`
3. Verify user plan was updated in database

### 6.3 Test Customer Portal

1. Go to `/dashboard/billing`
2. Click "Manage in Paddle Portal"
3. You should be redirected to Paddle's hosted portal
4. Try updating payment method or canceling

---

## 🚀 Step 7: Go Live

When you're ready for production:

1. Create products/prices in **Live** environment (repeat Steps 2-3)
2. Get **Live** API credentials (Step 1)
3. Update `.env`:
   ```bash
   PADDLE_ENV=live
   PADDLE_VENDOR_ID=your_live_vendor_id
   PADDLE_CLIENT_ID=your_live_client_id
   PADDLE_CLIENT_SECRET=your_live_client_secret
   PADDLE_WEBHOOK_SECRET=your_live_webhook_secret
   ```
4. Update webhook URL to production domain
5. Deploy! 🎉

---

## 🧪 Testing Checklist

- [ ] Checkout opens correctly
- [ ] Test card payment succeeds
- [ ] Webhook received and processed
- [ ] User plan updates in database
- [ ] Customer portal accessible
- [ ] Subscription cancellation works
- [ ] Trial period enforced
- [ ] Invoice generated and accessible

---

## 🐛 Troubleshooting

### Webhook Not Received

**Problem**: Subscriptions created but webhooks not firing

**Solution**:
1. Check webhook URL is publicly accessible
2. Verify webhook secret matches `.env`
3. Check webhook logs in Paddle Dashboard → Developer Tools → Notifications
4. Enable webhook debugging in Paddle

### Checkout Fails

**Problem**: Checkout overlay doesn't open or shows error

**Solution**:
1. Verify `PADDLE_CLIENT_ID` and `PADDLE_CLIENT_SECRET` are correct
2. Check `PADDLE_ENV` matches your environment (sandbox vs live)
3. Ensure price IDs are from the correct environment
4. Check browser console for JavaScript errors

### Portal Link Broken

**Problem**: "Manage in Paddle Portal" returns 404

**Solution**:
1. Ensure customer has an active subscription
2. Verify `paddleCustomerId` exists in database
3. Check API credentials are for correct environment

---

## 📚 Resources

- **Paddle Dashboard**: https://vendors.paddle.com
- **API Documentation**: https://developer.paddle.com
- **Webhook Reference**: https://developer.paddle.com/webhooks/overview
- **Test Cards**: https://developer.paddle.com/concepts/payment-methods/test-cards
- **Support**: https://paddle.com/support

---

## 💡 Pro Tips

1. **Always test in Sandbox first** before going live
2. **Paddle handles VAT/tax automatically** - no extra config needed for EU
3. **Use webhook logs** in Paddle Dashboard to debug issues
4. **Customer portal is built-in** - no need to build cancellation flows
5. **Coupons and discounts** can be created in Paddle Dashboard
6. **Trial periods** are configurable per price
7. **Dunning is automatic** - Paddle retries failed payments

---

## 🔐 Security Notes

- Never commit `.env` file to git
- Rotate API keys regularly
- Use Sandbox for all development/testing
- Verify webhook signatures (already implemented in `/api/webhooks/paddle`)
- Store `PADDLE_CLIENT_SECRET` securely (use environment variables)

---

## 🎉 You're All Set!

Your Paddle integration is now complete. Users can:
- Subscribe to plans with credit card or PayPal
- Manage subscriptions in self-service portal
- Receive automatic invoices
- Enjoy 7-14 day free trials

For questions, reach out to Paddle support or check the docs!

---

**Last Updated**: 2025-01-20
