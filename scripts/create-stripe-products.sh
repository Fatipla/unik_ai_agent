#!/bin/bash

# Unik AI Agent - Stripe Products & Prices Creation Script
# Run this after setting up Stripe account

echo "🚀 Creating Unik AI Agent Stripe Products and Prices..."
echo ""

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI not found. Install from: https://stripe.com/docs/stripe-cli"
    exit 1
fi

# Check if logged in
if ! stripe config --list &> /dev/null; then
    echo "🔐 Please login to Stripe CLI first:"
    stripe login
fi

echo "📦 Creating Products..."

# Standard Plan
STANDARD_PROD=$(stripe products create \
  --name="Standard Plan" \
  --description="500 conversations/month, Chatbot Widget & API, Knowledge Base Training, Basic Analytics" \
  --format=json | jq -r '.id')

echo "✅ Standard Product: $STANDARD_PROD"

# Pro Plan
PRO_PROD=$(stripe products create \
  --name="Pro Plan" \
  --description="1,500 conversations/month, Voice Agent, n8n Integration, Advanced Analytics" \
  --format=json | jq -r '.id')

echo "✅ Pro Product: $PRO_PROD"

# Enterprise Plan
ENT_PROD=$(stripe products create \
  --name="Enterprise Plan" \
  --description="Unlimited conversations, Dedicated Support, Custom Integrations" \
  --format=json | jq -r '.id')

echo "✅ Enterprise Product: $ENT_PROD"

echo ""
echo "💰 Creating Prices..."

# Standard Monthly (€19.99)
STD_M=$(stripe prices create \
  --product=$STANDARD_PROD \
  --unit-amount=1999 \
  --currency=eur \
  --recurring interval=month \
  --format=json | jq -r '.id')

echo "✅ Standard Monthly: $STD_M"

# Standard Yearly (€167.92 = €19.99 * 12 * 0.7)
STD_Y=$(stripe prices create \
  --product=$STANDARD_PROD \
  --unit-amount=16792 \
  --currency=eur \
  --recurring interval=year \
  --format=json | jq -r '.id')

echo "✅ Standard Yearly: $STD_Y"

# Pro Monthly (€29.99)
PRO_M=$(stripe prices create \
  --product=$PRO_PROD \
  --unit-amount=2999 \
  --currency=eur \
  --recurring interval=month \
  --format=json | jq -r '.id')

echo "✅ Pro Monthly: $PRO_M"

# Pro Yearly (€251.92 = €29.99 * 12 * 0.7)
PRO_Y=$(stripe prices create \
  --product=$PRO_PROD \
  --unit-amount=25192 \
  --currency=eur \
  --recurring interval=year \
  --format=json | jq -r '.id')

echo "✅ Pro Yearly: $PRO_Y"

# Enterprise Monthly (€39.99)
ENT_M=$(stripe prices create \
  --product=$ENT_PROD \
  --unit-amount=3999 \
  --currency=eur \
  --recurring interval=month \
  --format=json | jq -r '.id')

echo "✅ Enterprise Monthly: $ENT_M"

# Enterprise Yearly (€335.92 = €39.99 * 12 * 0.7)
ENT_Y=$(stripe prices create \
  --product=$ENT_PROD \
  --unit-amount=33592 \
  --currency=eur \
  --recurring interval=year \
  --format=json | jq -r '.id')

echo "✅ Enterprise Yearly: $ENT_Y"

echo ""
echo "✅ All products and prices created!"
echo ""
echo "📝 Add these to your .env file:"
echo ""
echo "STRIPE_PRICE_STD_M=$STD_M"
echo "STRIPE_PRICE_STD_Y=$STD_Y"
echo "STRIPE_PRICE_PRO_M=$PRO_M"
echo "STRIPE_PRICE_PRO_Y=$PRO_Y"
echo "STRIPE_PRICE_ENT_M=$ENT_M"
echo "STRIPE_PRICE_ENT_Y=$ENT_Y"
echo ""
echo "🎉 Done! Remember to configure webhooks in Stripe Dashboard."
