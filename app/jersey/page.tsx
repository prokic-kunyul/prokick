import { getJerseys } from '@/services/jerseys'
import { Header } from '@/components/layout/Header'
import { JerseyCatalog } from '@/features/products/components/catalogs/JerseyCatalog'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Koleksi Jersey Bola Original | Grade Ori & Retro',
  description: 'Jual jersey bola terlengkap berbagai liga top Eropa dan musim terbaru. Tersedia jersey retro klasik dan promo menarik.',
}

export default async function JerseyPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams
  const categoryFilter = params.category

  // Redirect legacy routes to new dedicated pages (Safety net)
  if (categoryFilter === 'Windbreaker') {
    redirect('/windbreaker')
  }
  if (categoryFilter === 'Sepatu' || categoryFilter === 'Sepatu Futsal') {
    redirect('/sepatu')
  }
  if (categoryFilter === 'Produk Lainnya') {
    redirect('/lainnya')
  }

  // Fetch Jerseys using Drizzle service
  // Note: getJerseys already serialized the data
  const jerseys = await getJerseys(undefined, 'Jersey')

  const title = categoryFilter ? `Koleksi ${categoryFilter}` : 'Koleksi Jersey & Apparel'

  return (
    <main className="min-h-screen pb-40 pt-20">
      <Header />
      
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8 pt-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
              {title}
            </h1>
            <span className="text-gray-500 font-medium">({jerseys.length})</span>
          </div>
        </div>

        <JerseyCatalog 
            initialJerseys={jerseys} 
            activeCategory={categoryFilter}
            subCategories={['Jersey', 'Promo', 'New Release', 'Retro']}
        />
      </div>
    </main>
  )
}
