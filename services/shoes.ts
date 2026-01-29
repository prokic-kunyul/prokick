import { db } from '@/lib/db'
import { shoes } from '@/db/schema'
import { eq, desc, ilike, and } from 'drizzle-orm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeShoe(shoe: any) {
  return {
    ...shoe,
    price: Number(shoe.price),
    stock: Number(shoe.stock),
    createdAt: shoe.createdAt && !isNaN(shoe.createdAt.getTime()) ? shoe.createdAt.toISOString() : null,
    updatedAt: shoe.updatedAt && !isNaN(shoe.updatedAt.getTime()) ? shoe.updatedAt.toISOString() : null,
    images: [] // TODO: Add shoe_images table if gallery needed
  }
}

export async function getShoes(search?: string) {
  const conditions = []
  // Shoes checks for 'Sepatu' category implicitly by table, but redundant check doesn't hurt.
  // Actually, table is dedicated, so no category filter needed unless sub-categories exist.
  // We'll trust the table.
  if (search) conditions.push(ilike(shoes.team, `%${search}%`))

  const data = await db.select().from(shoes)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(shoes.createdAt))
  
  return data.map(serializeShoe)
}

export async function getShoeById(id: string) {
  const [shoe] = await db.select().from(shoes).where(eq(shoes.id, id)).limit(1)

  if (!shoe) return null
  
  // No gallery for now
  return {
    ...serializeShoe(shoe),
    images: []
  }
}

export async function getFeaturedShoes(limitCount: number = 6) {
  const data = await db.select().from(shoes)
    .orderBy(desc(shoes.createdAt))
    .limit(limitCount)
    
  return data.map(serializeShoe)
}
