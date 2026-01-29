
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

async function checkAdmin() {
  console.log('Checking for Admin user...')
  
  try {
    const admins = await db.select().from(users).where(eq(users.role, 'ADMIN'))
    
    if (admins.length > 0) {
      console.log(`✅ Admin user found: ${admins[0].email}`)
    } else {
      console.log('❌ No Admin user found!')
    }
  } catch (error) {
    console.error('Error checking admin:', error)
  }
  process.exit(0)
}

checkAdmin()
