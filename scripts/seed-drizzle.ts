
// Local sqlite scripts disabled for Vercel build compatibility
// import { drizzle } from 'drizzle-orm/better-sqlite3';
// import Database from 'better-sqlite3';
import * as schema from '../db/schema';
import { jerseys } from '../db/schema';

// const sqlite = new Database('dev.db');
// const db = drizzle(sqlite, { schema });

async function main() {
  console.log('Using seed-supabase.ts for production instead.');
  /*
  console.log('Starting full catalog seed (Drizzle)...');
  */
}

main()
  .then(() => {
    console.log('Seed completed.');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
