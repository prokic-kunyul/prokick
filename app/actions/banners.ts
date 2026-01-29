'use server'

import { db } from '@/lib/db'
import { banners } from '@/db/schema'
import { eq, desc, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getBanners() {
  try {
    const data = await db.select().from(banners).where(eq(banners.active, true)).orderBy(asc(banners.order))
    return data
  } catch (error) {
    console.error('Error fetching banners:', error)
    return []
  }
}

export async function getAllBannersAdmin() {
  try {
    const data = await db.select().from(banners).orderBy(desc(banners.createdAt))
    return data
  } catch (error) {
    console.error('Error fetching admin banners:', error)
    return []
  }
}

export async function createBanner(formData: FormData) {
  const title = formData.get('title') as string
  const link = formData.get('link') as string
  const imageFile = formData.get('image') as File

  if (!imageFile) {
    return { error: 'Image is required' }
  }

  // Upload Image
  const { supabase } = await import('@/lib/supabase')
  const filename = `banner-${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`
  
  const { error } = await supabase.storage
    .from('products')
    .upload(filename, imageFile, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
     return { error: 'Upload failed' }
  }

  const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filename)
  const imageUrl = publicUrlData.publicUrl

  await db.insert(banners).values({
    title,
    link,
    image: imageUrl,
    active: true,
    order: 0
  })

  revalidatePath('/')
  revalidatePath('/admin/settings')
  return { success: true }
}

export async function deleteBanner(id: string) {
  try {
    await db.delete(banners).where(eq(banners.id, id))
    revalidatePath('/')
    revalidatePath('/admin/settings')
    return { success: true }
  } catch (error) {
    console.error('Delete banner error:', error)
    return { success: false, error: 'Failed to delete' }
  }
}

export async function toggleBannerStatus(id: string) {
  try {
    const [banner] = await db.select().from(banners).where(eq(banners.id, id)).limit(1)
    if (!banner) return { success: false, error: 'Banner not found' }

    await db.update(banners)
      .set({ active: !banner.active })
      .where(eq(banners.id, id))

    revalidatePath('/')
    revalidatePath('/admin/settings')
    return { success: true }
  } catch (error) {
    console.error('Toggle banner error:', error)
    return { success: false, error: 'Failed to toggle status' }
  }
}
