
import { db } from '../lib/db';
import { jerseys } from '../db/schema';
import { count } from 'drizzle-orm';

async function main() {
  console.log('📊 Checking Database Content...');
  
  try {
    const result = await db.select({ value: count() }).from(jerseys);
    const rowCount = result[0].value;
    
    console.log(`✅ Total Products in DB: ${rowCount}`);
    
    if (rowCount > 0) {
        console.log('conclusion: Database IS full. Frontend is failing to fetch.');
    } else {
        console.log('conclusion: Database IS EMPTY. Seed did not persist?');
    }
    
  } catch (err) {
    console.error('❌ Database Access Failed:', err);
  }
  process.exit(0);
}

main();
