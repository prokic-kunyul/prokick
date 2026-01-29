import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { jerseys } from '@/db/schema'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Production domain
  const baseUrl = 'https://pro-kick.vercel.app'

  // 1. Static Routes
  const routes = [
    '',
    '/jersey',
    '/sepatu',
    '/windbreaker',
    '/lainnya',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // Get all products from all tables
  const { shoes, windbreakers, accessories } = await import('@/db/schema')

  // Jerseys
  const jerseyList = await db.select({ id: jerseys.id, updatedAt: jerseys.updatedAt }).from(jerseys)
  const jerseyUrls = jerseyList.map(p => ({
    url: `${baseUrl}/product/${p.id}`, // Default is Jersey
    lastModified: p.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Shoes
  const shoeList = await db.select({ id: shoes.id, updatedAt: shoes.updatedAt }).from(shoes)
  const shoeUrls = shoeList.map(p => ({
    url: `${baseUrl}/product/${p.id}?type=shoe`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Windbreakers
  const windbreakerList = await db.select({ id: windbreakers.id, updatedAt: windbreakers.updatedAt }).from(windbreakers)
  const windbreakerUrls = windbreakerList.map(p => ({
    url: `${baseUrl}/product/${p.id}?type=windbreaker`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Accessories
  const accessoryList = await db.select({ id: accessories.id, updatedAt: accessories.updatedAt }).from(accessories)
  const accessoryUrls = accessoryList.map(p => ({
    url: `${baseUrl}/product/${p.id}?type=accessory`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...jerseyUrls, ...shoeUrls, ...windbreakerUrls, ...accessoryUrls]


}
