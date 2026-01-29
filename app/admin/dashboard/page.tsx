import { db } from '@/lib/db'
import { jerseys, testimonials, orders } from '@/db/schema'
import { count } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Package, MessageSquare, ShoppingCart, BarChart3 } from 'lucide-react'

export default async function AdminDashboard() {
  const [productsCount] = await db.select({ value: count() }).from(jerseys)
  const [testimonialsCount] = await db.select({ value: count() }).from(testimonials)
  const [ordersCount] = await db.select({ value: count() }).from(orders)

  const stats = [
    { 
      label: 'Total Products', 
      value: productsCount, 
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'Testimonials', 
      value: testimonialsCount, 
      icon: MessageSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      label: 'Total Orders', 
      value: ordersCount, 
      icon: ShoppingCart,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
  ]

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm md:text-base">Welcome back, Admin.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="bg-[#111] border-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 md:mt-12">
        <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/admin/jerseys">
              <Package className="w-4 h-4 mr-2" />
              Manage Products
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <Link href="/admin/orders">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Orders
            </Link>
          </Button>
          <Button disabled variant="outline" className="border-white/10 text-gray-500">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>
    </div>
  )
}
