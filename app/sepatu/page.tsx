import { getShoes } from '@/services/shoes'
import { Header } from '@/components/layout/Header'
import { ShoeCatalog } from '@/features/products/components/catalogs/ShoeCatalog'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Jual Sepatu Bola & Futsal Original',
  description: 'Koleksi sepatu bola dan futsal terbaru dari brand ternama. Kualitas original dengan harga bersaing.',
}

export default async function ShoePage() {
  const shoes = await getShoes()
  
  // Note: We might want to filter or combine if needed, but for now service call handles simple category
  // If we need 'Sepatu Futsal' too, we might need a custom query or filter on client/service.
  // Assuming 'Sepatu' category covers general shoes or we fetch all and filter.
  // Let's assume the service 'getJerseys' is filtering exactly by 'Sepatu'.
  
  const title = 'Koleksi Sepatu'

  return (
    <main className="min-h-screen pb-20 pt-20">
      <Header />
      
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8 pt-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
              {title}
            </h1>
            <span className="text-gray-500 font-medium">({shoes.length})</span>
          </div>
        </div>

        <ShoeCatalog initialShoes={shoes} />
      </div>
    </main>
  )
}
