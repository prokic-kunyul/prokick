
import { createJersey, deleteJersey } from '../app/actions/jersey';
import { createOrder } from '../app/actions/order';
import { db } from '../lib/db';
import { jerseys, orders } from '../db/schema';
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

async function verifyCheckout() {
  console.log('🧪 Testing Checkout Process Flow...');
  
  const dummyInfo = Buffer.from('fake image content');
  const dummyFile = new File([dummyInfo], 'test_checkout.jpg', { type: 'image/jpeg' });
  let productId: string | null = null;
  let orderId: string | null = null;

  try {
    // 1. SETUP: Create a Product with known stock
    console.log('\n👉 Action: Creating Test Product for Checkout...');
    const productData = createFormData({
      team: 'Checkout Verify Jersey',
      league: 'Test',
      price: '100000',
      stock: '10', // Total
      stockData: JSON.stringify({ 'L': 5, 'XL': 5 }),
      type: 'Home',
      category: 'Jersey',
      sizes: 'L,XL',
      images: [dummyFile]
    });
    
    await safeAction(createJersey, productData);
    
    const [product] = await db.select().from(jerseys).where(eq(jerseys.team, 'Checkout Verify Jersey'));
    if (!product) throw new Error('Failed to create setup product');
    productId = product.id;
    console.log(`✅ Result: Created Product (ID: ${productId}) with 5 Stock (L).`);

    // 2. ACTION: Create Order to buy 2 items
    console.log('\n👉 Action: Calling createOrder (Buy 2 Size L)...');
    const orderPayload = {
      total: 200000,
      items: [
        {
          id: productId,
          category: 'Jersey',
          quantity: 2,
          size: 'L',
          price: 100000
        }
      ]
    };

    const order = await createOrder(orderPayload);
    
    if (order && 'id' in order) {
        orderId = order.id;
        console.log(`✅ Result: Order Created (ID: ${orderId}).`);

        // 3. VERIFICATION: Stock Deduction
        console.log('\n👉 Action: Verifying Stock Deduction in DB...');
        const [updatedProduct] = await db.select().from(jerseys).where(eq(jerseys.id, productId));
        const stockMap = JSON.parse(updatedProduct.stockData || '{}');
        const currentStockL = Number(stockMap['L']);
        
        console.log(`   - Previous Stock (L): 5`);
        console.log(`   - Items Bought: 2`);
        console.log(`   - Current Stock (L): ${currentStockL}`);

        if (currentStockL === 3) {
            console.log('✅ Verification Passed: Stock correctly deducted.');
        } else {
            console.error(`❌ Verification Failed: Stock match error. Expected 3, got ${currentStockL}.`);
        }
    } else {
        console.error('❌ Failed to create order.');
    }

  } catch (error) {
    console.error('❌ Error executing flow:', error);
  } finally {
    // CLEANUP
    console.log('\n🧹 Cleaning up test data...');
    if (orderId) {
        await db.delete(orders).where(eq(orders.id, orderId));
        console.log('   - Deleted Test Order');
    }
    if (productId) {
        await safeAction(deleteJersey, productId);
        console.log('   - Deleted Test Product');
    }
    process.exit(0);
  }
}

verifyCheckout();
