'use server'

import { db } from '@/lib/db'
import { testimonials } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'

export async function createTestimonial(formData: FormData) {
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const content = formData.get('content') as string
  const rating = parseInt(formData.get('rating') as string) || 5
  
  // Handle Proof Photo Upload
  const proofFile = formData.get('proofImage') as File | null
  let proofPath: string | null = null

  if (proofFile && proofFile.size > 0) {
    const { supabase } = await import('@/lib/supabase')
    const filename = `testimonial-${Date.now()}-${proofFile.name.replace(/\s/g, '-')}`
    
    const { error } = await supabase.storage
      .from('products')
      .upload(filename, proofFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (!error) {
       const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filename)
       proofPath = publicUrlData.publicUrl
    }
  }

  await db.insert(testimonials).values({
    name,
    role,
    content,
    rating,
    proofImage: proofPath
  })

  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  redirect('/admin/testimonials')
}

export async function deleteTestimonial(id: string) {
  await db.delete(testimonials).where(eq(testimonials.id, id))
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
}
