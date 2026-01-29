'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldAlert, RefreshCw, TriangleAlert } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  // Don't show footer on Admin, Login, or specific success pages if needed
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-[#050A1F] border-t border-blue-900/30 pt-20 pb-10 text-sm relative overflow-hidden">
      {/* Subtle Glow at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          
          {/* 1. Brand & Contact */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <div className="relative w-10 h-10 transition-transform duration-300 hover:scale-110">
                    <Image 
                      src="/LOGO.png" 
                      alt="Pro-Kick Logo" 
                      fill
                      className="object-contain"
                    />
                </div>
                <span className="font-black text-white text-2xl tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  PRO<span className="text-cyan-400">-KICK</span>
                </span>
             </div>
             <p className="text-blue-200/60 leading-relaxed font-light">
               Destinasi utama untuk jersey sepak bola kualitas premium. 
               Koleksi lengkap dari berbagai liga top dunia.
             </p>
          </div>

          {/* 2. Legal Disclaimer */}
          <div className="space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2 tracking-wider text-xs uppercase">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              DISCLAIMER HAK CIPTA
            </h3>
            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-amber-500/80 text-xs leading-relaxed backdrop-blur-sm">
              <p>
                <span className="text-amber-500 font-bold">PENTING:</span> PRO-KICK adalah toko independen.
              </p>
              <p className="mt-2 text-blue-200/50">
                Semua produk <strong>&apos;Replika&apos;</strong> / <strong>&apos;Custom&apos;</strong> untuk koleksi. Tidak berafiliasi dengan merek resmi.
              </p>
            </div>
          </div>

          {/* 3. Return Policy */}
          <div className="space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2 tracking-wider text-xs uppercase">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              GARANSI & RETUR
            </h3>
             <ul className="space-y-3 text-blue-200/60 text-xs">
               <li className="flex gap-3">
                 <TriangleAlert className="w-4 h-4 text-cyan-500/50 flex-shrink-0 mt-0.5" />
                 <span>Wajib <strong>Video Unboxing</strong> tanpa jeda.</span>
               </li>
               <li className="flex gap-3">
                 <div className="w-1.5 h-1.5 bg-blue-800 rounded-full mt-1.5 flex-shrink-0" />
                 <span>Garansi cacat mayor (robek/salah size).</span>
               </li>
               <li className="flex gap-3">
                 <div className="w-1.5 h-1.5 bg-blue-800 rounded-full mt-1.5 flex-shrink-0" />
                 <span>Item <strong>Custom Nameset</strong> non-refundable.</span>
               </li>
             </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-900/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-blue-500/40 text-xs font-medium uppercase tracking-widest">
          <p suppressHydrationWarning>&copy; {currentYear} Pro-Kick. Est. 2025.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-cyan-400 transition-colors">Term of Service</Link>
            <Link href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
