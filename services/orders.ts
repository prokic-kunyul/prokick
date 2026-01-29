import { db } from '@/lib/db'
import { orders, orderItems, jerseys, shoes, windbreakers, accessories, users } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function getOrders() {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt))
    
    // For each order, fetch items and user
    // (In a real app, use joins. For now, Promise.all mapping is easy migration step)
    const enrichedOrders = await Promise.all(allOrders.map(async (order) => {
      const items = await db.select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        size: orderItems.size,
        price: orderItems.price,
        jerseyId: orderItems.jerseyId,
        shoeId: orderItems.shoeId,
        windbreakerId: orderItems.windbreakerId,
        accessoryId: orderItems.accessoryId,
        // Customization fields
        customName: orderItems.customName,
        customNumber: orderItems.customNumber,
        customPatch: orderItems.customPatch,
        // Fetch details from all tables
        jerseyName: jerseys.team,
        jerseyType: jerseys.type,
        shoeName: shoes.team,
        shoeType: shoes.type,
        windbreakerName: windbreakers.team,
        windbreakerType: windbreakers.type,
        accessoryName: accessories.team,
        accessoryType: accessories.type,
      })
      .from(orderItems)
      .leftJoin(jerseys, eq(orderItems.jerseyId, jerseys.id))
      .leftJoin(shoes, eq(orderItems.shoeId, shoes.id))
      .leftJoin(windbreakers, eq(orderItems.windbreakerId, windbreakers.id))
      .leftJoin(accessories, eq(orderItems.accessoryId, accessories.id))
      .where(eq(orderItems.orderId, order.id))

      let user = null
      if (order.userId) {
        const [u] = await db.select().from(users).where(eq(users.id, order.userId)).limit(1)
        user = u
      }

      return {
        ...order,
        user,
        items: items.map(i => {
          // Coalesce Product Info
          const team = i.jerseyName || i.shoeName || i.windbreakerName || i.accessoryName || 'Unknown Product'
          const type = i.jerseyType || i.shoeType || i.windbreakerType || i.accessoryType || 'General'
          
          return {
            ...i,
            jersey: { team, type } // Keep structure compatible with frontend
          }
        })
      }
    }))

    return enrichedOrders
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}
