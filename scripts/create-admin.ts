
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import bcrypt from 'bcryptjs'

async function createAdmin() {
  console.log('Seeding Admin User...')
  
  const email = 'admin@prestige.com'
  const password = 'admin123'
  const hashedPassword = await bcrypt.hash(password, 10)
  
  try {
    const [newUser] = await db.insert(users).values({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: 'ADMIN'
    }).returning()
    
    console.log(`✅ Admin Created!`)
    console.log(`Email: ${newUser.email}`)
    console.log(`Password: ${password}`)
  } catch (error) {
    console.error('❌ Failed to create admin:', error)
  }
  process.exit(0)
}

createAdmin()
