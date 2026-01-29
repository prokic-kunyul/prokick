
import { getProductById } from '../services/products';
import { db } from '../lib/db';
import { shoes } from '../db/schema';

async function verifyUnifiedProduct() {
  console.log('🧪 Verifying Unified Product Service...');

  try {
    // 1. Get a Shoe ID to test
    const [shoe] = await db.select().from(shoes).limit(1);
    
    if (!shoe) {
        console.error('❌ No shoes found to test.');
        return;
    }

    console.log(`👉 Testing ID: ${shoe.id} (Should be Sepatu: ${shoe.team})`);

    // 2. Fetch via Unified Service
    const product = await getProductById(shoe.id);

    if (product) {
        console.log(`✅ Found Product via Unified Service:`);
        console.log(`   - Name: ${product.team}`);
        console.log(`   - Category: ${product.category}`);
        
        if (product.category === 'Sepatu') {
            console.log('   ✅ Category Match!');
        } else {
            console.error('   ❌ Category Mismatch!');
        }
    } else {
        console.error('❌ Product Not Found via Unified Service!');
    }

  } catch (error) {
    console.error('❌ Error verifying unified product:', error);
  }
}

verifyUnifiedProduct();
