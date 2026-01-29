import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Admin User
  try {
    const adminEmail = 'admin@jersey-store.com';
    // Use select instead of query to avoid type inference issues if any
    const [existingUser] = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.insert(users).values({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (e) {
    console.log('Admin seed error:', e);
  }

  // Seed Jerseys (Optional: Add logic if needed, currently reliant on manual or previous seed logic)
  // For now we keep it simple as requested by previous logic context
    
  console.log('🏁 Seeding finished.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
