import { db } from '@/lib/db'
import { accessories } from '@/db/schema'
import { eq, desc, ilike, and } from 'drizzle-orm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeAccessory(item: any) {
  return {
    ...item,
    price: Number(item.price),
    stock: Number(item.stock),
    createdAt: item.createdAt && !isNaN(item.createdAt.getTime()) ? item.createdAt.toISOString() : null,
    updatedAt: item.updatedAt && !isNaN(item.updatedAt.getTime()) ? item.updatedAt.toISOString() : null,
    images: []
  }
}

export async function getAccessories(search?: string) {
  const conditions = []
  if (search) conditions.push(ilike(accessories.team, `%${search}%`))

  const data = await db.select().from(accessories)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(accessories.createdAt))
  
  return data.map(serializeAccessory)
}

export async function getAccessoryById(id: string) {
  const [item] = await db.select().from(accessories).where(eq(accessories.id, id)).limit(1)

  if (!item) return null
  
  return {
    ...serializeAccessory(item),
    images: []
  }
}

export async function getFeaturedAccessories(limitCount: number = 6) {
  const data = await db.select().from(accessories)
    .orderBy(desc(accessories.createdAt))
    .limit(limitCount)
    
  return data.map(serializeAccessory)
}
