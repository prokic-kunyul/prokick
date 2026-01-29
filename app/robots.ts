import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pro-kick.vercel.app'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Jangan index halaman admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
