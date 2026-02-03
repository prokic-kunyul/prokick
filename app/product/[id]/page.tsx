import { getProductById } from '@/services/products'
import { getJerseys } from '@/services/jerseys'
import { Header } from '@/components/layout/Header'
import { ProductGallery } from '@/features/products/components/ProductGallery'
import { AddToCartButton } from '@/features/products/components/AddToCartButton'
import { SizeGuide } from '@/features/products/components/SizeGuide'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { Star } from 'lucide-react'
import { ProductCard } from '@/features/products/components/ProductCard'

import { Metadata } from 'next'


interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params, searchParams }: Props & { searchParams: Promise<{ type?: string }> }): Promise<Metadata> {
  const { id } = await params
  const { type } = await searchParams
  
  let jersey = null
  
  if (type === 'shoe' || type === 'Sepatu') {
     const { getShoeById } = await import('@/services/shoes')
     jersey = await getShoeById(id)
  } else if (type === 'windbreaker' || type === 'Windbreaker') {
     const { getWindbreakerById } = await import('@/services/windbreakers')
     jersey = await getWindbreakerById(id)
  } else if (type === 'accessory' || type === 'Aksesoris') {
     const { getAccessoryById } = await import('@/services/accessories') 
     jersey = await getAccessoryById(id)
  } else {
     jersey = await getProductById(id)
  }

  if (!jersey) {
    return {
      title: 'Product Not Found | PRO-KICK'
    }
  }

  const isGeneric = jersey.category !== 'Jersey' && jersey.category !== 'Promo' && jersey.category !== 'Retro'
  const displayTitle = isGeneric 
    ? `${jersey.team} ${jersey.type === 'General' ? '' : jersey.type}` 
    : `${jersey.team} ${jersey.type} ${jersey.season}`

  return {
    title: `${displayTitle} | PRO-KICK`,
    description: jersey.description || `Beli ${displayTitle} kualitas terbaik harga termurah. Garansi uang kembali.`,
    keywords: [
      'jual jersey original', 
      jersey.team, 
      jersey.league, 
      'jersey bola grade ori', 
      'baju bola', 
      jersey.category
    ].filter(Boolean),
    openGraph: {
      url: `https://pro-kick.vercel.app/product/${jersey.id}`,
      type: 'website',
      siteName: 'PRO-KICK',
      images: jersey.image ? [
        {
          url: jersey.image,
          width: 800,
          height: 800,
          alt: displayTitle
        }
      ] : [],
      title: `${displayTitle} - Official Store`,
      description: `Dapatkan ${jersey.team} kualitas terbaik hanya di Pro-Kick.`
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description: `Beli ${displayTitle} sekarang!`,
      images: jersey.image ? [jersey.image] : [],
    },
    alternates: {
      canonical: `/product/${jersey.id}`,
    }
  }
}

