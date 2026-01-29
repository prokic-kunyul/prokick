
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';
import 'dotenv/config';

// Fix for Next.js caching in dev
const globalForDb = global as unknown as { db: ReturnType<typeof drizzle> };

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
export const db = globalForDb.db || drizzle(client, { schema });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
