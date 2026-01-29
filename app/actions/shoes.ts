'use server'

import { db } from '@/lib/db'
import { shoes } from '@/db/schema' // Assuming shoes table doesn't have a separate images table yet or uses same logic? 
// Wait, I didn't verify if I created `shoe_images` table. 
// Checking schema.ts: I only created `shoes` table. 
// `jerseys` had `jerseyImages`. 
// For now, I'll stick to single image in `image` column or check if I need unrelated table.
// The `jerseys` table has `image` column but also `jerseyImages` relation.
// `shoes` table has `image` column.
// For MVP, I'll just use the main `image` column logic first. 
// If I need multiple images, I should have created `shoe_images` but I didn't see that in the plan.
// Let's check schema again briefly or just proceed with single image for now to match `shoes` definition.

// Checking schema logic from memory/previous tools: 
// `jerseys` had `jerseyImages`. `shoes` likely does NOT have `shoeImages` unless I created it.
// I'll assume single image or store multiple in a JSON/array if schema supports it, 
// BUT `shoes` table def viewed earlier:
// image: text("image"),
// So single image column. I will simplify the action to handle just that or store array in a text field if needed?
// No, standard is single main image. I'll stick to that for now to avoid schema errors.

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'

import { verifyAdmin } from './auth'

export async function createShoe(formData: FormData) {
  await verifyAdmin()
  const team = formData.get('team') as string
  const league = formData.get('league') as string || '-' // Brand
  const season = formData.get('season') as string || '-'
  const type = formData.get('type') as string || 'Football Boot'
  const price = parseFloat(formData.get('price') as string)
  const sizes = formData.get('sizes') as string
  const stock = parseInt(formData.get('stock') as string)
  const stockData = formData.get('stockData') as string
  const description = formData.get('description') as string || null
  const category = 'Sepatu'

  // Handle Image Upload (Single/Multiple)
  // For simplicity and matching schema, we'll take the first image as main.
  const imageFiles = formData.getAll('images') as File[]
  let mainImage: string | null = null

  if (imageFiles && imageFiles.length > 0) {
    const { supabase } = await import('@/lib/supabase')
    
    // Upload first image
    const file = imageFiles[0]
    if (file.size > 0) {
        const filename = `shoes-${Date.now()}-${file.name.replace(/\s/g, '-')}`
        const { error } = await supabase.storage.from('products').upload(filename, file, { upsert: false })
        if (!error) {
            const { data } = supabase.storage.from('products').getPublicUrl(filename)
            mainImage = data.publicUrl
        }
    }
  }

  await db.insert(shoes).values({
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
      image: mainImage,
  })

  revalidatePath('/admin/shoes')
  revalidatePath('/sepatu')
  redirect('/admin/shoes')
}

export async function deleteShoe(id: string) {
  await verifyAdmin()
  await db.delete(shoes).where(eq(shoes.id, id))
  revalidatePath('/admin/shoes')
  revalidatePath('/sepatu')
}

// Update can be added later or now. I'll add a simple one.
export async function updateShoe(id: string, formData: FormData) {
  await verifyAdmin()
  const team = formData.get('team') as string
  const league = formData.get('league') as string || '-'
  const season = formData.get('season') as string || '-'
  const type = formData.get('type') as string || 'Football Boot'
  const price = parseFloat(formData.get('price') as string)
  const sizes = formData.get('sizes') as string
  const stock = parseInt(formData.get('stock') as string)
  const stockData = formData.get('stockData') as string
  const description = formData.get('description') as string || null
  const category = 'Sepatu'

  const imageFiles = formData.getAll('images') as File[]
  let mainImage: string | null = null

  if (imageFiles && imageFiles.length > 0) {
    const { supabase } = await import('@/lib/supabase')
    const file = imageFiles[0]
    if (file.size > 0) {
        const filename = `shoes-${Date.now()}-${file.name.replace(/\s/g, '-')}`
        const { error } = await supabase.storage.from('products').upload(filename, file, { upsert: false })
        if (!error) {
            const { data } = supabase.storage.from('products').getPublicUrl(filename)
            mainImage = data.publicUrl
        }
    }
  }

  const updateData: Partial<typeof shoes.$inferInsert> = {
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
  }

  if (mainImage) {
      updateData.image = mainImage
  }

  await db.update(shoes)
      .set(updateData)
      .where(eq(shoes.id, id))

  revalidatePath('/admin/shoes')
  revalidatePath('/sepatu')
  revalidatePath(`/product/${id}`)
  redirect('/admin/shoes')
}
