import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import * as schema from './schema';
import * as authSchema from './schema-nextauth';
import * as billingSchema from './schema-billing';

// Combine schemas
const fullSchema = { ...schema, ...authSchema, ...billingSchema };

// Initialize Drizzle with Vercel Postgres
export const db = drizzle(vercelSql, { schema: fullSchema });

export * from './schema';
export * from './schema-nextauth';
export * from './schema-billing';
