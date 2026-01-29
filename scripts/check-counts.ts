
import { db } from '@/lib/db'
import { jerseys, orders, orderItems, testimonials, banners, users } from '@/db/schema'
import { count } from 'drizzle-orm'

async function main() {
  console.log('🔍 Checking database counts...')
  
  // Check main product table
  const j = await db.select({ value: count() }).from(jerseys);
  console.log('Jerseys Table:', j[0].value);

  // Check other tables potentially defined in schema?
  // I will read schema first, but based on imports above:
  
  process.exit(0);
}
main();
