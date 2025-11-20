import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './schema-nextauth';

/**
 * Billing schema for Paddle integration
 * Matches the SQL migrations in supabase/migrations/001_create_billing_schema.sql
 */

// Customers table
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  paddleCustomerId: text('paddle_customer_id').unique(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  planKey: text('plan_key').notNull(), // CHATBOT_PRO, VOICE_STANDARD, BUNDLE_ENTERPRISE
  period: text('period').notNull(), // 'M' | 'Y'
  paddleSubscriptionId: text('paddle_subscription_id').unique(),
  status: text('status').notNull(), // trialing|active|past_due|canceled
  currentPeriodStart: timestamp('current_period_start', { mode: 'date' }),
  currentPeriodEnd: timestamp('current_period_end', { mode: 'date' }),
  cancelAt: timestamp('cancel_at', { mode: 'date' }),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  overLimit: boolean('over_limit').default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

// Invoices table
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  paddleInvoiceId: text('paddle_invoice_id').unique(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'set null' }),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id, { onDelete: 'set null' }),
  number: text('number'),
  hostedUrl: text('hosted_url'),
  status: text('status'), // issued|paid|void
  amountTotal: text('amount_total'), // Using text to match SQL numeric type
  currency: text('currency'),
  issuedAt: timestamp('issued_at', { mode: 'date' }),
  paidAt: timestamp('paid_at', { mode: 'date' }),
  rawJson: text('raw_json'), // Using text to store JSON
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

// Payments table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  paddlePaymentId: text('paddle_payment_id').unique(),
  invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'set null' }),
  status: text('status'), // succeeded|failed
  amount: text('amount'), // Using text to match SQL numeric type
  currency: text('currency'),
  rawJson: text('raw_json'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

// Entitlements table
export const entitlements = pgTable('entitlements', {
  planKey: text('plan_key').primaryKey(),
  family: text('family').notNull(), // CHATBOT|VOICE|BUNDLE
  tier: text('tier').notNull(), // STANDARD|PRO|ENTERPRISE
  features: text('features').notNull(), // JSON stored as text
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

export type Customer = typeof customers.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Entitlement = typeof entitlements.$inferSelect;
