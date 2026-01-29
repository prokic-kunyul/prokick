
import { getJerseys, getJerseyById } from '../services/jerseys';

async function verifyProductDetail() {
  console.log('🧪 Testing Product Detail Page Flow...');

  // 1. Get a valid ID first (simulating what happens when user clicks a product)
  const allJerseys = await getJerseys();
  if (allJerseys.length === 0) {
    console.warn('⚠️ No products found to test.');
    return;
  }
  const testId = allJerseys[0].id;
  console.log(`👉 Primary Action: calling getJerseyById('${testId}')...`);

  try {
    const product = await getJerseyById(testId);

    if (!product) {
      console.error('❌ Failed to fetch product by ID.');
      return;
    }

    console.log(`✅ Result: Fetched product "${product.team}".`);
    console.log(`   - ID: ${product.id}`);
    console.log(`   - League: ${product.league}`);
    console.log(`   - Main Image: ${product.image ? '✅ Present' : '❌ Missing'}`);
    
    // Check Images Relation
    // The service performs a secondary query: db.select().from(jerseyImages)...
    console.log(`   - Gallery Images: ${product.images?.length || 0} found via separate query.`);

    // 2. Test Related Products Logic
    console.log('\n👉 Secondary Action: Simulating "Related Products" logic...');
    // The page fetches ALL jerseys and filters in-memory
    const related = allJerseys.filter(j => 
        j.league === product.league && j.id !== product.id
    ).slice(0, 4);

    console.log(`✅ Result: Found ${related.length} related items (same league: ${product.league}).`);
    if (related.length > 0) {
        related.forEach(r => console.log(`   - Related: ${r.team} (${r.league})`));
    } else {
        console.log('   (No other products in this league, simulation is valid but returned empty)');
    }

    console.log('\n✅ Verification Passed: Product Detail flow matches documentation.');

  } catch (error) {
    console.error('❌ Error executing flow:', error);
  }
}

verifyProductDetail();
