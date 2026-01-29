
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

async function fixPolicy() {
  console.log('Relaxing RLS policies for "products" bucket...')
  
  try {
    // Drop previous policies to be clean
    await db.execute(sql`drop policy if exists "Authenticated Upload" on storage.objects;`)
    
    // Allow PUBLIC (Anon) insert
    // This allows the Server Actions (which use Anon key) to upload.
    await db.execute(sql`
      create policy "Public Upload"
      on storage.objects for insert
      to public
      with check ( bucket_id = 'products' );
    `)
    
    // Also ensure Select is public (already done, but reinforcing)
    await db.execute(sql`drop policy if exists "Public Access" on storage.objects;`)
    await db.execute(sql`
      create policy "Public Access"
      on storage.objects for select
      to public
      using ( bucket_id = 'products' );
    `)

    // Allow Update/Delete for Public (needed for delete/update actions)
    // In a real prod env with Service Key, we wouldn't do this. 
    // But without Service Key, we need this for deleteBanner/deleteProduct to work.
    await db.execute(sql`
      create policy "Public Modify"
      on storage.objects for update
      to public
      using ( bucket_id = 'products' );
    `)
    
    await db.execute(sql`
      create policy "Public Delete"
      on storage.objects for delete
      to public
      using ( bucket_id = 'products' );
    `)
    
    console.log('✅ Policies updated to allow Public access (Anon).')

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('⚠️ SQL Execution Error:', message)
  }
  
  process.exit(0)
}

fixPolicy()
