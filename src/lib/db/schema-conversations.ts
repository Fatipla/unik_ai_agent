import { pgTable, uuid, varchar, text, integer, timestamp, decimal, date } from 'drizzle-orm/pg-core';
import { users } from './schema-nextauth';

/**
 * Conversations & Voice Calls Schema
 */

// Conversations table (Chatbot)
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 255 }),
  message: text('message').notNull(),
  response: text('response').notNull(),
  type: varchar('type', { length: 50 }).default('chatbot'),
  tokensUsed: integer('tokens_used').default(0),
  tokensIn: integer('tokens_in').default(0),
  tokensOut: integer('tokens_out').default(0),
  costEur: decimal('cost_eur', { precision: 10, scale: 4 }).default('0'),
  lang: varchar('lang', { length: 5 }).default('en'),
  tone: varchar('tone', { length: 50 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

// Voice Calls table
export const voiceCalls = pgTable('voice_calls', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  callSid: varchar('call_sid', { length: 255 }),
  duration: integer('duration').default(0),
  status: varchar('status', { length: 50 }).default('completed'),
  transcript: text('transcript'),
  recordingUrl: text('recording_url'),
  costEur: decimal('cost_eur', { precision: 10, scale: 4 }).default('0'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  endedAt: timestamp('ended_at', { mode: 'date' }),
});

// Admin users table
export const adminUsers = pgTable('admin_users', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).default('admin'),
  permissions: text('permissions'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

// Daily analytics table
export const dailyAnalytics = pgTable('daily_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull().unique(),
  totalUsers: integer('total_users').default(0),
  activeUsers: integer('active_users').default(0),
  totalConversations: integer('total_conversations').default(0),
  totalVoiceCalls: integer('total_voice_calls').default(0),
  totalRevenueEur: decimal('total_revenue_eur', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

export type Conversation = typeof conversations.$inferSelect;
export type VoiceCall = typeof voiceCalls.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type DailyAnalytics = typeof dailyAnalytics.$inferSelect;
