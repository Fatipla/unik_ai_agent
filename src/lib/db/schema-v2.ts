/**
 * MASTER SCHEMA V2 - Multi-Tenant SaaS Architecture
 * 
 * This schema represents the complete database structure for a
 * production-ready multi-tenant SaaS platform with:
 * - Multi-tenancy core
 * - Messaging & Communication
 * - AI & Knowledge Base
 * - Workflows Engine
 * - Billing & Usage
 * - Voice AI Module
 * - Webhooks
 * - Audit Logs
 */

import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, decimal, boolean, inet, index, uniqueIndex, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// 1. MULTI-TENANCY CORE
// ============================================================================

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  plan: varchar('plan', { length: 50 }).default('standard'),
  status: varchar('status', { length: 50 }).default('active'), // active, suspended, deleted
  settings: jsonb('settings').$type<OrganizationSettings>().default({}),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  slugIdx: index('idx_organizations_slug').on(table.slug),
  statusIdx: index('idx_organizations_status').on(table.status),
}));

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  role: varchar('role', { length: 50 }).default('member'), // owner, admin, member
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
  organizationIdx: index('idx_users_organization_id').on(table.organizationId),
  roleIdx: index('idx_users_role').on(table.role),
}));

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  keyHash: varchar('key_hash', { length: 255 }).notNull().unique(),
  keyPrefix: varchar('key_prefix', { length: 20 }).notNull(),
  permissions: jsonb('permissions').$type<string[]>().default([]),
  lastUsedAt: timestamp('last_used_at', { mode: 'date' }),
  expiresAt: timestamp('expires_at', { mode: 'date' }),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  organizationIdx: index('idx_api_keys_organization_id').on(table.organizationId),
  keyHashIdx: index('idx_api_keys_key_hash').on(table.keyHash),
}));

// ============================================================================
// 2. MESSAGING & COMMUNICATION
// ============================================================================

export const channels = pgTable('channels', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // widget, whatsapp, voice, api
  settings: jsonb('settings').$type<ChannelSettings>().default({}),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  organizationIdx: index('idx_channels_organization_id').on(table.organizationId),
  typeIdx: index('idx_channels_type').on(table.type),
}));

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  name: varchar('name', { length: 255 }),
  metadata: jsonb('metadata').$type<ContactMetadata>().default({}),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  organizationIdx: index('idx_contacts_organization_id').on(table.organizationId),
  emailIdx: index('idx_contacts_email').on(table.email),
  phoneIdx: index('idx_contacts_phone').on(table.phone),
}));

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'set null' }),
  channelId: uuid('channel_id').references(() => channels.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).default('active'), // active, closed, archived
  metadata: jsonb('metadata').$type<ConversationMetadata>().default({}),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  organizationIdx: index('idx_conversations_organization_id').on(table.organizationId),
  contactIdx: index('idx_conversations_contact_id').on(table.contactId),
  channelIdx: index('idx_conversations_channel_id').on(table.channelId),
  statusIdx: index('idx_conversations_status').on(table.status),
}));

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  direction: varchar('direction', { length: 20 }).notNull(), // inbound, outbound
  role: varchar('role', { length: 50 }), // user, assistant, system
  content: text('content').notNull(),
  metadata: jsonb('metadata').$type<MessageMetadata>().default({}),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  conversationIdx: index('idx_messages_conversation_id').on(table.conversationId),
  createdAtIdx: index('idx_messages_created_at').on(table.createdAt),
}));

// ============================================================================
// 3. AI & KNOWLEDGE BASE
// ============================================================================

export const aiAgents = pgTable('ai_agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  instructions: text('instructions'),
  model: varchar('model', { length: 100 }).default('gpt-4'),
  settings: jsonb('settings').$type<AIAgentSettings>().default({}),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  organizationIdx: index('idx_ai_agents_organization_id').on(table.organizationId),
  isActiveIdx: index('idx_ai_agents_is_active').on(table.isActive),
}));

export const knowledgeSources = pgTable('knowledge_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // url, file, text
  location: text('location'),
  status: varchar('status', { length: 50 }).default('pending'), // pending, processing, ready, failed
  metadata: jsonb('metadata').$type<KnowledgeSourceMetadata>().default({}),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  organizationIdx: index('idx_knowledge_sources_organization_id').on(table.organizationId),
  statusIdx: index('idx_knowledge_sources_status').on(table.status),
}));

