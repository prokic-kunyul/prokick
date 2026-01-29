'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as motion from "framer-motion/client"
import { AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface Banner {
  id: string
  title: string | null
  image: string
  link: string | null
}

export function HeroBannerCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  const next = () => setCurrent(prev => (prev + 1) % banners.length)
  const prev = () => setCurrent(prev => (prev - 1 + banners.length) % banners.length)

  const activeBanner = banners[current]

  const Content = (
    <div className="relative w-full aspect-video md:aspect-[2/1] bg-[#050505] rounded-2xl overflow-hidden border border-blue-500/30 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] group cursor-pointer hover:shadow-[0_0_50px_-5px_rgba(59,130,246,0.5)] hover:border-blue-400/50 transition-all duration-500">
      <AnimatePresence mode='wait'>
        <motion.div
           key={activeBanner.id}
           initial={{ opacity: 0, scale: 1.05 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.5 }}
           className="absolute inset-0"
        >
          <Image 
            src={activeBanner.image}
            alt={activeBanner.title || 'Banner'}
            fill
            className="object-cover" 
            priority
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

      {/* Navigation Buttons (Only if > 1) */}
      {banners.length > 1 && (
        <>
            <button 
                onClick={(e) => { e.preventDefault(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
                onClick={(e) => { e.preventDefault(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {banners.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'bg-white w-6' : 'bg-white/50'}`} 
                    />
                ))}
            </div>
        </>
      )}
    </div>
  )

  if (activeBanner.link) {
    return <Link href={activeBanner.link} className='block w-full max-w-5xl mx-auto mb-10'>{Content}</Link>
  }

  return <div className='relative w-full max-w-5xl mx-auto items-center justify-center flex mb-10'>{Content}</div>
}
