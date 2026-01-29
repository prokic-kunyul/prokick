'use server'

import { db } from '@/lib/db'
import { settings } from '@/db/schema'
import { revalidatePath } from 'next/cache'


export async function updateSettings(formData: FormData) {
  try {
    const bankName = formData.get('bankName') as string
    const bankAccount = formData.get('bankAccount') as string
    const bankHolder = formData.get('bankHolder') as string
    let whatsapp = formData.get('whatsapp') as string

    // Sanitize WhatsApp number (remove non-digits)
    if (whatsapp) {
      whatsapp = whatsapp.replace(/\D/g, '')
      // Replace leading 0 with 62 if applicable
      if (whatsapp.startsWith('0')) {
        whatsapp = '62' + whatsapp.slice(1)
      }
    }

    // Helper for upsert
    const upsertSetting = async (key: string, value: string) => {
        await db.insert(settings).values({ key, value })
            .onConflictDoUpdate({ target: settings.key, set: { value } })
    }

    await upsertSetting('bankName', bankName)
    await upsertSetting('bankAccount', bankAccount)
    await upsertSetting('bankHolder', bankHolder)
    await upsertSetting('whatsapp', whatsapp)

    revalidatePath('/admin/settings')
    revalidatePath('/cart')
    
    return { success: true }
  } catch (error) {
    console.error('Settings Update Error:', error)
    return { success: false, error: 'Failed to update settings' }
  }
}