export const documentChunks = pgTable('document_chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  knowledgeSourceId: uuid('knowledge_source_id').notNull().references(() => knowledgeSources.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  embeddingVector: varchar('embedding_vector'), // This would be vector(1536) in real implementation
  metadata: jsonb('metadata').$type<DocumentChunkMetadata>().default({}),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  knowledgeSourceIdx: index('idx_document_chunks_knowledge_source_id').on(table.knowledgeSourceId),
}));

// ============================================================================
// 4. WORKFLOWS ENGINE
// ============================================================================

export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  definition: jsonb('definition').$type<WorkflowDefinition>().notNull(),
  triggers: jsonb('triggers').$type<WorkflowTrigger[]>().default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  organizationIdx: index('idx_workflows_organization_id').on(table.organizationId),
  isActiveIdx: index('idx_workflows_is_active').on(table.isActive),
}));

export const workflowRuns = pgTable('workflow_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  workflowId: uuid('workflow_id').notNull().references(() => workflows.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).default('running'), // running, completed, failed
  inputData: jsonb('input_data').$type<Record<string, any>>(),
  outputData: jsonb('output_data').$type<Record<string, any>>(),
  errorMessage: text('error_message'),
  startedAt: timestamp('started_at', { mode: 'date' }).defaultNow(),
  completedAt: timestamp('completed_at', { mode: 'date' }),
}, (table) => ({
  workflowIdx: index('idx_workflow_runs_workflow_id').on(table.workflowId),
  statusIdx: index('idx_workflow_runs_status').on(table.status),
  startedAtIdx: index('idx_workflow_runs_started_at').on(table.startedAt),
}));

// ============================================================================
// 5. BILLING & USAGE
// ============================================================================

export const plans = pgTable('plans', {
  id: varchar('id', { length: 255 }).primaryKey(), // chatbot_standard_monthly
  productType: varchar('product_type', { length: 50 }).notNull(), // chatbot, voice, bundle
  tier: varchar('tier', { length: 50 }).notNull(), // standard, pro, enterprise
  billingPeriod: varchar('billing_period', { length: 50 }).notNull(), // monthly, yearly
  currency: varchar('currency', { length: 10 }).default('EUR'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true),
  limits: jsonb('limits').$type<PlanLimits>().notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  productTypeIdx: index('idx_plans_product_type').on(table.productType),
  tierIdx: index('idx_plans_tier').on(table.tier),
  isActiveIdx: index('idx_plans_is_active').on(table.isActive),
}));

export const subscriptions = pgTable('subscriptions', {
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
}, (table) => ({
  organizationIdx: index('idx_subscriptions_organization_id').on(table.organizationId),
  planIdx: index('idx_subscriptions_plan_id').on(table.planId),
  statusIdx: index('idx_subscriptions_status').on(table.status),
}));

export const usage = pgTable('usage', {
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
}, (table) => ({
  organizationIdx: index('idx_usage_organization_id').on(table.organizationId),
  periodIdx: index('idx_usage_period').on(table.periodStart, table.periodEnd),
}));

// ============================================================================
// 6. VOICE AI MODULE
// ============================================================================

export const callSessions = pgTable('call_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'set null' }),
  externalCallId: varchar('external_call_id', { length: 255 }),
  direction: varchar('direction', { length: 20 }).notNull(), // inbound, outbound
  status: varchar('status', { length: 50 }).default('initiated'), // initiated, ringing, in-progress, completed, failed
  durationSeconds: integer('duration_seconds'),
  recordingUrl: text('recording_url'),
  metadata: jsonb('metadata').$type<CallSessionMetadata>().default({}),
  startedAt: timestamp('started_at', { mode: 'date' }).defaultNow(),
  endedAt: timestamp('ended_at', { mode: 'date' }),
}, (table) => ({
  organizationIdx: index('idx_call_sessions_organization_id').on(table.organizationId),
  contactIdx: index('idx_call_sessions_contact_id').on(table.contactId),
  statusIdx: index('idx_call_sessions_status').on(table.status),
}));

export const callTurns = pgTable('call_turns', {
  id: uuid('id').primaryKey().defaultRandom(),
  callSessionId: uuid('call_session_id').notNull().references(() => callSessions.id, { onDelete: 'cascade' }),
  speaker: varchar('speaker', { length: 20 }).notNull(), // user, agent
  text: text('text').notNull(),
  audioUrl: text('audio_url'),
  durationSeconds: integer('duration_seconds'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  callSessionIdx: index('idx_call_turns_call_session_id').on(table.callSessionId),
}));

export const callTranscripts = pgTable('call_transcripts', {
  id: uuid('id').primaryKey().defaultRandom(),
  callSessionId: uuid('call_session_id').notNull().references(() => callSessions.id, { onDelete: 'cascade' }),
  fullText: text('full_text').notNull(),
  language: varchar('language', { length: 10 }),
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  callSessionIdx: index('idx_call_transcripts_call_session_id').on(table.callSessionId),
}));

