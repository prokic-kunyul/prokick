
import { db } from '@/lib/db'
import { jerseys, shoes, windbreakers, accessories } from '@/db/schema'
import { ilike, desc } from 'drizzle-orm'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search } = await searchParams
  const query = search || ''

 
  const [jerseyResults, shoeResults, windbreakerResults, accessoryResults] = await Promise.all([
     db.select().from(jerseys).where(ilike(jerseys.team, `%${query}%`)).orderBy(desc(jerseys.createdAt)).limit(20),
     db.select().from(shoes).where(ilike(shoes.team, `%${query}%`)).orderBy(desc(shoes.createdAt)).limit(20),
     db.select().from(windbreakers).where(ilike(windbreakers.team, `%${query}%`)).orderBy(desc(windbreakers.createdAt)).limit(20),
     db.select().from(accessories).where(ilike(accessories.team, `%${query}%`)).orderBy(desc(accessories.createdAt)).limit(20),
  ])

  // Normalize Data for Display
  const results = [
    ...jerseyResults.map(i => ({ ...i, displayCategory: 'Jersey', href: `/product/${i.id}` })),
    ...shoeResults.map(i => ({ ...i, displayCategory: 'Sepatu', href: `/product/${i.id}?type=shoe` })),
    ...windbreakerResults.map(i => ({ ...i, displayCategory: 'Windbreaker', href: `/product/${i.id}?type=windbreaker` })),
    ...accessoryResults.map(i => ({ ...i, displayCategory: 'Aksesoris', href: `/product/${i.id}?type=accessory` })),
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="max-w-[1440px] mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
                <h1 className="text-3xl font-black">{query ? 'Hasil Pencarian' : 'Semua Produk'}</h1>
                <p className="text-gray-400">
                    {query ? (
                        <>Menampilkan {results.length} produk untuk <span className="text-white font-bold">&quot;{query}&quot;</span></>
                    ) : (
                        <>Menampilkan total {results.length} produk tersedia</>
                    )}
                </p>
            </div> 
        </div>

        {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🔍</span>
                </div>
                <h2 className="text-xl font-bold">Produk tidak ditemukan</h2>
                <p className="text-gray-400 max-w-md">
                    Coba kata kunci lain atau periksa ejaan Anda.
                </p>
                <Link href="/" className="px-6 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-700 transition-colors">
                    Kembali ke Beranda
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {results.map((item) => (
                    <Link 
                        key={`${item.displayCategory}-${item.id}`} 
                        href={item.href}
                        className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
                    >
                        <div className="relative aspect-[4/5] bg-white/5 overflow-hidden">
                            {item.image ? (
                                <Image 
                                    src={item.image} 
                                    alt={item.team} 
                                    fill 
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold">
                                    NO IMAGE
                                </div>
                            )}
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                                {item.displayCategory}
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            <h3 className="font-bold text-lg leading-tight group-hover:text-blue-400 transition-colors line-clamp-1">
                                {item.team}
                            </h3>
                            <p className="text-sm text-gray-500">{item.season || item.type}</p>
                            <div className="flex items-center justify-between pt-2">
                                <span className="font-bold text-white">
                                    {formatCurrency(Number(item.price))}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </main>
      
    </div>
  )
}
