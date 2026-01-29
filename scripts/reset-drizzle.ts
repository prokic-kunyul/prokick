
// Local sqlite scripts disabled for Vercel build compatibility
// import { drizzle } from 'drizzle-orm/better-sqlite3';
// import Database from 'better-sqlite3';
import { jerseys, jerseyImages, orders, orderItems } from '../db/schema';

// const sqlite = new Database('dev.db');
// const db = drizzle(sqlite);

async function main() {
  console.log('🧹 Script disabled for Vercel compatibility.');
  /* 
  console.log('🧹 Starting cleanup (Drizzle)...');

  try {
    // Delete in order of dependencies
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(jerseyImages);
    await db.delete(jerseys);
    
    console.log('✅ Store reset successfully!');
  } catch (error) {
    console.error('❌ Error cleaning up:', error);
  }
  */
}

main();
