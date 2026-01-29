
import { getJerseys } from '../services/jerseys';

async function verifyJerseyCatalog() {
  console.log('🧪 Testing Jersey Catalog Flow...');
  console.log('👉 Action: calling getJerseys(undefined, "Jersey")...');

  try {
    const jerseys = await getJerseys(undefined, 'Jersey');

    console.log(`✅ Result: Fetched ${jerseys.length} items.`);

    if (jerseys.length > 0) {
      const sample = jerseys[0];
      console.log('\n🔎 Sample Item Analysis:');
      console.log(`   - ID: ${sample.id}`);
      console.log(`   - Team: ${sample.team}`);
      console.log(`   - Category: ${sample.category} (Expected: 'Jersey')`);
      console.log(`   - Main Image: ${sample.image ? '✅ Present' : '❌ Missing'}`);
      console.log(`   - Images Array: ${sample.images && sample.images.length > 0 ? '✅ Present (Unexpected)' : '⚪ Empty (Expected as per doc)'}`);
      
      const allMatch = jerseys.every(j => j.category === 'Jersey');
      if (allMatch) {
        console.log('\n✅ Verification Passed: All items are category "Jersey".');
      } else {
        console.error('\n❌ Verification Failed: Some items are NOT "Jersey".');
      }
    } else {
      console.warn('\n⚠️ No items found. Cannot verify properties.');
    }

  } catch (error) {
    console.error('❌ Error executing flow:', error);
  }
}

verifyJerseyCatalog();
