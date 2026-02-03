import Link from 'next/link'
import { Button } from '@/components/ui/button'
import * as motion from "framer-motion/client"
import { getBanners } from '@/app/actions/banners'
import { HeroBannerCarousel } from './HeroBannerCarousel'

const HERO_BANNER_IMAGE = '/hero-banner-user.png' // User Design

export async function Hero() {
  const banners = await getBanners()

  // Use DB banners if available, otherwise use default
  const displayBanners = banners.length > 0 
    ? banners 
    : [{ id: 'default', title: 'Selamat Datang', image: HERO_BANNER_IMAGE, link: null, active: true }]

  return (
    <div className="relative overflow-hidden min-h-[80vh] flex items-center bg-[#050A1F]">
      {/* Dynamic Background Gradients (Blue FIFAe Theme) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[0%] right-[0%] w-[60vw] h-[60vw] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen" />

        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#050A1F] to-transparent z-10" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 pt-24 md:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text & Content */}
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             className="text-left space-y-8"
          >
            <span className="inline-block py-1.5 px-3 md:py-2 md:px-4 rounded-full bg-blue-500/10 border border-blue-400/30 text-cyan-300 text-xs md:text-sm font-bold tracking-wider backdrop-blur-md uppercase shadow-[0_0_15px_rgba(59,130,246,0.5)] mb-2 md:mb-0">
              • Pro Kick Toko Olahraga Terbaik
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-white tracking-tight">
              JERSEY BOLA <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-white drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                PREMIUM
              </span>
            </h1>

            <p className="text-base md:text-lg text-blue-100/80 max-w-xl leading-relaxed">
              Koleksi jersey liga top Eropa dan tim nasional. Kualitas terbaik, harga bersaing.
            </p>
            
            {/* Buttons removed as per request to focus on Trending Collection */}
          </motion.div>

          {/* Right Column: Visual Showcase */}
          <motion.div
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="relative"
          >
            {/* Decorative Elements behind Carousel */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur-2xl -z-10" />
            
            <HeroBannerCarousel banners={displayBanners} />
            
            {/* Floating Stats/Badges */}
            {/* Floating Stats/Badges - Removed as per user request */}
            {/* 
            <div className="absolute -bottom-6 -left-6 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl hidden md:block">
              <div className="flex items-center gap-3">
                 <div className="text-3xl font-bold text-white">100%</div>
                 <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Original<br/>Authentic</div>
              </div>
            </div> 
            */}
          </motion.div>

        </div>
      </div>
    </div>
  )
}
