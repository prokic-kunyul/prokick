'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/features/cart/store'
import { useEffect, useState } from 'react'
import { SearchMd, ShoppingBag03 } from '@untitledui/icons'
import { MainNavigation } from './MainNavigation'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((state) => state.items)
  const count = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(prev => !prev ? true : prev)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#050A1F]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 supports-[backdrop-filter]:bg-[#050A1F]/60">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
           <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110">
             <Image 
               src="/LOGO.png" 
               alt="Pro-Kick Logo" 
               fill
               className="object-contain"
             />
           </div>
           <span className="md:block text-xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
             PRO<span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">-KICK</span>
           </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <MainNavigation />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
           {/* Search Input - Desktop */}
           <form 
             onSubmit={(e) => {
               e.preventDefault()
               const formData = new FormData(e.currentTarget)
               const query = formData.get('q') as string
               if (query.trim()) {
                 window.location.href = `/products?search=${encodeURIComponent(query)}`
               }
             }}
             className="hidden md:flex items-center bg-white/5 rounded-full px-5 py-2.5 w-64 focus-within:w-80 focus-within:bg-white/10 transition-all duration-300 border border-white/10 focus-within:border-cyan-500/50 hover:border-white/20 shadow-inner"
           >
              <SearchMd className="w-4 h-4 text-blue-300/50 flex-shrink-0" />
              <input 
                name="q"
                type="text"
                placeholder="Search..."
                className="ml-3 text-sm text-white bg-transparent outline-none w-full placeholder:text-blue-300/30 font-medium tracking-wide"
                autoComplete="off"
              />
           </form>

           {/* Cart - Hidden on Mobile */}
           <Link href="/cart" className="hidden md:block relative p-2 rounded-full hover:bg-blue-500/10 transition-colors group">
            <ShoppingBag03 className="w-5 h-5 text-white group-hover:text-cyan-400 transition-colors" />
            {mounted && count > 0 && (
              <span className="absolute top-0 right-0 bg-cyan-500 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

