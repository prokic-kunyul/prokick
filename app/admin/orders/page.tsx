import { getOrders } from '@/services/orders'
import OrderList from './components/OrderList'

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  // Serialize formatting for Client Component
  interface OrderItem {
    id: string
    size: string
    quantity: number
    price: number | string
    customName?: string | null
    customNumber?: string | null
    customPatch?: string | null
    jersey: {
      team: string
      type: string
      price: number | string
    }
  }

  interface Order {
    id: string
    status: string
    createdAt: Date | string
    customerName?: string | null
    customerPhone?: string | null
    shippingAddress?: string | null
    shippingZone?: string | null
    user?: { name: string | null } | null
    total: number | string
    items: OrderItem[]
    [key: string]: unknown
  }

  const formattedOrders = orders.map((order: unknown) => {
    const o = order as Order
    return {
      ...o,
      total: Number(o.total),
      items: o.items.map((item: OrderItem) => ({
        ...item,
        price: Number(item.price),
        jersey: {
          ...item.jersey,
          price: Number(item.jersey.price)
        }
      }))
    }
  })
  
  return (
    <div>
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Orders</h1>
        <p className="text-gray-400 text-sm">Manage customer bank transfers.</p>
      </header>
      
      <OrderList orders={formattedOrders} />
    </div>
  )
}
