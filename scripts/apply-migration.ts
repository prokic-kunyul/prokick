
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../lib/db';

async function main() {
  console.log('📦 Applying Migrations...');
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('✅ Migrations applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
  process.exit(0);
}

main();
