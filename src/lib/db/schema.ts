import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, decimal, boolean, pgEnum, uniqueIndex, index } from 'drizzle-orm/pg-core';

// Enums
export const planEnum = pgEnum('plan', ['free', 'standard', 'pro', 'enterprise']);
export const billingIntervalEnum = pgEnum('billing_interval', ['monthly', 'yearly']);
export const sourceEnum = pgEnum('source', ['widget', 'voice', 'whatsapp', 'api']);
export const roleEnum = pgEnum('role', ['user', 'assistant', 'tool']);
export const trainingStatusEnum = pgEnum('training_status', ['queued', 'running', 'done', 'failed']);
export const trainingTypeEnum = pgEnum('training_type', ['crawl', 'upload']);

// Users Profile
export const usersProfile = pgTable('users_profile', {
  userId: uuid('user_id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  plan: planEnum('plan').default('free').notNull(),
  billingInterval: billingIntervalEnum('billing_interval').default('monthly'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  activePriceId: varchar('active_price_id', { length: 255 }),
  activation: jsonb('activation').$type<string[]>().default([]),
  whatsappNumber: varchar('whatsapp_number', { length: 50 }),
  lang: varchar('lang', { length: 5 }).default('en'),
  tone: varchar('tone', { length: 50 }).default('professional'),
  usageMonth: varchar('usage_month', { length: 7 }),
  usagePrompts: integer('usage_prompts').default(0),
  usageCompletions: integer('usage_completions').default(0),
  usageTokensIn: integer('usage_tokens_in').default(0),
  usageTokensOut: integer('usage_tokens_out').default(0),
  usageCostEur: decimal('usage_cost_eur', { precision: 10, scale: 4 }).default('0'),
  usageCeilHit: boolean('usage_ceil_hit').default(false),
  aiVoiceEnabled: boolean('ai_voice_enabled').default(false),
  dataSources: jsonb('data_sources').$type<{ urls: string[], fileRefs: string[] }>().default({ urls: [], fileRefs: [] }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: uniqueIndex('email_idx').on(table.email),
}));

// Conversations
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => usersProfile.userId, { onDelete: 'cascade' }),
  source: sourceEnum('source').default('widget').notNull(),
  lang: varchar('lang', { length: 5 }).default('en'),
  tone: varchar('tone', { length: 50 }),
  planSnapshot: varchar('plan_snapshot', { length: 50 }),
  tokensIn: integer('tokens_in').default(0),
  tokensOut: integer('tokens_out').default(0),
  costEur: decimal('cost_eur', { precision: 10, scale: 4 }).default('0'),
  leadEmail: varchar('lead_email', { length: 255 }),
  leadPhone: varchar('lead_phone', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userCreatedIdx: index('conv_user_created_idx').on(table.userId, table.createdAt),
  userSourceIdx: index('conv_user_source_idx').on(table.userId, table.source),
}));

// Messages
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  text: text('text').notNull(),
  tokensIn: integer('tokens_in').default(0),
  tokensOut: integer('tokens_out').default(0),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  convIdx: index('msg_conv_idx').on(table.conversationId),
}));

// Emails
export const emails = pgTable('emails', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => usersProfile.userId, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  verified: boolean('verified').default(false),
  source: varchar('source', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userEmailIdx: index('email_user_idx').on(table.userId, table.email),
}));

// Stripe Customers
export const stripeCustomers = pgTable('stripe_customers', {
  userId: uuid('user_id').primaryKey().references(() => usersProfile.userId, { onDelete: 'cascade' }),
  customerId: varchar('customer_id', { length: 255 }).notNull(),
  subscriptionId: varchar('subscription_id', { length: 255 }),
  priceId: varchar('price_id', { length: 255 }),
  status: varchar('status', { length: 50 }),
  currentPeriodEnd: timestamp('current_period_end'),
});

// Webhooks Log
export const webhooksLog = pgTable('webhooks_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  provider: varchar('provider', { length: 50 }).notNull(),
  payloadHash: varchar('payload_hash', { length: 64 }).notNull().unique(),
  status: varchar('status', { length: 50 }),
  retries: integer('retries').default(0),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  hashIdx: uniqueIndex('webhook_hash_idx').on(table.payloadHash),
}));

// Training Jobs
export const trainingJobs = pgTable('training_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => usersProfile.userId, { onDelete: 'cascade' }),
  type: trainingTypeEnum('type').notNull(),
  status: trainingStatusEnum('status').default('queued').notNull(),
  sources: jsonb('sources').$type<string[]>().default([]),
  stats: jsonb('stats').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userStatusIdx: index('training_user_status_idx').on(table.userId, table.status),
}));

// Voice Calls
export const voiceCalls = pgTable('voice_calls', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => usersProfile.userId, { onDelete: 'cascade' }),
  transcriptPath: text('transcript_path'),
  intent: varchar('intent', { length: 100 }),
  scheduleRequested: boolean('schedule_requested').default(false),
  calendarSlot: jsonb('calendar_slot').$type<Record<string, any>>(),
  recordingUrl: text('recording_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type UsersProfile = typeof usersProfile.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