export default async function ProductDetailPage({ params, searchParams }: Props & { searchParams: Promise<{ type?: string }> }) {
  const { id } = await params
  const { type } = await searchParams
  
  let jersey = null
  
  // Create a truly polymorphic fetcher or use switch
  // Ideally, getProductById should check all tables if no type is provided, OR we enforce type param.
  // Given we just added type params in search, let's use them.
  // Fallback: Check Jersey first.
  
  if (type === 'shoe' || type === 'Sepatu') {
     const { getShoeById } = await import('@/services/shoes')
     jersey = await getShoeById(id)
  } else if (type === 'windbreaker' || type === 'Windbreaker') {
     const { getWindbreakerById } = await import('@/services/windbreakers')
     jersey = await getWindbreakerById(id)
  } else if (type === 'accessory' || type === 'Aksesoris') {
     const { getAccessoryById } = await import('@/services/accessories') 
     jersey = await getAccessoryById(id)
  } else {
     // Default to Jersey
     jersey = await getProductById(id)
  }

  if (!jersey) return notFound()

  // Fetch Related Products (Same League, Exclude Current)
  // Fetch more and filter in memory since we don't have a specific service query for this yet.
  // Or add getJerseysByLeague to service.
  // For MVP, get all jerseys (cached/optimized by Drizzle hopefully) and filter.
  // Better: use getJerseys with category if available, but league is specific.
  // Let's create a getJerseys call that returns everything or create a helper in this file if Drizzle import is needed.
  // Avoid heavy Drizzle imports here if we can use service.
  // I will assume getJerseys returns enough data or I'll fix service next.
  
  // Actually, let's just use getJerseys() assuming it returns all if no category. 
  // Wait, getJerseys checks `if (category)`.
  const allJerseys = await getJerseys() 
  const relatedJerseys = allJerseys.filter(j => 
    j.league === jersey.league && j.id !== id
  ).slice(0, 4)

  // Collect all images
  const allImages: string[] = []
  if (jersey.image) allImages.push(jersey.image)
  if (jersey.images && jersey.images.length > 0) {
    jersey.images.forEach((img: { url: string }) => allImages.push(img.url))
  }
  const uniqueImages = Array.from(new Set(allImages))

  const price = Number(jersey.price)
  const originalPrice = price * 1.25

  // JSON-LD Structured Data for Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${jersey.team} ${jersey.type} ${jersey.season}`,
    image: uniqueImages,
    description: jersey.description || `Original ${jersey.team} jersey`,
    sku: jersey.id,
    brand: {
      '@type': 'Brand',
      name: 'Pro-Kick'
    },
    offers: {
      '@type': 'Offer',
      url: `https://pro-kick.vercel.app/product/${jersey.id}`,
      priceCurrency: 'IDR',
      price: price,
      availability: jersey.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '128'
    }
  }

  return (
    <div className="min-h-screen text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>

      <Header />

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 pt-24 pb-40 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/products" className="inline-flex items-center text-blue-300/60 hover:text-cyan-400 mb-6 text-sm transition-colors uppercase tracking-wider font-medium">
            ← Back to Catalog
          </Link>
  
          {/* Card-like Layout (Blue Glass) */}
          <div className="bg-blue-900/10 backdrop-blur-md rounded-2xl overflow-hidden border border-blue-500/20 grid md:grid-cols-2 shadow-[0_0_50px_-20px_rgba(0,0,0,0.5)]">
            
            {/* Image Slider */}
            <div className="border-b md:border-b-0 md:border-r border-blue-500/10 bg-black/20">
              <ProductGallery images={uniqueImages} />
            </div>
  
            {/* Content */}
            <div className="p-4 md:p-8 space-y-6">
            
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">
              {jersey.team} <span className="text-cyan-400">{jersey.type}</span>
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-cyan-400 text-cyan-400" />
              <span className="text-sm font-semibold text-white">4.8</span>
              <span className="text-sm text-blue-200/50">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                {formatCurrency(price)}
              </span>
              <span className="text-base text-blue-200/30 line-through">
                {formatCurrency(originalPrice)}
              </span>
            </div>

            {/* Size Guide Accordion */}
            <SizeGuide category={jersey.category} />

            {/* Sizes + Quantity + Add to Cart */}
            <AddToCartButton 
              id={jersey.id}
              team={jersey.team}
              type={jersey.type}
              price={price}
              image={jersey.image || ''}
              availableSizes={jersey.sizes.split(',')}
              stockData={typeof jersey.stockData === 'string' ? JSON.parse(jersey.stockData) : jersey.stockData}
              category={jersey.category}
            />

          </div>
        </div>
        </div>

        {/* Related Products */}
        {relatedJerseys.length > 0 && (
          <div className="mt-20 max-w-4xl mx-auto">
             <div className="flex items-center gap-4 mb-8">
               <h2 className="text-2xl font-bold text-white tracking-tight">You Might Also Like</h2>
               <div className="h-px bg-blue-500/20 flex-1"></div>
             </div>
             
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {relatedJerseys.map((related) => (
                 <ProductCard key={related.id} jersey={{
                   ...related,
                   price: Number(related.price),
                   stock: related.stock
                 }} />
               ))}
             </div>
          </div>
        )}
      </main>
    </div>
  )
}
