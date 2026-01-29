'use server'

import { db } from '@/lib/db'
import { jerseys, jerseyImages } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'

import { verifyAdmin } from './auth'

export async function createJersey(formData: FormData) {
  await verifyAdmin()
  const team = formData.get('team') as string

  const league = formData.get('league') as string || '-'
  const season = formData.get('season') as string || '-'
  const type = formData.get('type') as string || 'General'
  const price = parseFloat(formData.get('price') as string)
  const sizes = formData.get('sizes') as string
  const stock = parseInt(formData.get('stock') as string)
  const stockData = formData.get('stockData') as string // JSON string
  const description = formData.get('description') as string || null
  const category = formData.get('category') as string || 'Jersey'

  // Handle Multiple File Uploads
  const imageFiles = formData.getAll('images') as File[]
  const uploadedPaths: string[] = []

  if (imageFiles && imageFiles.length > 0) {
    const { supabase } = await import('@/lib/supabase')
    
    for (const file of imageFiles) {
      if (file.size > 0) {
         const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/\s/g, '-')}`
         
         const { error } = await supabase.storage
            .from('products')
            .upload(filename, file, {
              cacheControl: '3600',
              upsert: false
            })
            
         if (!error) {
            const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filename)
            uploadedPaths.push(publicUrlData.publicUrl)
         }
      }
    }
  }

  const mainImage = uploadedPaths.length > 0 ? uploadedPaths[0] : null

  await db.transaction(async (tx) => {
    const [insertedJersey] = await tx.insert(jerseys).values({
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
    }).returning({ id: jerseys.id });

    if (uploadedPaths.length > 0) {
      await tx.insert(jerseyImages).values(
        uploadedPaths.map(url => ({
          url,
          jerseyId: insertedJersey.id
        }))
      )
    }
  })

  try {
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/jerseys')
  } catch {}
  
  redirect('/admin/jerseys')
}

export async function updateJersey(id: string, formData: FormData) {
  await verifyAdmin()
  const team = formData.get('team') as string
  const league = formData.get('league') as string || '-'
  const season = formData.get('season') as string || '-'
  const type = formData.get('type') as string || 'General'
  const price = parseFloat(formData.get('price') as string)
  const sizes = formData.get('sizes') as string
  const stock = parseInt(formData.get('stock') as string)
  const stockData = formData.get('stockData') as string
  const description = formData.get('description') as string || null
  const category = formData.get('category') as string || 'Jersey'

  // Handle new image uploads
  const imageFiles = formData.getAll('images') as File[]
  const uploadedPaths: string[] = []

  if (imageFiles && imageFiles.length > 0) {
    const { supabase } = await import('@/lib/supabase')

    for (const file of imageFiles) {
      if (file.size > 0) {
         const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/\s/g, '-')}`
         
         const { error } = await supabase.storage
            .from('products')
            .upload(filename, file, {
              cacheControl: '3600',
              upsert: false
            })

         if (!error) {
            const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filename)
            uploadedPaths.push(publicUrlData.publicUrl)
         }
      }
    }
  }

  // Build update data
  const updateData: Partial<typeof jerseys.$inferInsert> = {
    team,
    league,
    season,
    type,
    category,
    price,
    sizes,
    stock,
    stockData,
    description
  }

  await db.transaction(async (tx) => {
    // Only update image if new ones uploaded
    if (uploadedPaths.length > 0) {
      updateData.image = uploadedPaths[0]
      // Delete old images and add new ones
      await tx.delete(jerseyImages).where(eq(jerseyImages.jerseyId, id))
      await tx.insert(jerseyImages).values(
        uploadedPaths.map(url => ({
          url,
          jerseyId: id
        }))
      )
    }

    await tx.update(jerseys)
        .set(updateData)
        .where(eq(jerseys.id, id))
  })

  try {
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/jerseys')
    revalidatePath(`/product/${id}`)
  } catch {}
  
  redirect('/admin/jerseys')
}

export async function deleteJersey(id: string) {
  await verifyAdmin()
  // Delete related images first (manual cascade just in case)
  await db.delete(jerseyImages).where(eq(jerseyImages.jerseyId, id))
  await db.delete(jerseys).where(eq(jerseys.id, id))
  
  try {
    revalidatePath('/admin/jerseys')
    revalidatePath('/products')
    revalidatePath('/')
  } catch {}
}
