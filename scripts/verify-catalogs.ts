
import { getShoes } from '../services/shoes';
import { getWindbreakers } from '../services/windbreakers';
import { getAccessories } from '../services/accessories';
import { getJerseys } from '../services/jerseys';

async function verifyCatalogs() {
  console.log('🧪 Verifying All Catalogs...');

  try {
    // 1. SHOES
    console.log('\n👉 Checking Shoes...');
    const shoes = await getShoes();
    console.log(`   Found ${shoes.length} shoes.`);
    if (shoes.length > 0) {
        console.log(`   Sample: ${shoes[0].team} (${shoes[0].category})`);
        if (shoes[0].category !== 'Sepatu') console.error('   ❌ Category Mismatch!');
    } else {
        console.error('   ❌ No shoes found! Migration might be empty.');
    }

    // 2. WINDBREAKERS
    console.log('\n👉 Checking Windbreakers...');
    const jackets = await getWindbreakers();
    console.log(`   Found ${jackets.length} windbreakers.`);
    if (jackets.length > 0) {
        console.log(`   Sample: ${jackets[0].team} (${jackets[0].category})`);
    }

    // 3. ACCESSORIES
    console.log('\n👉 Checking Accessories...');
    const acc = await getAccessories();
    console.log(`   Found ${acc.length} accessories.`);
    if (acc.length > 0) {
        console.log(`   Sample: ${acc[0].team} (${acc[0].category})`);
    }

    // 4. JERSEYS (Make sure they are still there but NOT the other types)
    console.log('\n👉 Checking Jerseys (Should be pure)...');
    const jerseys = await getJerseys();
    console.log(`   Found ${jerseys.length} jerseys.`);
    const nonJersey = jerseys.find(j => j.category !== 'Jersey' && j.category !== 'Promo' && j.category !== 'Retro' && j.category !== 'New Release');
    if (nonJersey) {
        console.warn(`   ⚠️ Found unexpected category in Jerseys: ${nonJersey.category} - ${nonJersey.team}`);
    } else {
        console.log('   ✅ Jerseys table is pure.');
    }

  } catch (error) {
    console.error('❌ Error verifying catalogs:', error);
  }
}

verifyCatalogs();
