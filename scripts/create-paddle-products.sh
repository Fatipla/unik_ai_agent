#!/bin/bash

# Unik AI Agent - Paddle Products & Prices Creation Script
# Run this after setting up your Paddle account

echo "🚀 Creating Unik AI Agent Paddle Products and Prices..."
echo ""

# Check if Paddle CLI or curl is available
if ! command -v curl &> /dev/null; then
    echo "❌ curl not found. Please install curl to continue."
    exit 1
fi

# Prompt for Paddle API credentials
read -p "Enter your Paddle API Key (Seller ID): " PADDLE_VENDOR_ID
read -p "Enter your Paddle Auth Code: " PADDLE_AUTH_CODE
read -p "Environment (sandbox/live) [default: sandbox]: " PADDLE_ENV
PADDLE_ENV=${PADDLE_ENV:-sandbox}

if [ "$PADDLE_ENV" = "live" ]; then
    API_URL="https://vendors.paddle.com/api/2.0"
else
    API_URL="https://sandbox-vendors.paddle.com/api/2.0"
fi

echo ""
echo "📦 Creating Products..."

# NOTE: Paddle Classic uses product catalog differently than Stripe
# You'll need to create products and prices in Paddle Dashboard
# This script provides the configuration you should use

cat << EOF

==================================================
PADDLE PRODUCTS CONFIGURATION
==================================================

Create these products in your Paddle Dashboard:
($PADDLE_ENV environment: ${API_URL})

---------------------------------------------------
1. STARTER PLAN
---------------------------------------------------
Name: Unik AI Agent - Starter
Description: Perfect for small businesses getting started with AI agents
Price: €19.99/month (trial: 7 days)
Features:
  - 500 conversations/month
  - Chatbot Widget & API
  - Knowledge Base Training
  - Basic Analytics
  - Email Support

Billing Cycle: Monthly & Yearly (€167.92/year - 30% off)

---------------------------------------------------
2. PRO PLAN
---------------------------------------------------
Name: Unik AI Agent - Pro
Description: Advanced features for growing businesses
Price: €29.99/month (trial: 7 days)
Features:
  - 1,500 conversations/month
  - Everything in Starter
  - Voice Agent (60 min/month)
  - WhatsApp Integration
  - n8n Webhooks
  - Advanced Analytics
  - Priority Support

Billing Cycle: Monthly & Yearly (€251.92/year - 30% off)

---------------------------------------------------
3. BUSINESS PLAN
---------------------------------------------------
Name: Unik AI Agent - Business
Description: Enterprise-grade solution with unlimited usage
Price: €39.99/month (trial: 14 days)
Features:
  - Unlimited conversations
  - Everything in Pro
  - Unlimited Voice Agent minutes
  - Custom Integrations
  - Dedicated Support
  - SLA Guarantee
  - White-label Option

Billing Cycle: Monthly & Yearly (€335.92/year - 30% off)

==================================================

After creating products in Paddle Dashboard:

1. Get Product IDs and Price IDs
2. Add to your .env file:

   # Paddle Configuration
   PADDLE_VENDOR_ID=your_vendor_id
   PADDLE_CLIENT_ID=your_client_id
   PADDLE_CLIENT_SECRET=your_client_secret
   PADDLE_WEBHOOK_SECRET=your_webhook_secret
   PADDLE_ENV=sandbox  # or 'live'
   
   # Product IDs
   PADDLE_PRODUCT_STARTER=pro_01...
   PADDLE_PRODUCT_PRO=pro_01...
   PADDLE_PRODUCT_BUSINESS=pro_01...
   
   # Price IDs (Monthly)
   PADDLE_PRICE_STARTER=pri_01...
   PADDLE_PRICE_PRO=pri_01...
   PADDLE_PRICE_BUSINESS=pri_01...
   
   # Price IDs (Yearly)
   PADDLE_PRICE_STARTER_YEARLY=pri_01...
   PADDLE_PRICE_PRO_YEARLY=pri_01...
   PADDLE_PRICE_BUSINESS_YEARLY=pri_01...

3. Update database with prices:
   
   INSERT INTO paddle_prices (price_id, product_id, plan_name, amount, currency, interval, trial_days)
   VALUES
     ('pri_starter_m', 'pro_starter', 'starter', 1999, 'EUR', 'monthly', 7),
     ('pri_starter_y', 'pro_starter', 'starter', 16792, 'EUR', 'yearly', 7),
     ('pri_pro_m', 'pro_pro', 'pro', 2999, 'EUR', 'monthly', 7),
     ('pri_pro_y', 'pro_pro', 'pro', 25192, 'EUR', 'yearly', 7),
     ('pri_business_m', 'pro_business', 'business', 3999, 'EUR', 'monthly', 14),
     ('pri_business_y', 'pro_business', 'business', 33592, 'EUR', 'yearly', 14);

4. Set up webhook endpoint:
   URL: https://your-domain.com/api/webhooks/paddle
   
5. Test checkout in sandbox before going live

==================================================

📚 For detailed setup instructions, see:
   /app/docs/PADDLE_SETUP.md

🔗 Paddle Dashboard:
   Sandbox: https://sandbox-vendors.paddle.com
   Live: https://vendors.paddle.com

EOF

echo ""
echo "✅ Configuration guide complete!"
echo ""