// ============================================================================
// 7. WEBHOOKS
// ============================================================================

export const webhookSubscriptions = pgTable('webhook_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  events: jsonb('events').$type<string[]>().default([]),
  secret: varchar('secret', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  organizationIdx: index('idx_webhook_subscriptions_organization_id').on(table.organizationId),
  isActiveIdx: index('idx_webhook_subscriptions_is_active').on(table.isActive),
}));

// ============================================================================
// 8. AUDIT LOGS
// ============================================================================

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  resourceType: varchar('resource_type', { length: 100 }).notNull(),
  resourceId: uuid('resource_id'),
  changes: jsonb('changes').$type<Record<string, any>>(),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  organizationIdx: index('idx_audit_logs_organization_id').on(table.organizationId),
  userIdx: index('idx_audit_logs_user_id').on(table.userId),
  actionIdx: index('idx_audit_logs_action').on(table.action),
  createdAtIdx: index('idx_audit_logs_created_at').on(table.createdAt),
}));

// ============================================================================
// 9. NEXTAUTH COMPATIBILITY TABLES
// ============================================================================

export const accounts = pgTable('accounts', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  idToken: text('id_token'),
  sessionState: varchar('session_state', { length: 255 }),
}, (table) => ({
  pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
  userIdx: index('idx_accounts_user_id').on(table.userId),
}));

export const sessions = pgTable('sessions', {
  sessionToken: varchar('session_token', { length: 255 }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => ({
  userIdx: index('idx_sessions_user_id').on(table.userId),
}));

export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.identifier, table.token] }),
}));

// ============================================================================
// 10. PADDLE BILLING COMPATIBILITY
// ============================================================================

export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type').notNull(),
  dedupeKey: text('dedupe_key').notNull().unique(),
  payload: jsonb('payload').notNull(),
  processed: boolean('processed').default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
}, (table) => ({
  dedupeIdx: index('idx_webhook_events_dedupe').on(table.dedupeKey),
  typeIdx: index('idx_webhook_events_type').on(table.type),
  processedIdx: index('idx_webhook_events_processed').on(table.processed),
}));

// ============================================================================
// TYPESCRIPT TYPES FOR JSONB FIELDS
// ============================================================================

export interface OrganizationSettings {
  timezone?: string;
  language?: string;
  [key: string]: any;
}

export interface ChannelSettings {
  webhookUrl?: string;
  apiKey?: string;
  [key: string]: any;
}

export interface ContactMetadata {
  tags?: string[];
  customFields?: Record<string, any>;
  [key: string]: any;
}

export interface ConversationMetadata {
  tags?: string[];
  assignedTo?: string;
  [key: string]: any;
}

export interface MessageMetadata {
  tokensIn?: number;
  tokensOut?: number;
  cost?: number;
  [key: string]: any;
}

export interface AIAgentSettings {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  [key: string]: any;
}

export interface KnowledgeSourceMetadata {
  fileSize?: number;
  mimeType?: string;
  chunkCount?: number;
  [key: string]: any;
}

export interface DocumentChunkMetadata {
  pageNumber?: number;
  section?: string;
  [key: string]: any;
}

export interface WorkflowDefinition {
  steps: WorkflowStep[];
  [key: string]: any;
}

export interface WorkflowStep {
  id: string;
  type: string;
  config: Record<string, any>;
  [key: string]: any;
}

export interface WorkflowTrigger {
  type: string; // webhook, schedule, event
  config: Record<string, any>;
}

export interface PlanLimits {
  max_conversations_per_month: number | null;
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

export interface CallSessionMetadata {
  provider?: string;
  fromNumber?: string;
  toNumber?: string;
  [key: string]: any;
}

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type Channel = typeof channels.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type AIAgent = typeof aiAgents.$inferSelect;
export type KnowledgeSource = typeof knowledgeSources.$inferSelect;
export type DocumentChunk = typeof documentChunks.$inferSelect;
export type Workflow = typeof workflows.$inferSelect;
export type WorkflowRun = typeof workflowRuns.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Usage = typeof usage.$inferSelect;
export type CallSession = typeof callSessions.$inferSelect;
export type CallTurn = typeof callTurns.$inferSelect;
export type CallTranscript = typeof callTranscripts.$inferSelect;
export type WebhookSubscription = typeof webhookSubscriptions.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type WebhookEvent = typeof webhookEvents.$inferSelect;
