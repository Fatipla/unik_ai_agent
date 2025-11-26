import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import * as schemaV2 from './schema-v2';

// Legacy schemas (kept for backward compatibility during migration)
import * as schema from './schema';
import * as authSchema from './schema-nextauth';
import * as billingSchema from './schema-billing';
import * as conversationsSchema from './schema-conversations';
import * as plansSchema from './schema-plans';

// Combine schemas - Legacy schemas take precedence for backward compatibility
const fullSchema = { 
  ...schemaV2,  // V2 schema (new architecture)
  ...schema, 
  ...authSchema, 
  ...billingSchema, 
  ...conversationsSchema, 
  ...plansSchema,  // Legacy schemas override V2 for backward compatibility
};

// Initialize Drizzle with Vercel Postgres
export const db = drizzle(vercelSql, { schema: fullSchema });

// Export legacy schemas as primary (for backward compatibility)
export { 
  usersProfile,
  messages,
  emails,
  paddleCustomers,
  paddleProducts,
  paddlePrices,
  paddleInvoices,
  paddlePayments,
  trainingJobs,
  voiceCalls,
  webhooksLog,
  webhookEvents,
} from './schema';

export {
  conversations,
  voiceCalls as voiceCallsConversations,
  dailyAnalytics,
} from './schema-conversations';

export {
  customers,
  subscriptions as paddleSubscriptions,
  invoices,
  payments,
  entitlements,
  webhookEvents as paddleWebhookEvents,
} from './schema-billing';

export {
  users,
  accounts,
  sessions,
  verificationTokens,
  usage as usageAuth,
} from './schema-nextauth';

export {
  organizations,
  organizationMembers,
  plans,
  subscriptionsV2,
  usageV2,
} from './schema-plans';

// Export V2 schema with V2 prefix to avoid conflicts
export {
  organizations as organizationsV2,
  users as usersV2,
  apiKeys,
  channels,
  contacts,
  conversations as conversationsV2,
  messages as messagesV2,
  aiAgents,
  knowledgeSources,
  documentChunks,
  workflows,
  workflowRuns,
  plans as plansV2,
  subscriptions as subscriptionsV2Schema,
  usage as usageV2Schema,
  callSessions,
  callTurns,
  callTranscripts,
  webhookSubscriptions,
  auditLogs,
} from './schema-v2';
