'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { X, CheckCircle, Trash2, Loader2, Truck } from 'lucide-react'
import { updateOrderStatus, deleteOrder } from '@/app/actions/order'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'react-hot-toast'

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
  }
}

interface Order {
  id: string
  status: string
  total: number | string
  createdAt: Date | string
  customerName?: string | null
  customerPhone?: string | null
  shippingAddress?: string | null
  shippingZone?: string | null
  user?: { name: string | null } | null
  items: OrderItem[]
}

export default function OrderList({ orders }: { orders: Order[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusUpdate = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to mark this order as ${status}?`)) return
    
    setLoadingId(id)
    const res = await updateOrderStatus(id, status)
    if (res.success) {
      toast.success(`Order marked as ${status}`)
    } else {
      toast.error('Failed to update status')
    }
    setLoadingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to DELETE this order? This cannot be undone.')) return

    setLoadingId(id)
    const res = await deleteOrder(id)
    if (res.success) {
      toast.success('Order deleted')
    } else {
      toast.error('Failed to delete order')
    }
    setLoadingId(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_TRANSFER':
        return <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-0">Pending Transfer</Badge>
      case 'PAID':
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0">Paid</Badge>
      case 'SHIPPED':
        return <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0">Shipped</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="bg-[#111] border-white/10 relative overflow-hidden">
          {loadingId === order.id && (
             <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
             </div>
          )}
          
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                {getStatusBadge(order.status)}
                <p className="text-gray-400 text-xs mt-2">
                  Order ID: <span className="font-mono text-gray-300">{order.id.slice(0, 8)}...</span>
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(order.createdAt).toLocaleString('id-ID')}
                </p>
                {order.user && (
                  <p className="text-blue-400 text-sm font-medium">Customer: {order.user.name}</p>
                )}
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-white">
                {formatCurrency(Number(order.total))}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {/* Customer Information */}
            {(order.customerName || order.customerPhone || order.shippingAddress) && (
              <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                <h3 className="text-blue-400 font-semibold text-sm mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {order.customerName && (
                    <div>
                      <span className="text-gray-500">Nama:</span>
                      <span className="text-white ml-2 font-medium">{order.customerName}</span>
                    </div>
                  )}
                  {order.customerPhone && (
                    <div>
                      <span className="text-gray-500">No. HP/WA:</span>
                      <span className="text-white ml-2 font-medium">{order.customerPhone}</span>
                    </div>
                  )}
                  {order.shippingAddress && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Alamat Pengiriman:</span>
                      <p className="text-white mt-1">{order.shippingAddress}</p>
                    </div>
                  )}
                  {order.shippingZone && (
                    <div>
                      <span className="text-gray-500">Zona:</span>
                      <span className="text-cyan-400 ml-2 font-medium">{order.shippingZone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Items Table */}
            <div className="bg-white/5 rounded-lg overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-gray-500 text-xs">Item</TableHead>
                    <TableHead className="text-gray-500 text-xs text-right">Size</TableHead>
                    <TableHead className="text-gray-500 text-xs text-right">Qty</TableHead>
                    <TableHead className="text-gray-500 text-xs text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id} className="border-white/5 hover:bg-transparent">
                      <TableCell className="text-white font-medium text-sm">
                        <div>
                          {item.jersey.team}
                          <span className="text-gray-500 text-xs ml-1">({item.jersey.type})</span>
                        </div>
                        {(item.customName || item.customNumber || item.customPatch) && (
                          <div className="text-xs text-cyan-400 mt-1 flex flex-wrap gap-2">
                            {item.customName && <span>✍️ {item.customName}</span>}
                            {item.customNumber && <span>#{item.customNumber}</span>}
                            {item.customPatch && <span>🏅 {item.customPatch}</span>}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm text-right">{item.size}</TableCell>
                      <TableCell className="text-gray-300 text-sm text-right">x{item.quantity}</TableCell>
                      <TableCell className="text-gray-300 text-sm text-right">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 flex-wrap">
              {order.status !== 'CANCELLED' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                  className="border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              )}
              
              {order.status !== 'PAID' && order.status !== 'SHIPPED' && order.status !== 'CANCELLED' && (
                  <Button 
                    size="sm"
                    onClick={() => handleStatusUpdate(order.id, 'PAID')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Mark Paid
                  </Button>
              )}

              {order.status === 'PAID' && (
                  <Button 
                    size="sm"
                    onClick={() => handleStatusUpdate(order.id, 'SHIPPED')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Truck className="w-4 h-4 mr-1" />
                    Mark Shipped
                  </Button>
              )}
              
              <Button 
                 variant="ghost"
                 size="icon"
                 onClick={() => handleDelete(order.id)}
                 className="text-gray-600 hover:text-red-500 hover:bg-red-500/10 ml-auto sm:ml-0"
              >
                  <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {orders.length === 0 && (
        <Card className="bg-[#111] border-white/10 border-dashed">
          <CardContent className="py-16 text-center text-gray-500">
            No orders found.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
