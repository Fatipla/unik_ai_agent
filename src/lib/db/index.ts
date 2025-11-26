import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import * as schemaV2 from './schema-v2';

// Legacy schemas (kept for backward compatibility during migration)
import * as schema from './schema';
import * as authSchema from './schema-nextauth';
import * as billingSchema from './schema-billing';
import * as conversationsSchema from './schema-conversations';
import * as plansSchema from './schema-plans';

// Combine schemas - V2 schema takes precedence
const fullSchema = { 
  ...schema, 
  ...authSchema, 
  ...billingSchema, 
  ...conversationsSchema, 
  ...plansSchema,
  ...schemaV2  // V2 schema (new architecture)
};

// Initialize Drizzle with Vercel Postgres
export const db = drizzle(vercelSql, { schema: fullSchema });

// Export V2 schema (new architecture)
export * from './schema-v2';

// Export legacy schemas (kept for backward compatibility)
export * from './schema';
export * from './schema-nextauth';
export * from './schema-billing';
export * from './schema-conversations';
export * from './schema-plans';
