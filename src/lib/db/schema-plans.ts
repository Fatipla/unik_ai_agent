import { pgTable, uuid, varchar, decimal, boolean, timestamp, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './schema-nextauth';

/**
 * Organizations & Plans Schema
 * Multi-tenant SaaS with proper subscription management
 */

// Organizations (Multi-tenancy)
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

// Organization Members (many-to-many)
export const organizationMembers = pgTable('organization_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).default('member'), // owner, admin, member
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  uniq: primaryKey({ columns: [table.organizationId, table.userId] }),
}));

// Plans (Product catalog)
export const plans = pgTable('plans', {
  id: varchar('id', { length: 255 }).primaryKey(), // chatbot_standard_monthly
  productType: varchar('product_type', { length: 50 }).notNull(), // chatbot, voice, bundle
  tier: varchar('tier', { length: 50 }).notNull(), // standard, pro, enterprise
  billingPeriod: varchar('billing_period', { length: 50 }).notNull(), // monthly, yearly
  currency: varchar('currency', { length: 10 }).default('EUR'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true),
  limits: jsonb('limits').notNull().$type<PlanLimits>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

// Subscriptions (Organization plans)
export const subscriptionsV2 = pgTable('subscriptions_v2', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  planId: varchar('plan_id', { length: 255 }).notNull().references(() => plans.id),
  provider: varchar('provider', { length: 50 }).notNull(), // stripe, paddle
  externalSubscriptionId: varchar('external_subscription_id', { length: 255 }),
  status: varchar('status', { length: 50 }).default('active'), // trialing, active, past_due, cancelled
  currentPeriodStart: timestamp('current_period_start', { mode: 'date' }),
  currentPeriodEnd: timestamp('current_period_end', { mode: 'date' }),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

// Usage (Metrics tracking)
export const usageV2 = pgTable('usage_v2', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  periodStart: timestamp('period_start', { mode: 'date' }).notNull(),
  periodEnd: timestamp('period_end', { mode: 'date' }).notNull(),
  metrics: jsonb('metrics').$type<UsageMetrics>().default({
    conversations_count: 0,
    voice_calls_count: 0,
    ai_tokens: 0,
  }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

// TypeScript types for JSONB fields
export interface PlanLimits {
  max_conversations_per_month: number | null; // null = unlimited
  max_voice_calls_per_month: number | null;
  has_widget_api: boolean;
  has_kb_training: boolean;
  has_basic_analytics: boolean;
  has_advanced_analytics: boolean;
  has_n8n_integration: boolean;
  has_priority_support: boolean;
  has_dedicated_support: boolean;
  has_custom_integrations: boolean;
  has_audit_logs: boolean;
  has_call_recording: boolean;
  has_call_analytics: boolean;
  has_custom_voice_training: boolean;
  has_white_label: boolean;
  trial_days?: number;
  savings_percent?: number;
}

export interface UsageMetrics {
  conversations_count: number;
  voice_calls_count: number;
  ai_tokens: number;
}

// Inferred types
export type Organization = typeof organizations.$inferSelect;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type SubscriptionV2 = typeof subscriptionsV2.$inferSelect;
export type UsageV2 = typeof usageV2.$inferSelect;
