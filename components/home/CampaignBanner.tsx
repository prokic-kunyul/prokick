'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function CampaignBanner() {
  return (

    <section className="relative w-full py-32 overflow-hidden bg-[#050A1F] flex items-center justify-center">
      
      {/* Dynamic Background Gradients (Matched with Hero) */}
      <div className="absolute inset-0 bg-[#050A1F] z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[0%] right-[0%] w-[60vw] h-[60vw] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050A1F] to-transparent z-10" />
      </div>

      {/* Immersive Typography Background */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 pointer-events-none select-none overflow-hidden leading-none z-0">
         <div className="text-[15vw] font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-500/50 to-transparent transform -rotate-2 whitespace-nowrap tracking-tighter">
            KOLEKSI TERBARU
         </div>
         <div className="text-[15vw] font-black text-transparent bg-clip-text bg-gradient-to-b from-transparent to-blue-500/50 transform -rotate-2 whitespace-nowrap tracking-tighter ml-32">
            KOLEKSI TERBARU
         </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
           className="max-w-3xl mx-auto space-y-8"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
            APPAREL OLAHRAGA
          </h2>
          
          <p className="text-lg md:text-xl text-blue-100/80 font-light leading-relaxed max-w-2xl mx-auto">
            Lengkapi koleksi jersey-mu dengan windbreaker, sepatu, dan aksesoris.
            Tersedia berbagai pilihan untuk pemain dan fans.
          </p>

          <Button 
            asChild 
            className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-lg px-10 py-7 rounded-none uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-white/50 hover:scale-105 transition-all duration-300"
          >
            <Link href="/products?category=Special Edition">
              SHOP NOW
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Decorative Glitch Accents */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t-4 border-l-4 border-blue-400/30"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-4 border-r-4 border-blue-400/30"></div>

    </section>
  )
}
