import { db } from '@/lib/db'
import { windbreakers } from '@/db/schema'
import { eq, desc, ilike, and } from 'drizzle-orm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeWindbreaker(item: any) {
  return {
    ...item,
    price: Number(item.price),
    stock: Number(item.stock),
    createdAt: item.createdAt && !isNaN(item.createdAt.getTime()) ? item.createdAt.toISOString() : null,
    updatedAt: item.updatedAt && !isNaN(item.updatedAt.getTime()) ? item.updatedAt.toISOString() : null,
    images: []
  }
}

export async function getWindbreakers(search?: string) {
  const conditions = []
  if (search) conditions.push(ilike(windbreakers.team, `%${search}%`))

  const data = await db.select().from(windbreakers)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(windbreakers.createdAt))
  
  return data.map(serializeWindbreaker)
}

export async function getWindbreakerById(id: string) {
  const [item] = await db.select().from(windbreakers).where(eq(windbreakers.id, id)).limit(1)

  if (!item) return null
  
  return {
    ...serializeWindbreaker(item),
    images: []
  }
}

export async function getFeaturedWindbreakers(limitCount: number = 6) {
  const data = await db.select().from(windbreakers)
    .orderBy(desc(windbreakers.createdAt))
    .limit(limitCount)
    
  return data.map(serializeWindbreaker)
}
