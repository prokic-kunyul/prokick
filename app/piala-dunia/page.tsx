import { Header } from '@/components/layout/Header'
import { db } from '@/lib/db'
import { jerseys } from '@/db/schema'
import { eq, ilike, or, desc } from 'drizzle-orm'
import { ProductCard } from '@/features/products/components/ProductCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Piala Dunia 2026 | Pro-Kick',
  description: 'Koleksi Jersey Resmi Piala Dunia 2026. Dukung tim jagoanmu dengan jersey original.',
}

async function getWorldCupproducts() {
  const products = await db.select().from(jerseys).where(
    or(
        eq(jerseys.league, 'World Cup 2026'),
        ilike(jerseys.league, '%World Cup%'),
        ilike(jerseys.league, '%Piala Dunia%')
    )
  ).orderBy(desc(jerseys.createdAt))

  return products.map(p => ({
    ...p,
    category: p.category, 
    image: p.image
  }))
}

export default async function WorldCupPage() {
  const products = await getWorldCupproducts()

  return (
    <main className="min-h-screen bg-[#02040a]">
      <Header />
      
      {/* Hero Section */}
      <div className="relative pt-20 h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[#050A1F]">
             <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent" />
        </div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

        <div className="relative z-10 text-center px-4">
          <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold tracking-widest text-xs mb-4 backdrop-blur-sm">
            OFFICIAL MERCHANDISE
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_25px_rgba(234,179,8,0.3)]">
            WORLD CUP <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">2026</span>
          </h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            Rasakan euforia kompetisi sepak bola terbesar di dunia. Dapatkan jersey tim nasional favoritmu dengan kualitas player issue.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16">
         {products.length > 0 ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {products.map((product) => (
               <ProductCard key={product.id} jersey={product} />
             ))}
           </div>
         ) : (
           <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
             <div className="text-6xl mb-4">🏆</div>
             <h2 className="text-2xl font-bold text-white mb-2">Koleksi Belum Dirilis</h2>
             <p className="text-gray-400">Nantikan kedatangan jersey Piala Dunia 2026 segera.</p>
           </div>
         )}
      </div>
    </main>
  )
}
