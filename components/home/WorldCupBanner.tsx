'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import * as motion from "framer-motion/client"

export function WorldCupBanner() {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#050A1F]">
      
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-600/10 blur-[100px] rounded-full" />
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050A1F] to-transparent z-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Content */}
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="text-center lg:text-left space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold text-xs tracking-widest uppercase mx-auto lg:mx-0">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                    </span>
                    Official Merchandise
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                    WORLD CUP <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                        2026 IS HERE
                    </span>
                </h2>

                <p className="text-lg text-gray-400 max-w-md leading-relaxed mx-auto lg:mx-0">
                    Koleksi jersey tim nasional untuk Piala Dunia 2026. Lengkap dari berbagai negara peserta.
                </p>

                <div className="flex gap-4 pt-4 justify-center lg:justify-start">
                    <Button asChild size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold rounded-full px-8 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all">
                        <Link href="/piala-dunia">
                            BELANJA SEKARANG
                        </Link>
                    </Button>
                </div>
            </motion.div>

            {/* Right: Abstract Visual / Trophy Placeholder */}
            <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="relative h-[250px] md:h-[400px] w-full rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm group"
            >
                 {/* Visual Placeholder - Replaced with uploaded image */}
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Image 
                      src="/banners/piala-dunia.png" 
                      alt="World Cup 2026" 
                      fill
                      className="object-contain p-2 hover:scale-105 transition-transform duration-700"
                    />
                 </div>
                 
                 {/* Glass Text Overlay (Optional - kept for style but can be removed if image has text) */}
                 <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 pointer-events-none">
                     <div className="flex justify-between items-end">
                         <div>
                             <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">Limited Edition</p>
                             <h3 className="text-white font-bold text-xl">Official Kits 2026</h3>
                         </div>
                         <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                         </div>
                     </div>
                 </div>
            </motion.div>
        </div>
      </div>
    </section>
  )
}
