
import { db } from '@/lib/db'
import { banners } from '@/db/schema'

async function main() {
  console.log('Adding World Cup Banner...')
  
  try {
    const newBanner = await db.insert(banners).values({
      title: 'Piala Dunia 2026',
      link: '/piala-dunia',
      image: '/banners/piala-dunia.png',
      active: true,
      order: -1 // Prioritize at top
    }).returning()
    
    console.log('✅ Banner Added Successfully!')
    console.log(newBanner)
  } catch (err) {
    console.error('❌ Failed to add banner:', err)
  }
  process.exit(0)
}

main()
