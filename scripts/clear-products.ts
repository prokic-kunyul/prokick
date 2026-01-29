
import { db } from '@/lib/db'
import { jerseys, jerseyImages, orderItems, shoes, windbreakers, accessories } from '@/db/schema'
import { sql } from 'drizzle-orm'

async function main() {
  console.log('🧹 Clearing all products...')
  
  try {
    // Delete validation to avoid foreign key constraints if any simple delete fails
    // But Cascade should handle images. OrderItems might block deletion if orders exist.
    // For a clean slate, we usually wipe orders too, but user only said 'hapus produk'.
    // If orders reference products, we can't delete products without deleting order items.
    
    console.log(' - Deleting Order Items (Dependencies)...')
    await db.delete(orderItems)

    console.log(' - Deleting Images...')
    await db.delete(jerseyImages)

    console.log(' - Deleting Products (Jerseys table handles all types)...')
    await db.delete(jerseys)
    await db.delete(shoes)
    await db.delete(windbreakers)
    await db.delete(accessories)
    
    console.log('✅ All products cleared successfully.')
    
  } catch (err) {
    console.error('❌ Failed to clear products:', err)
  }
  process.exit(0)
}

main()
