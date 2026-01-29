import { db } from '@/lib/db'
import { settings } from '@/db/schema'

export async function getSettings() {
  try {
    const allSettings = await db.select().from(settings)
    
    // Convert array of { key, value } to object
    const settingsMap: Record<string, string> = {}
    allSettings.forEach((s) => {
      settingsMap[s.key] = s.value
    })

    return settingsMap
  } catch (error) {
    console.error('Error fetching settings:', error)
    return {}
  }
}
