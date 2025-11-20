import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import * as schema from './schema';
import * as authSchema from './schema-nextauth';

// Combine schemas
const fullSchema = { ...schema, ...authSchema };

// Initialize Drizzle with Vercel Postgres
export const db = drizzle(vercelSql, { schema: fullSchema });

export * from './schema';
export * from './schema-nextauth';
