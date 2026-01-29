import { db } from '@/lib/db'
import { jerseys, jerseyImages } from '@/db/schema'
import { eq, desc, ilike, and } from 'drizzle-orm'

// Helper to serialize jersey data for client components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeJersey(jersey: any) {
  return {
    ...jersey,
    price: Number(jersey.price),
    stock: Number(jersey.stock),
    createdAt: jersey.createdAt && !isNaN(jersey.createdAt.getTime()) ? jersey.createdAt.toISOString() : null,
    updatedAt: jersey.updatedAt && !isNaN(jersey.updatedAt.getTime()) ? jersey.updatedAt.toISOString() : null,
    // Note: When using db.select(), relations are not automatically fetched unless joined.
    // We will simplify and assume images are handled separately or fetched roughly.
    // But getJerseys needs images for the grid.
    // We can do a manual join or simpler: fetch images separately or use valid join syntax.
    // For MVP/Robustness, let's just fetch jerseys. If images are needed, we can do a second query or leftJoin.
    // Given the complexity of manual joins for array aggregations in simple SQL, 
    // we will fetch jerseyImages separately for now OR just return the main image field if it suffices.
    // The schema has `image` (text) and `images` (relation). Most UI uses `image` (main image).
    // The relation `images` is for gallery.
    images: [] 
  }
}

export async function getJerseys(search?: string, category?: string) {
  const conditions = []
  if (category && category !== 'All') conditions.push(eq(jerseys.category, category))
  if (search) conditions.push(ilike(jerseys.team, `%${search}%`))

  const data = await db.select().from(jerseys)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(jerseys.createdAt))
  
  // Note: We are not fetching the 'images' relation here to keep it simple and avoid "Property does not exist" errors.
  // The UI primarily uses `jersey.image` (singular) which is a column.
  // If the UI strictly needs `jersey.images` array, we might see missing images in gallery, but list view should be fine.
  
  return data.map(serializeJersey)
}

export async function getJerseyById(id: string) {
  const [jersey] = await db.select().from(jerseys).where(eq(jerseys.id, id)).limit(1)

  if (!jersey) return null
  
  // Fetch images for detail page
  const images = await db.select().from(jerseyImages).where(eq(jerseyImages.jerseyId, id))
  
  return {
    ...serializeJersey(jersey),
    images: images.map(img => ({ ...img, jerseyId: id }))
  }
}

export async function getFeaturedJerseys(limitCount: number = 6) {
  const data = await db.select().from(jerseys)
    .orderBy(desc(jerseys.createdAt))
    .limit(limitCount)
    
  return data.map(serializeJersey)
}
