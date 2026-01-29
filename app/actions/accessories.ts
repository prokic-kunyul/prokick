'use server'

import { db } from '@/lib/db'
import { accessories } from '@/db/schema' 
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'

import { verifyAdmin } from './auth'

export async function createAccessory(formData: FormData) {
  await verifyAdmin()
  const team = formData.get('team') as string // Used as Name
  const league = formData.get('league') as string || '-' 
  const season = formData.get('season') as string || '-'
  const type = formData.get('type') as string || 'Accessory'
  const price = parseFloat(formData.get('price') as string)
  const sizes = formData.get('sizes') as string
  const stock = parseInt(formData.get('stock') as string)
  const stockData = formData.get('stockData') as string
  const description = formData.get('description') as string || null
  const category = 'Produk Lainnya'

  const imageFiles = formData.getAll('images') as File[]
  let mainImage: string | null = null

  if (imageFiles && imageFiles.length > 0) {
    const { supabase } = await import('@/lib/supabase')
    const file = imageFiles[0]
    if (file.size > 0) {
        const filename = `acc-${Date.now()}-${file.name.replace(/\s/g, '-')}`
        const { error } = await supabase.storage.from('products').upload(filename, file, { upsert: false })
        if (!error) {
            const { data } = supabase.storage.from('products').getPublicUrl(filename)
            mainImage = data.publicUrl
        }
    }
  }

  await db.insert(accessories).values({
      team,
      league, 
      season,
      type,
      category,
      price,
      sizes,
      stock,
      stockData,
      description,
      image: mainImage,
  })

  revalidatePath('/admin/accessories')
  revalidatePath('/lainnya')
  redirect('/admin/accessories')
}

export async function deleteAccessory(id: string) {
  await verifyAdmin()
  await db.delete(accessories).where(eq(accessories.id, id))
  revalidatePath('/admin/accessories')
  revalidatePath('/lainnya')
}

export async function updateAccessory(id: string, formData: FormData) {
  await verifyAdmin()
  const team = formData.get('team') as string
  const league = formData.get('league') as string || '-' 
  const season = formData.get('season') as string || '-'
  const type = formData.get('type') as string || 'Accessory'
  const price = parseFloat(formData.get('price') as string)
  const sizes = formData.get('sizes') as string
  const stock = parseInt(formData.get('stock') as string)
  const stockData = formData.get('stockData') as string
  const description = formData.get('description') as string || null
  const category = 'Produk Lainnya'

  const imageFiles = formData.getAll('images') as File[]
  let mainImage: string | null = null

  if (imageFiles && imageFiles.length > 0) {
    const { supabase } = await import('@/lib/supabase')
    const file = imageFiles[0]
    if (file.size > 0) {
        const filename = `acc-${Date.now()}-${file.name.replace(/\s/g, '-')}`
        const { error } = await supabase.storage.from('products').upload(filename, file, { upsert: false })
        if (!error) {
            const { data } = supabase.storage.from('products').getPublicUrl(filename)
            mainImage = data.publicUrl
        }
    }
  }

  const updateData: Partial<typeof accessories.$inferInsert> = {
      team,
      league, // used as Brand
      season,
      type,
      category,
      price,
      sizes,
      stock,
      stockData,
      description,
  }

  if (mainImage) {
      updateData.image = mainImage
  }

  await db.update(accessories)
      .set(updateData)
      .where(eq(accessories.id, id))

  revalidatePath('/admin/accessories')
  revalidatePath('/lainnya')
  revalidatePath(`/product/${id}`)
  redirect('/admin/accessories')
}
