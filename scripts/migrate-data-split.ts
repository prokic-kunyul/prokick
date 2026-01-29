
import { db } from '../lib/db';
import { jerseys, shoes, windbreakers, accessories, orderItems } from '../db/schema';
import { eq} from 'drizzle-orm';

async function migrateData() {
  console.log('🚚 Starting Data Migration (Split Table)...');

  try {
    // --- 1. MIGRATE SHOES ---
    const shoesToMove = await db.select().from(jerseys).where(eq(jerseys.category, 'Sepatu'));
    console.log(`Found ${shoesToMove.length} Shoes to migrate.`);
    
    for (const item of shoesToMove) {
      console.log(`   Moving: ${item.team} (${item.id})`);
      // Insert into Shoes (Preserve ID)
      await db.insert(shoes).values({
        ...item,
        category: 'Sepatu' // Ensure strict category
      });

      // Update Order Items
      await db.update(orderItems)
        .set({ shoeId: item.id, jerseyId: null })
        .where(eq(orderItems.jerseyId, item.id));

      // Delete from Jerseys
      await db.delete(jerseys).where(eq(jerseys.id, item.id));
    }

    // --- 2. MIGRATE WINDBREAKERS ---
    const jacketsToMove = await db.select().from(jerseys).where(eq(jerseys.category, 'Windbreaker'));
    console.log(`Found ${jacketsToMove.length} Windbreakers to migrate.`);

    for (const item of jacketsToMove) {
      console.log(`   Moving: ${item.team} (${item.id})`);
      await db.insert(windbreakers).values({
        ...item,
        category: 'Windbreaker'
      });

      await db.update(orderItems)
        .set({ windbreakerId: item.id, jerseyId: null })
        .where(eq(orderItems.jerseyId, item.id));

      await db.delete(jerseys).where(eq(jerseys.id, item.id));
    }

    // --- 3. MIGRATE ACCESSORIES ---
    const accToMove = await db.select().from(jerseys).where(eq(jerseys.category, 'Produk Lainnya'));
    console.log(`Found ${accToMove.length} Accessories to migrate.`);

    for (const item of accToMove) {
      console.log(`   Moving: ${item.team} (${item.id})`);
      await db.insert(accessories).values({
        ...item,
        category: 'Produk Lainnya'
      });

      await db.update(orderItems)
        .set({ accessoryId: item.id, jerseyId: null })
        .where(eq(orderItems.jerseyId, item.id));

      await db.delete(jerseys).where(eq(jerseys.id, item.id));
    }

    console.log('✅ Data Migration Completed Successfully!');

  } catch (error) {
    console.error('❌ Migration Failed:', error);
  }
  process.exit(0);
}

migrateData();
