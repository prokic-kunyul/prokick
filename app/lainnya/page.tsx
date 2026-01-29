import { getAccessories } from '@/services/accessories'
import { Header } from '@/components/layout/Header'
import { AccessoriesCatalog } from '@/features/products/components/catalogs/AccessoriesCatalog'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Aksesoris & Perlengkapan Bola Lainnya',
  description: 'Lengkapi kebutuhan sepak bola Anda dengan kaos kaki, tas, dan aksesoris lainnya.',
}

export default async function OtherProductsPage() {
  const products = await getAccessories()
  
  // Note: The previous logic filtered by 'Produk Lainnya' OR 'Aksesoris'.
  // If 'Lainnya' covers both, fine. If not, we might need to adjust filter.
  // Assume 'Lainnya' is the DB key.

  const title = 'Aksesoris & Produk Lainnya'

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

        <AccessoriesCatalog 
          initialProducts={products} 
          activeCategory="Produk Lainnya"
        />
      </div>
    </main>
  )
}
