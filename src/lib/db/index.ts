import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import * as schemaV2 from './schema-v2';

// Legacy schemas (kept for backward compatibility during migration)
import * as schema from './schema';
import * as authSchema from './schema-nextauth';
import * as billingSchema from './schema-billing';
import * as conversationsSchema from './schema-conversations';
import * as plansSchema from './schema-plans';

// Combine schemas - V2 schema takes precedence over legacy schemas
const fullSchema = { 
  ...schema, 
  ...authSchema, 
  ...billingSchema, 
  ...conversationsSchema, 
  ...plansSchema,
  ...schemaV2  // V2 schema (new architecture) - overrides conflicting names
};

// Initialize Drizzle with Vercel Postgres
export const db = drizzle(vercelSql, { schema: fullSchema });

// Export V2 schema as the primary export (new architecture)
export * from './schema-v2';

// Export legacy schemas with specific exports to avoid conflicts
// Note: Some table names (organizations, plans, subscriptions, conversations) 
// are intentionally overridden by V2 schema
export { 
  // From schema.ts (non-conflicting)
  usersProfile,
  messages as messagesLegacy, // Renamed to avoid conflict
  emails,
  paddleCustomers,
  paddleProducts,
  paddlePrices,
  paddleInvoices,
  paddlePayments,
  trainingJobs,
  voiceCalls as voiceCallsLegacy, // Renamed to avoid conflict
  webhooksLog,
  webhookEvents as webhookEventsLegacy, // Renamed to avoid conflict
} from './schema';

export {
  // From schema-nextauth.ts (non-conflicting with V2)
  users as usersAuth, // Renamed to avoid conflict with V2 users
  accounts as accountsAuth, // Keep for NextAuth compatibility
  sessions as sessionsAuth, // Keep for NextAuth compatibility
  verificationTokens as verificationTokensAuth, // Keep for NextAuth compatibility
  usage as usageLegacy, // Renamed to avoid conflict
} from './schema-nextauth';

export {
  // From schema-billing.ts
  customers as billingCustomers,
  subscriptions as subscriptionsLegacy, // Renamed to avoid conflict
  invoices as billingInvoices,
  payments as billingPayments,
  entitlements as billingEntitlements,
} from './schema-billing';

export {
  conversations as conversationsLegacy,
  voiceCalls as voiceCallsLegacy,
} from './schema-conversations';

export {
  // From schema-plans.ts
  organizations as organizationsLegacy, // Renamed to avoid conflict
  organizationMembers as organizationMembersLegacy,
  plans as plansLegacy, // Renamed to avoid conflict
  subscriptionsV2 as subscriptionsV2Legacy, // Renamed to avoid conflict
  usageV2 as usageV2Legacy, // Renamed to avoid conflict
} from './schema-plans';
