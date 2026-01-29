import { getJerseys } from '@/services/jerseys'
import Link from 'next/link'
import Image from 'next/image'
import { DeleteProductButton } from './components/DeleteProductButton'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil } from 'lucide-react'

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ search?: string, category?: string }> }) {
  const params = await searchParams
  const search = params.search || ''
  const category = params.category || ''

  const jerseys = await getJerseys(search, category)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Products</h1>
            <p className="text-gray-400 text-sm">Manage your inventory.</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
            <Link href="/admin/jerseys/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Jersey
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form className="flex-1 relative">
             <input 
               name="search"
               placeholder="Search jumpers/kits..."
               defaultValue={search}
               className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
               type="text"
             />
             <button type="submit" className="hidden" /> 
             {/* Implicit submit on enter */}
          </form>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {jerseys.map((jersey) => (
          <Card key={jersey.id} className="bg-[#111] border-white/10">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-white/5 rounded-lg flex-shrink-0 overflow-hidden relative">
                  {jersey.image ? (
                    <Image src={jersey.image} alt={jersey.team} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{jersey.team}</h3>
                  <p className="text-sm text-gray-400">{jersey.type} • {jersey.league}</p>
                  <p className="text-sm text-gray-500">{jersey.season}</p>
                  <p className="text-blue-400 font-bold mt-1">{formatCurrency(Number(jersey.price))}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button asChild variant="outline" size="sm" className="flex-1 border-white/10 text-white hover:bg-white/5">
                  <Link href={`/admin/jerseys/${jersey.id}/edit`}>
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Link>
                </Button>
                <DeleteProductButton id={jersey.id} />
              </div>
            </CardContent>
          </Card>
        ))}
        
        {jerseys.length === 0 && (
          <Card className="bg-[#111] border-white/10">
            <CardContent className="p-8 text-center text-gray-500">
              No products found. Start adding some!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card className="bg-[#111] border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-400">Product</TableHead>
                <TableHead className="text-gray-400">League</TableHead>
                <TableHead className="text-gray-400">Season</TableHead>
                <TableHead className="text-gray-400">Price</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jerseys.map((jersey) => (
                <TableRow key={jersey.id} className="border-white/5 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden relative">
                        {jersey.image ? (
                          <Image src={jersey.image} alt={jersey.team} fill sizes="48px" className="object-cover" />
                        ) : (
                          <span className="text-xs text-gray-500">No Img</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{jersey.team}</div>
                        <div className="text-xs text-gray-500">{jersey.type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{jersey.league}</TableCell>
                  <TableCell className="text-gray-300">{jersey.season}</TableCell>
                  <TableCell className="font-bold text-blue-400">{formatCurrency(Number(jersey.price))}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                        <Link href={`/admin/jerseys/${jersey.id}/edit`}>Edit</Link>
                      </Button>
                      <DeleteProductButton id={jersey.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {jerseys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-gray-500">
                    No products found. Start adding some!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
