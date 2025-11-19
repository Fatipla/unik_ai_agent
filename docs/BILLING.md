# Paddle Billing System Documentation

## Overview

Unik AI Agent uses Paddle for billing and subscription management. This document covers the complete billing flow, environment setup, and operational procedures.

## Environment Variables

### Required for Production

\`\`\`bash
# Paddle Configuration
PADDLE_VENDOR_ID=your_vendor_id
PADDLE_CLIENT_ID=your_client_id
PADDLE_CLIENT_SECRET=your_client_secret
PADDLE_WEBHOOK_SECRET=your_webhook_secret
PADDLE_ENV=live  # or 'sandbox' for testing

# Product/Price IDs (get from Paddle dashboard)
PADDLE_PRODUCT_STARTER=pro_01j...
PADDLE_PRICE_STARTER=pri_01j...
PADDLE_PRODUCT_PRO=pro_01j...
PADDLE_PRICE_PRO=pri_01j...
PADDLE_PRODUCT_BUSINESS=pro_01j...
PADDLE_PRICE_BUSINESS=pri_01j...

# Feature Flags
PADDLE_ENABLED=true
EMAIL_ENABLED=true
\`\`\`

### Test vs Live Mode

- **Sandbox**: Use for development and testing. No real charges.
- **Live**: Production environment with real payments.

Switch between modes using `PADDLE_ENV=sandbox` or `PADDLE_ENV=live`.

## Billing Flows

### 1. Checkout Flow

\`\`\`
User selects plan → /api/billing/checkout → Paddle Checkout → 
Webhook: subscription.created → User activated
\`\`\`

**Implementation**: `src/app/api/billing/checkout/route.ts`

### 2. Subscription Management

\`\`\`
User clicks "Manage" → /api/billing/portal → Paddle Portal → 
User updates payment/plan → Webhook: subscription.updated
\`\`\`

**Implementation**: `src/app/api/billing/portal/route.ts`

### 3. Upgrade/Downgrade

\`\`\`
User changes plan → Paddle calculates proration → 
Transaction created → Webhook: transaction.completed → 
Plan updated
\`\`\`

**Proration**: Paddle handles automatically. Credits or charges based on remaining time.

### 4. Cancellation

\`\`\`
User cancels → Paddle marks subscription for cancellation → 
Webhook: subscription.canceled → User downgraded to free
\`\`\`

**Grace Period**: Users retain access until period end.

### 5. Failed Payment

\`\`\`
Payment fails → Webhook: transaction.payment_failed → 
Dunning emails sent → Retries per schedule → 
If all fail: Account suspended
\`\`\`

**Dunning Schedule**:
- Day 1: First reminder
- Day 3: Second reminder
- Day 7: Third reminder
- Day 14: Final notice + suspension

### 6. Refunds

\`\`\`
Admin issues refund in Paddle → Webhook: refund.created → 
Payment record updated → User notified
\`\`\`

## Webhooks

### Supported Events

- `subscription.created`
- `subscription.updated`
- `subscription.paused`
- `subscription.resumed`
- `subscription.canceled`
- `subscription.payment_method.updated`
- `transaction.completed`
- `transaction.payment_failed`
- `transaction.chargeback`
- `refund.created`
- `invoice.issued`
- `invoice.paid`

### Security

- **Signature Verification**: All webhooks verified using Paddle's HMAC signature
- **Idempotency**: Duplicate webhooks detected via payload hash
- **Retry Logic**: Failed webhooks logged for manual retry

### Webhook URL

\`\`\`
https://your-domain.com/api/webhooks/paddle
\`\`\`

Configure this in Paddle Dashboard → Developer → Notifications.

## Database Schema

### Tables

- `users_profile`: User account and plan info
- `paddle_customers`: Paddle customer and subscription mapping
- `paddle_products`: Product catalog
- `paddle_prices`: Price points with plan metadata
- `paddle_invoices`: Invoice records
- `paddle_payments`: Payment transactions
- `webhooks_log`: Webhook event log for debugging

## Quota & Usage Limits

### Plan Limits

\`\`\`typescript
const PLAN_LIMITS = {
  free: { maxPrompts: 50, costCap: 0 },
  starter: { maxPrompts: 500, costCap: 9.99 },
  pro: { maxPrompts: 1500, costCap: 14.99 },
  business: { maxPrompts: -1, costCap: 19.99 }, // unlimited
};
\`\`\`

### Enforcement

- **Soft Limit**: Warning at 80% usage
- **Hard Limit**: Block requests at 100%
- **Cost Cap**: Additional safety net at 50% OpenAI cost

Implemented in `src/lib/billing/quota-guards.ts`.

## Daily Operations

### Reconciliation Job

Runs daily to sync Paddle subscriptions with local database.

\`\`\`bash
# Manually trigger
curl https://your-domain.com/api/cron/reconcile-paddle
\`\`\`

**Cron Schedule**: `0 2 * * *` (2 AM daily)

### Dunning Process

Automated email reminders for failed payments.

\`\`\`bash
# Manually trigger
curl https://your-domain.com/api/cron/dunning
\`\`\`

**Cron Schedule**: `0 10 * * *` (10 AM daily)

## Admin Dashboard

### Subscriptions View

Path: `/admin/subscriptions`

Features:
- View all active subscriptions
- Filter by plan, status
- See usage metrics
- Manual actions (pause, cancel)

### Payments View

Path: `/admin/payments`

Features:
- Transaction history
- Failed payment tracking
- Refund requests

### Webhook Logs

Path: `/admin/webhooks`

Features:
- View all webhook events
- Retry failed webhooks
- Debug payload inspection

## Testing

### Unit Tests

\`\`\`bash
npm run test src/lib/billing/
\`\`\`

Tests cover:
- Plan upgrades/downgrades
- Proration calculations
- Quota enforcement
- Webhook idempotency

### End-to-End Test

1. **Checkout**: Create subscription in sandbox
2. **Active**: Verify user activated
3. **Portal**: Open customer portal, change payment method
4. **Upgrade**: Change plan, verify proration
5. **Cancel**: Cancel subscription, verify grace period
6. **Refund**: Issue refund, verify webhook

## Troubleshooting

### Webhook Not Received

1. Check Paddle Dashboard → Developer → Event Logs
2. Verify webhook URL is correct and accessible
3. Check `webhooks_log` table for errors
4. Manually retry from Paddle Dashboard

### Subscription Status Mismatch

Run reconciliation job to sync:

\`\`\`bash
curl https://your-domain.com/api/cron/reconcile-paddle
\`\`\`

### Failed Payment Not Retrying

1. Verify dunning cron is running
2. Check email service configuration
3. Review `paddle_payments` table for status

## Support Contacts

- **Paddle Support**: https://paddle.com/support
- **Email**: support@unik-ks.com
- **Docs**: https://developer.paddle.com
