
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

async function verifyAdminOrders() {
  console.log('🧪 Testing Admin Orders Flow...');
  
  const dummyInfo = Buffer.from('fake image content');
  const dummyFile = new File([dummyInfo], 'test_admin.jpg', { type: 'image/jpeg' });
  let productId: string | null = null;
  let orderId: string | null = null;

  try {
    // 1. SETUP: Create Jersey
    console.log('\n[Setup] Creating Test Product...');
    const productData = createFormData({
      team: 'Admin Test FC',
      league: 'Test League',
      price: '500000',
      stock: '10',
      stockData: JSON.stringify({ 'M': 10 }),
      type: 'Player Issue', // Crucial to verify this field
      category: 'Jersey',
      sizes: 'M',
      images: [dummyFile]
    });
    await safeAction(createJersey, productData);
    const [product] = await db.select().from(jerseys).where(eq(jerseys.team, 'Admin Test FC'));
    productId = product.id;

    // 2. SETUP: Create Order
    console.log('[Setup] Creating Test Order...');
    const orderPayload = {
      total: 500000,
      items: [{ id: productId, category: 'Jersey', quantity: 1, size: 'M', price: 500000 }]
    };
    const newOrder = await createOrder(orderPayload);
    if ('id' in newOrder) orderId = newOrder.id;

    // 3. ACTION: Call getOrders()
    console.log('\n👉 Action: Calling getOrders()...');
    const allOrders = await getOrders();
    
    // 4. VERIFICATION
    const testOrder = allOrders.find(o => o.id === orderId);
    
    if (testOrder) {
        console.log(`✅ Result: Found created order (ID: ${testOrder.id})`);
        
        // Verify Enrichment
        console.log('👉 Verifying Data Enrichment (Joins)...');
        console.log(`   - Order Total: ${testOrder.total}`);
        
        if (testOrder.items && testOrder.items.length > 0) {
            const item = testOrder.items[0];
            console.log(`   - Item Jersey Team: ${item.jersey.team}`);
            console.log(`   - Item Jersey Type: ${item.jersey.type}`);
            
            if (item.jersey.team === 'Admin Test FC' && item.jersey.type === 'Player Issue') {
                console.log('✅ Verification Passed: Jersey details properly joined and mapped.');
            } else {
                console.error('❌ Verification Failed: Jersey details mismatch or missing.');
            }
        } else {
            console.error('❌ Verification Failed: Order has no items.');
        }

    } else {
        console.error('❌ Verification Failed: Protocol order not found in fetch list.');
    }

  } catch (error) {
    console.error('❌ Error executing flow:', error);
  } finally {
    // CLEANUP
    console.log('\n🧹 Cleaning up...');
    if (orderId) await safeAction(deleteOrder, orderId);
    if (productId) await safeAction(deleteJersey, productId);
    process.exit(0);
  }
}

verifyAdminOrders();
