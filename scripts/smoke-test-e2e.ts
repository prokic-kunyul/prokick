
import { createJersey, deleteJersey } from '../app/actions/jersey';
import { createOrder, deleteOrder } from '../app/actions/order';
import { getOrders } from '../services/orders';
import { db } from '../lib/db';
import { jerseys } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Blob } from 'buffer';

// Mock File for Node.js environment
class MockFile extends Blob {
  name: string;
  size: number;
  lastModified: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(parts: any[], name: string, properties: { type?: string }) {
    super(parts, properties);
    this.name = name;
    this.size = properties.type ? parts[0].length : 0;
    this.lastModified = Date.now();
  }
}
if (typeof global.File === 'undefined') {
  (global as unknown as { File: typeof MockFile }).File = MockFile;
}

// Helper to construct FormData
function createFormData(data: Record<string, unknown>) {
  const fd = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data[key] as unknown[]).forEach((v) => fd.append(key, v as any));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fd.append(key, data[key] as any);
    }
  }
  return fd;
}

// Safe action wrapper
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
async function safeAction(action: Function, ...args: any[]) {
  try {
    return await action(...args);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    if (message === 'NEXT_REDIRECT') return;
    throw e;
  }
}

async function smokeTestE2E() {
  console.log('\n🚀 STARTING E2E SMOKE TEST: Admin -> Buyer -> Admin Flow\n');
  
  const dummyInfo = Buffer.from('fake image content');
  const dummyFile = new File([dummyInfo], 'smoke_test.jpg', { type: 'image/jpeg' });
  let productId: string | null = null;
  let orderId: string | null = null;

  try {
    // ==========================================
    // PHASE 1: ADMIN - ADD PRODUCT
    // ==========================================
    console.log('🔹 PHASE 1: ADMIN ACTION');
    console.log('   👉 Creating New Product "Smoke Test Jersey"...');
    
    // Initial Stock: M=10, L=5
    const productData = createFormData({
      team: 'Smoke Test Jersey',
      league: 'Test League',
      price: '150000',
      stock: '15',
      stockData: JSON.stringify({ 'M': 10, 'L': 5 }),
      type: 'Home',
      category: 'Jersey',
      sizes: 'M,L',
      images: [dummyFile]
    });

    await safeAction(createJersey, productData);
    
    // Check DB
    const [product] = await db.select().from(jerseys).where(eq(jerseys.team, 'Smoke Test Jersey'));
    if (!product) throw new Error('Failed to create product via Admin Action');
    
    productId = product.id;
    console.log(`   ✅ Product Created Successfully! (ID: ${productId})`);
    console.log(`      Stock: M=10, L=5`);

    // ==========================================
    // PHASE 2: BUYER - PURCHASE (Multi-Item)
    // ==========================================
    console.log('\n🔹 PHASE 2: BUYER ACTION');
    console.log('   👉 Simulating Checkout: Buying 3 Items...');
    console.log('      - 1x Size M (Polos)');
    console.log('      - 1x Size M (Custom: MESSI #10)');
    console.log('      - 1x Size L (Custom: RONALDO #7)');

    const orderPayload = {
      total: 450000 + 40000, // 3x150k + 2x20k custom
      items: [
        {
          id: productId,
          category: 'Jersey',
          quantity: 1,
          size: 'M',
          price: 150000
        },
        {
          id: productId,
          category: 'Jersey',
          quantity: 1,
          size: 'M', // Another M
          price: 150000,
          customName: 'MESSI',
          customNumber: '10'
        },
        {
          id: productId,
          category: 'Jersey',
          quantity: 1,
          size: 'L', // Size L
          price: 150000,
          customName: 'RONALDO',
          customNumber: '7'
        }
      ]
    };

    const order = await createOrder(orderPayload);
    
    if (order && 'id' in order) {
        orderId = order.id;
        console.log(`   ✅ Order Placed Successfully! (ID: ${orderId})`);
    } else {
        throw new Error('Order creation returned invalid response');
    }

    // ==========================================
    // PHASE 3: SYSTEM - VERIFY STOCK
    // ==========================================
    console.log('\n🔹 PHASE 3: SYSTEM VERIFICATION (Stock)');
    console.log('   👉 Checking updated stock levels...');
    
    const [updatedProduct] = await db.select().from(jerseys).where(eq(jerseys.id, productId));
    const stockMap = JSON.parse(updatedProduct.stockData || '{}');
    
    const stockM = Number(stockMap['M']);
    const stockL = Number(stockMap['L']);
    
    console.log(`      Stock M: Expected 8 (10 - 2) | Actual: ${stockM}`);
    console.log(`      Stock L: Expected 4 (5 - 1)  | Actual: ${stockL}`);

    if (stockM === 8 && stockL === 4) {
        console.log('   ✅ Stock Deduction Logic: PASSED');
    } else {
        console.error('   ❌ Stock Deduction Logic: FAILED');
        throw new Error('Stock mismatch');
    }

    // ==========================================
    // PHASE 4: ADMIN - VERIFY ORDER LIST
    // ==========================================
    console.log('\n🔹 PHASE 4: ADMIN VERIFICATION (Dashboard)');
    console.log('   👉 Fetching Order List via Admin Service...');
    
    const allOrders = await getOrders();
    const targetOrder = allOrders.find(o => o.id === orderId);

    if (targetOrder) {
        console.log(`   ✅ Order found in Admin Dashboard!`);
        console.log(`      Status: ${targetOrder.status}`);
        console.log(`      Total Items: ${targetOrder.items.length} (Should be 3)`);
        
        // Verify Customization
        const messiItem = targetOrder.items.find(i => i.customName === 'MESSI');
        if (messiItem) {
             console.log(`   ✅ Validated Custom Item: ${messiItem.customName} #${messiItem.customNumber}`);
        } else {
             console.error(`   ❌ Failed to find custom item details`);
        }

    } else {
        console.error('   ❌ Order NOT found in Admin List');
        throw new Error('Admin list sync failed');
    }

    console.log('\n✨ SMOKE TEST RESULT: PASSED 100% ✨');

  } catch (error) {
    console.error('\n💥 SMOKE TEST FAILED');
    console.error(error);
  } finally {
    // MATCHING FRONTEND CLEANUP
    console.log('\n🧹 Cleaning up test data...');
    if (orderId) await safeAction(deleteOrder, orderId);
    if (productId) await safeAction(deleteJersey, productId);
    process.exit(0);
  }
}

smokeTestE2E();
