import { getWindbreakers } from '@/services/windbreakers'
import { Header } from '@/components/layout/Header'
import { WindbreakerCatalog } from '@/features/products/components/catalogs/WindbreakerCatalog'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Jaket Windbreaker & Hoodie Bola',
  description: 'Temukan koleksi jaket windbreaker, hoodie, dan sweater tim bola favoritmu. Bahan nyaman dan desain stylish.',
}

export default async function WindbreakerPage() {
  const products = await getWindbreakers()

  const title = 'Koleksi Windbreaker'

  return (
    <main className="min-h-screen pb-20 pt-20">
      <Header />
      
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8 pt-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
              {title}
            </h1>
            <span className="text-gray-500 font-medium">({products.length})</span>
          </div>
        </div>

        <WindbreakerCatalog initialProducts={products} />
      </div>
    </main>
  )
}
