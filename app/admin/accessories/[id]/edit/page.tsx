
import Link from 'next/link'
import Image from 'next/image'
import { getAccessoryById } from '@/services/accessories'
import { StockManager } from '@/features/products/components/StockManager'
import { notFound } from 'next/navigation'
import { updateAccessory } from '@/app/actions/accessories'

export default async function EditAccessoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getAccessoryById(id)
  
  if (!item) notFound()

  const updateWithId = updateAccessory.bind(null, id)

  let stockDataMap = {}
  try {
    stockDataMap = JSON.parse(item.stockData || '{}')
  } catch (e) {
    console.error('Failed to parse stockData', e)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/accessories" className="text-gray-400 hover:text-white transition-colors">
          &larr; Back to Accessories
        </Link>
        <h1 className="text-3xl font-bold mt-4">Edit Accessory</h1>
        <p className="text-gray-400">Editing: {item.team}</p>
      </div>

      <form action={updateWithId} className="glass p-8 rounded-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-300 mb-2">Product Name</label>
            <input
              type="text"
              name="team"
              required
              defaultValue={item.team}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Type</label>
             <input
                 name="type"
                 defaultValue={item.type || 'Accessory'}
                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Price (IDR)</label>
            <input
              type="number"
              name="price"
              required
              defaultValue={Number(item.price)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Stock Manager */}
        <div>
          <StockManager initialData={stockDataMap} category="Produk Lainnya" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={item.description || ''}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        {/* Current Image */}
        {item.image && (
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Current Image</label>
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5 relative">
                <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Update Image (Optional)</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-bold file:cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
        >
          Update Item
        </button>
      </form>
    </div>
  )
}
