
import { createJersey, deleteJersey } from '../app/actions/jersey';
import { createOrder } from '../app/actions/order';
import { db } from '../lib/db';
import { jerseys, orders } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Blob } from 'buffer';

// Mock File class for Node.js
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

// Wrapper to ignore Redirect errors
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
async function safeAction(action: Function, ...args: any[]) {
  try {
    return await action(...args);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    if (message === 'NEXT_REDIRECT') return;
    if (message.includes('Invariant: static generation store')) return; 
    throw e;
  }
}

async function main() {
  console.log('🚬 Starting Comprehensive Smoke Test...');
  
  const dummyInfo = Buffer.from('fake image content');
  const dummyFile = new File([dummyInfo], 'test.jpg', { type: 'image/jpeg' });
  const idsToDelete: string[] = [];

  try {
    // --- 1. CREATE PRODUCT FOR CHECKOUT ---
    console.log('\n[1/2] Creating Product for Checkout...');
    const productData = createFormData({
      team: 'Checkout Test Jersey',
      league: 'Test',
      price: '150000',
      stock: '10',
      stockData: JSON.stringify({ 'L': 5, 'XL': 5 }),
      type: 'Home',
      category: 'Jersey',
      sizes: 'L,XL',
      images: [dummyFile]
    });
    
    await safeAction(createJersey, productData);
    
    const [product] = await db.select().from(jerseys).where(eq(jerseys.team, 'Checkout Test Jersey'));
    if (!product) throw new Error('Failed to create product');
    idsToDelete.push(product.id);
    console.log('✅ Product Created:', product.id);

    // --- 2. CHECKOUT (CREATE ORDER) ---
    console.log('\n[2/2] Testing Checkout (Order Creation)...');
    
    // Simulate Cart Item
    const orderPayload = {
      total: 300000,
      items: [
        {
          id: product.id,
          category: 'Jersey',
          quantity: 2,
          size: 'L',
          price: 150000
        }
      ]
    };

    const order = await createOrder(orderPayload);
    
    if (order && 'id' in order) {
        console.log('✅ Order Created:', order.id);
        
        // Check DB directly
        const [dbOrder] = await db.select().from(orders).where(eq(orders.id, order.id));
        if (dbOrder) {
          console.log('   -> Verified in Database (Status: ' + dbOrder.status + ')');
        } else {
          console.error('   ❌ Order NOT found in DB');
        }

        // Verify Stock Reduction
        const [updatedProduct] = await db.select().from(jerseys).where(eq(jerseys.id, product.id));
        const stockMap = JSON.parse(updatedProduct.stockData || '{}');
        console.log('   -> Stock Check (L):', stockMap['L']);
        
        if (Number(stockMap['L']) === 3) { // Started with 5, bought 2
           console.log('   ✅ Stock correctly reduced by 2');
        } else {
           console.error('   ❌ Stock update failed. Expected 3, got', stockMap['L']);
        }

        // Clean up order
        await db.delete(orders).where(eq(orders.id, order.id));
        console.log('   -> Test Order Saved & Cleaned up.');

    } else {
        console.error('❌ Failed to create Order', order);
    }

  } catch (err) {
    console.error('🔥 Test Failed:', err);
  } finally {
    // Cleanup Products
    console.log('\n🧹 Cleaning up...');
    for (const id of idsToDelete) {
      await safeAction(deleteJersey, id);
    }
    console.log('✨ Done.');
    process.exit(0);
  }
}

main();
