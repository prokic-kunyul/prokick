import Link from 'next/link'
import { ArrowRight } from '@untitledui/icons'
import { ProductList } from '@/features/products/components/ProductList'

interface Jersey {
  id: string
  team: string
  league: string
  season: string
  type: string
  price: number | string
  image: string | null
}

interface FeaturedProductsProps {
  jerseys: Jersey[]
}

export function FeaturedProducts({ jerseys }: FeaturedProductsProps) {
  return (
    <div id="collection" className="container mx-auto px-4 pb-20 relative z-10">
      <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-6">
         <div>
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Trending Kits</h2>
           <p className="text-gray-400">Most popular jerseys this week</p>
         </div>
         <Link href="/jersey" className="hidden md:flex items-center gap-2 text-white font-bold hover:text-gray-300 transition-colors">
           View All <ArrowRight className="w-5 h-5 ml-1" />
         </Link>
      </div>
      <ProductList jerseys={jerseys} />
    </div>
  )
}
