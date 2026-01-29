
import 'dotenv/config'
import { supabase } from '@/lib/supabase'

async function testUpload() {
  console.log('Testing upload to "products" bucket...')
  
  const filename = `test-upload-${Date.now()}.txt`
  const fileBody = 'This is a test file to verify storage permissions.'
  
  const { data, error } = await supabase.storage
    .from('products')
    .upload(filename, fileBody, {
       upsert: false,
       contentType: 'text/plain'
    })

  if (error) {
    console.error('❌ Upload Failed!')
    console.error('Error:', error)
  } else {
    console.log('✅ Upload Success!')
    console.log('Path:', data.path)
    
    // Cleanup
    await supabase.storage.from('products').remove([filename])
    console.log('Cleaned up test file.')
  }
}

testUpload()
