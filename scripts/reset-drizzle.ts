
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { jerseys, jerseyImages, orders, orderItems } from '../db/schema';


const sqlite = new Database('dev.db');
const db = drizzle(sqlite);

async function main() {
  console.log('🧹 Starting cleanup (Drizzle)...');

  try {
    // Delete in order of dependencies
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(jerseyImages);
    await db.delete(jerseys);
    
    // Reset Auto Increment (optional but good for clean ID feel if using distinct IDs, though we use UUIDs mostly)
    // Actually schema uses UUIDs so no auto-increment reset needed usually.
    
    console.log('✅ Store reset successfully!');
  } catch (error) {
    console.error('❌ Error cleaning up:', error);
  }
}

main();
