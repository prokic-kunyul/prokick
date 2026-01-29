'use client'

import { PROMOS } from '@/lib/promo'

interface PromoBannerProps {
  totalQty: number
}

export function PromoBanner({ totalQty }: PromoBannerProps) {
  return (
    <div className="bg-[#111] p-4 mb-6 border border-white/10">
      <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-sm">🔥 Promo Spesial!</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <div className={`p-2 border ${totalQty >= 2 ? 'bg-white text-black border-white font-bold' : 'bg-black text-gray-600 border-white/10'}`}>
          ✓ {PROMOS.freeShipping.label}
        </div>
        <div className={`p-2 border ${totalQty >= 3 ? 'bg-white text-black border-white font-bold' : 'bg-black text-gray-600 border-white/10'}`}>
          ✓ {PROMOS.freePatch.label}
        </div>
        <div className={`p-2 border ${totalQty >= 5 ? 'bg-white text-black border-white font-bold' : 'bg-black text-gray-600 border-white/10'}`}>
          ✓ {PROMOS.megaBundle.label}
        </div>
      </div>
    </div>
  )
}
