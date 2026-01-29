
import { getJerseys } from '../services/jerseys';

async function main() {
  console.log('🐞 Debugging Service Fetch...');
  
  try {
    const products = await getJerseys();
    console.log(`✅ Fetched: ${products.length} products`);
    
    if (products.length > 0) {
        console.log('First Product:', JSON.stringify(products[0], null, 2));
    } else {
        console.log('⚠️ Service returned empty array.');
    }

  } catch (err) {
    console.error('🔥 Service Error:', err);
  }
  process.exit(0);
}

main();
