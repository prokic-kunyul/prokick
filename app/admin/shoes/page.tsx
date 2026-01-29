
import { getShoes } from '@/services/shoes'
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
// Note: DeleteProductButton needs to be generic or I need a DeleteShoeButton. 
// I'll create a local DeleteButton component or reuse if possible.
// The existing `DeleteProductButton` likely imports `deleteJersey`.
// I will just use a simple form button here for now or duplicate the button component.
import { deleteShoe } from '@/app/actions/shoes'

export default async function AdminShoesPage() {
  const shoes = await getShoes()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Shoes</h1>
          <p className="text-gray-400 text-sm">Manage your football boots.</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/shoes/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Shoe
          </Link>
        </Button>
      </div>

      <Card className="bg-[#111] border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Product</TableHead>
              <TableHead className="text-gray-400">Brand</TableHead>
              <TableHead className="text-gray-400">Price</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shoes.map((shoe) => (
              <TableRow key={shoe.id} className="border-white/5 hover:bg-white/5">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {shoe.image && (
                        <Image src={shoe.image} alt={shoe.team} fill sizes="48px" className="object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white">{shoe.team}</div>
                      <div className="text-xs text-gray-500">{shoe.type}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{shoe.league}</TableCell>
                <TableCell className="font-bold text-blue-400">{formatCurrency(Number(shoe.price))}</TableCell>
                <TableCell className="text-right">
                   <form action={async () => {
                      'use server'
                      await deleteShoe(shoe.id)
                   }}>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                   </form>
                </TableCell>
              </TableRow>
            ))}
             {shoes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-gray-500">
                    No shoes found.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
