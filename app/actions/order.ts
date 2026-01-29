'use server'

import { db } from '@/lib/db'
import { orders, orderItems, jerseys, shoes, windbreakers, accessories } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { eq, and, gt, count } from 'drizzle-orm'
import { verifyAdmin } from './auth'

export async function createOrder(data: {
  total: number
  userId?: string
  customer?: {
    name: string
    phone: string
    address: string
    zone?: string
  }
  items: {
    id: string
    category: string
    quantity: number
    size: string
    price: number
    customName?: string
    customNumber?: string
    customPatch?: string
  }[]
}) {
  let ip = "unknown"
  try {
    const headerStore = await headers()
    ip = headerStore.get("x-forwarded-for") || "unknown"
  } catch {
    // Ignore error when running in script/outside request context
  }

  // 🛡️ In-Memory Flood Protection (First Line of Defense)
  // Prevent rapid spam (e.g. max 5 orders per minute per IP)
  const { rateLimit } = await import('@/lib/ratelimit')
  const floodCheck = rateLimit(ip, 5, 60 * 1000)
  
  if (!floodCheck.success) {
     throw new Error("Slow down! You are making requests too quickly.")
  }

  // 🛡️ Rate Limit Implementation
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  
  const [limitCheck] = await db.select({ value: count() })
    .from(orders)
    .where(and(
        eq(orders.ipAddress, ip),
        gt(orders.createdAt, oneHourAgo)
    ));
    
  if (limitCheck.value >= 20) { // Bump limit for testing
    throw new Error("Terlalu banyak order dibuat. Mohon tunggu beberapa saat.")
  } 

  // Transaction: Validate Stock -> Decrement -> Create Order
  const orderResult = await db.transaction(async (tx) => {
    // 1. Check & Update Stock for each item
    for (const item of data.items) {
      let table;
      // Determine table based on category
      // Default to Jersey if undefined or 'Jersey'
      const cat = item.category || 'Jersey'
      
      if (cat === 'Sepatu') table = shoes
      else if (cat === 'Windbreaker') table = windbreakers
      else if (cat === 'Produk Lainnya') table = accessories
      else table = jerseys

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results = await tx.select().from(table as any).where(eq((table as any).id, item.id)).limit(1)
      const product = results[0]

      if (!product) throw new Error(`Produk tidak ditemukan (ID: ${item.id}, Kat: ${cat})`)

      const stockMap = JSON.parse(product.stockData || '{}')
      const currentQty = Number(stockMap[item.size] || 0)

      // Check only, don't throw if strictly needed, but let's keep check to prevent ordering 0 stock items visually?
      // For now, allow ordering even if stock low, or keep check?
      // User said "who knows if they are iseng", implying we shouldn't block real buyers if the 'iseng' one took the stock.
      // So effectively we just skip the update. The check below is fine to keep IF we want to prevent ordering obviously OOS items.
      // But if we want to allow "Backorder", we can comment this out too.
      // Let's keep the check for now so UI is consistent (can't buy out of stock item).
      if (currentQty < item.quantity) {
        throw new Error(`Stok habis untuk ${product.team} ukuran ${item.size}. Tersisa: ${currentQty}`)
      }

      /* 
      // DISABLED: User requested to turn off auto-deduction for 'Transfer' payment
      // Stock will be managed manually by Admin upon confirmation to prevent fake orders depleting stock.
      
      // Decrement
      stockMap[item.size] = currentQty - item.quantity

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await tx.update(table as any)
        .set({
            stockData: JSON.stringify(stockMap),
            stock: product.stock - item.quantity 
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .where(eq((table as any).id, product.id))
      */
    }

    // 2. Create Order
    const [newOrder] = await tx.insert(orders).values({
      total: data.total,
      userId: data.userId,
      ipAddress: ip,
      status: 'PENDING_TRANSFER',
      customerName: data.customer?.name,
      customerPhone: data.customer?.phone,
      shippingAddress: data.customer?.address,
      shippingZone: data.customer?.zone,
    }).returning();

    // 3. Create Order Items
    if (data.items.length > 0) {
        await tx.insert(orderItems).values(
            data.items.map(item => {
               const cat = item.category || 'Jersey'
               return {
                orderId: newOrder.id,
                quantity: item.quantity,
                size: item.size,
                price: item.price,
                // Polymorphic FK
                jerseyId: (!cat || cat === 'Jersey' || cat === 'Promo') ? item.id : null,
                shoeId: (cat === 'Sepatu') ? item.id : null,
                windbreakerId: (cat === 'Windbreaker') ? item.id : null,
                accessoryId: (cat === 'Produk Lainnya') ? item.id : null,
                // Customization
                customName: item.customName,
                customNumber: item.customNumber,
                customPatch: item.customPatch,
               }
            })
        )
    }
    
    return newOrder;
  })
  
  try {
    revalidatePath('/admin/orders')
    revalidatePath('/products')
  } catch {}
  
  return {
    ...orderResult,
    total: Number(orderResult.total),
    id: orderResult.id
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await verifyAdmin()
    await db.update(orders)
        .set({ status })
        .where(eq(orders.id, id))
        
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    console.error('Error updating order:', error)
    return { success: false, error: 'Failed to update order' }
  }
}

export async function deleteOrder(id: string) {
  try {
    await verifyAdmin()
    // Manually delete items first (safer)
    await db.delete(orderItems).where(eq(orderItems.orderId, id))
    await db.delete(orders).where(eq(orders.id, id))
    
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    console.error('Error deleting order:', error)
    return { success: false, error: 'Failed to delete order' }
  }
}
