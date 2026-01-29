import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

// Images (Using placeholders if actuals not available for categories)
const CATEGORIES = [
  {
    title: 'Jersey',
    description: 'Koleksi jersey terlengkap',
    link: '/jersey',
    image: '/banner-jersey.png', // User provided Banner
    colSpan: 'md:col-span-2 md:row-span-2', // Hero Item
  },
  {
    title: 'Sepatu',
    description: 'Sepatu bola & futsal',
    link: '/sepatu',
    image: '/banners/shoes.png', // Generated Banner
    colSpan: 'md:col-span-1 md:row-span-1',
  },
  {
    title: 'Windbreaker',
    description: 'Jaket & Outerwear',
    link: '/windbreaker', 
    image: '/banners/windbreaker-v2.png', // Renamed to force update
    colSpan: 'md:col-span-1 md:row-span-1',
  },
  {
    title: 'Produk Lainnya',
    description: 'Aksesoris & Lainnya',
    link: '/lainnya',
    image: '/banners/accessories-v2.png', // User provided Banner
    colSpan: 'md:col-span-2 md:row-span-1', // Wide bottom
  }
]

export function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-6">
         <div>
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Trending Collections</h2>
           <p className="text-gray-400">Jelajahi kategori populer kami</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat.title} 
            href={cat.link}
            className={`relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm ${cat.colSpan} flex flex-col justify-end p-8 transition-all hover:border-white/30`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
               <Image 
                 src={cat.image} 
                 alt={cat.title}
                 fill
                 className="object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>
            
            {/* Background Gradient (Subtle Overlay) */}
            
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {cat.title}
              </h3>
              <p className="text-gray-400 mb-6 max-w-sm">
                {cat.description}
              </p>
              
              <div className="flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                BELANJA SEKARANG <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Decorative Icon or Pattern */}
            <div className="absolute top-4 right-4 text-white/5 transform group-hover:scale-110 transition-transform duration-500">
              {/* Could put icons here */}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
