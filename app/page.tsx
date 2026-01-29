import { Header } from '@/components/layout/Header'
import { TestimonialList } from '@/features/testimonials/components/TestimonialList'
import { Hero } from '@/components/home/Hero'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { CampaignBanner } from '@/components/home/CampaignBanner'
import { WorldCupBanner } from '@/components/home/WorldCupBanner'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | Jual Jersey Bola, Sepatu & Apparel',
  description: 'Belanja keperluan sepak bola terlengkap. Jersey Liga Inggris, Spanyol, Italia, Sepatu Bola, dan Jaket Windbreaker. Diskon setiap hari!',
}

export default async function Home() {
  // const jerseys = await getFeaturedJerseys(8) // Fetch 8 latest products (Kept if needed later or remove variable usage if totally unused, but keeping for safety if I revert)
  
  // JSON-LD for Organization & Website
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Pro-Kick',
        url: 'https://pro-kick.vercel.app', // TODO: Actual Domain
        logo: 'https://pro-kick.vercel.app/FAVICON.png',
        sameAs: [
          'https://instagram.com/prokick.id',
          'https://twitter.com/prokick_id'
        ]
      },
      {
        '@type': 'WebSite',
        name: 'Pro-Kick',
        url: 'https://pro-kick.vercel.app',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://pro-kick.vercel.app/products?search={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  }

  return (
    <main className="min-h-screen bg-[#050A1F]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Hero />
      <WorldCupBanner />
      <CategoryGrid />
      <CampaignBanner />
      <TestimonialList />
    </main>
  )
}
