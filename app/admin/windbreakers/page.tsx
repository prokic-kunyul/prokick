
import { getWindbreakers } from '@/services/windbreakers'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'
import { deleteWindbreaker } from '@/app/actions/windbreakers'

export default async function AdminWindbreakersPage() {
  const items = await getWindbreakers()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Windbreakers</h1>
          <p className="text-gray-400 text-sm">Manage jackets and hoodies.</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/windbreakers/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Link>
        </Button>
      </div>

      <Card className="bg-[#111] border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Product</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Price</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-white/5 hover:bg-white/5">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {item.image && (
                        <Image src={item.image} alt={item.team} fill sizes="48px" className="object-cover" />
                      )}
                    </div>
                    <div className="font-bold text-white">{item.team}</div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{item.type}</TableCell>
                <TableCell className="font-bold text-blue-400">{formatCurrency(Number(item.price))}</TableCell>
                <TableCell className="text-right">
                   <form action={async () => {
                      'use server'
                      await deleteWindbreaker(item.id)
                   }}>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                   </form>
                </TableCell>
              </TableRow>
            ))}
             {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-gray-500">
                    No windbreakers found.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
