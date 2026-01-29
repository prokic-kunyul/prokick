import { db } from '@/lib/db'
import { testimonials } from '@/db/schema'
import { desc, gt } from 'drizzle-orm'

// Fetch all testimonials for Admin
export async function getTestimonials() {
  return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt))
}

// Fetch public testimonials for Landing Page
export async function getPublicTestimonials() {
  return await db.select().from(testimonials)
    .where(gt(testimonials.rating, 3))
    .orderBy(desc(testimonials.createdAt))
    .limit(10)
}
