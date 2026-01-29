'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home01, Grid01, ShoppingBag03, Menu01 } from '@untitledui/icons'
import { useCartStore } from '@/features/cart/store'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function BottomNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const items = useCartStore((state) => state.items)
  const count = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(prev => prev ? false : prev)
  }, [pathname])

  const isActive = (path: string) => pathname === path

  const mobileLinks = [
    { href: '/products', label: 'Semua Produk' },
    { href: '/jersey', label: 'Koleksi Jersey' },
    { href: '/sepatu', label: 'Koleksi Sepatu' },
    { href: '/windbreaker', label: 'Jaket / Windbreaker' },
    { href: '/lainnya', label: 'Produk Lainnya' },
    { href: '/jersey?league=Premier League', label: 'Premier League' },
    { href: '/jersey?league=La Liga', label: 'La Liga' },
    { href: '/jersey?league=Serie A', label: 'Serie A' },
    { href: '/jersey?league=Bundesliga', label: 'Bundesliga' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050A1F]/90 backdrop-blur-md border-t border-blue-500/10 pb-safe">
      <nav className="flex items-center justify-around h-16 px-2">
        {/* Home */}
        <Link 
          href="/" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            isActive('/') ? "text-cyan-400" : "text-gray-400 hover:text-blue-200"
          )}
        >
          <Home01 className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        {/* Shop */}
        <Link 
          href="/products" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            (pathname.startsWith('/products') && !isActive('/cart')) ? "text-cyan-400" : "text-gray-400 hover:text-blue-200"
          )}
        >
          <Grid01 className="w-6 h-6" />
          <span className="text-[10px] font-medium">Shop</span>
        </Link>

        {/* Cart */}
        <Link 
          href="/cart" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
            isActive('/cart') ? "text-cyan-400" : "text-gray-400 hover:text-blue-200"
          )}
        >
          <div className="relative">
            <ShoppingBag03 className="w-6 h-6" />
            {mounted && count > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                {count}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </Link>

        {/* Menu (Sheet Trigger) */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                mobileMenuOpen ? "text-cyan-400" : "text-gray-400 hover:text-blue-200"
              )}
            >
              <Menu01 className="w-6 h-6" />
              <span className="text-[10px] font-medium">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#050A1F] border-blue-500/10 w-full max-w-[300px] p-0 z-[60] overflow-y-auto">
            <SheetHeader className="p-6 border-b border-blue-500/10">
              <SheetTitle className="text-white text-left text-xl font-bold">Menu Kategori</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-4">
              {mobileLinks.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href}
                  className="text-blue-100 text-base font-medium py-3 border-b border-blue-500/5 hover:text-cyan-400 transition-colors flex items-center justify-between group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                  <span className="text-blue-500/20 group-hover:text-cyan-400">→</span>
                </Link>
              ))}
              
              <Link 
                  href="/track-order"
                  className="text-blue-100 text-base font-medium py-3 border-b border-blue-500/5 hover:text-cyan-400 transition-colors flex items-center justify-between group mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cek Pesanan
                  <span className="text-blue-500/20 group-hover:text-cyan-400">→</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}
