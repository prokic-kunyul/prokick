'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import * as motion from "framer-motion/client"
import { Eye } from 'lucide-react'
import { useQuickView } from '@/components/QuickViewProvider'





export interface ProductCardProps {
  jersey: {
    id: string
    team: string
    league: string
    season: string
    type: string
    price: number | string | unknown
    image: string | null
    stock?: number
    sizes?: string
    stockData?: string | Record<string, number>
    category?: string
  }
}

export function ProductCard({ jersey }: ProductCardProps) {
  const { openQuickView } = useQuickView()
  const stock = jersey.stock ?? 0
  const isSoldOut = stock === 0
  const isLowStock = stock > 0 && stock < 5

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openQuickView({
      id: jersey.id,
      team: jersey.team,
      type: jersey.type,
      league: jersey.league,
      season: jersey.season,
      price: Number(jersey.price),
      image: jersey.image,
      sizes: jersey.sizes || 'S,M,L,XL',
      stockData: jersey.stockData || '{}',
      category: jersey.category
    })
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative"
    >
        <Link href={`/product/${jersey.id}`} className="cursor-pointer block">
          {/* Image Container */}
          <div className="relative aspect-[4/5] bg-blue-900/5 overflow-hidden mb-4 border border-blue-500/10 group-hover:border-cyan-400/30 transition-colors">
            {jersey.image ? (
              <Image 
                src={jersey.image} 
                alt={jersey.team} 
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                 <span className="text-gray-800 font-bold text-xl uppercase tracking-widest">No Image</span>
              </div>
            )}
            
            {/* Hover Glow & Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]" />

            {/* Quick View Button - Center on Hover */}
            <button
              onClick={handleQuickView}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg hover:scale-110"
              title="Quick View"
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* Smart Badges - Top Left */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
               {isSoldOut ? (
                 <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Sold Out</span>
               ) : isLowStock ? (
                 <span className="bg-orange-500 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Low Stock</span>
               ) : null}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1">
            {/* Title */}
            {/* Title */}
            <h3 className="text-base font-medium text-white leading-tight group-hover:text-blue-300 transition-colors line-clamp-1">
              {jersey.team} {(!['-', 'General'].includes(jersey.type) && !['Windbreaker', 'Sepatu', 'Sepatu Futsal', 'Produk Lainnya'].includes(jersey.category || '')) && jersey.type}
            </h3>
            
            {/* Subtitle - Smart Logic for Brand/League */}
            {(() => {
               const isGeneric = ['Windbreaker', 'Sepatu', 'Sepatu Futsal', 'Produk Lainnya'].includes(jersey.category || '')
               const showLeague = !['-', 'General', 'Sportswear'].includes(jersey.league) // Show Brand/League if not valid
               const showSeason = !['-', 'General'].includes(jersey.season) && !isGeneric // Hide season for generic items

               if (!showLeague && !showSeason) return null

               return (
                 <p className="text-sm text-gray-500">
                   {showLeague && jersey.league} {showSeason && jersey.season}
                 </p>
               )
            })()}
            
            {/* Price */}
            <div className="pt-2">
              <span className="text-base font-medium text-white">
                {formatCurrency(Number(jersey.price))}
              </span>
            </div>
          </div>
        </Link>
    </motion.div>
  )
}
