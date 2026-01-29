
import { getSettings } from '../services/settings';
import { db } from '../lib/db';
import { settings } from '../db/schema';
import { eq } from 'drizzle-orm';

async function verifySettings() {
  console.log('🧪 Testing Settings Service Flow...');

  const TEST_KEY = 'verify_test_key';
  const TEST_VALUE = 'verify_test_value';

  try {
    // 1. SETUP: Upsert a test setting
    console.log('\n👉 Setup: Inserting test setting...');
    
    // Check if exists
    const existing = await db.select().from(settings).where(eq(settings.key, TEST_KEY));
    if (existing.length > 0) {
        await db.update(settings).set({ value: TEST_VALUE }).where(eq(settings.key, TEST_KEY));
    } else {
        await db.insert(settings).values({ key: TEST_KEY, value: TEST_VALUE });
    }
    console.log(`✅ Inserted: { ${TEST_KEY}: '${TEST_VALUE}' }`);

    // 2. ACTION: Call getSettings()
    console.log('\n👉 Action: Calling getSettings()...');
    const config = await getSettings();

    // 3. VERIFICATION: Check format and value
    console.log(`✅ Result: Retrieved object keys: [${Object.keys(config).join(', ')}]`);
    
    if (config[TEST_KEY] === TEST_VALUE) {
        console.log(`   - Value for '${TEST_KEY}': '${config[TEST_KEY]}'`);
        console.log('✅ Verification Passed: Settings correctly transformed to Key-Value object.');
    } else {
        console.error(`❌ Verification Failed: Expected '${TEST_VALUE}', got '${config[TEST_KEY]}'.`);
    }

  } catch (error) {
    console.error('❌ Error executing flow:', error);
  } finally {
    // CLEANUP
    console.log('\n🧹 Cleaning up...');
    await db.delete(settings).where(eq(settings.key, TEST_KEY));
    process.exit(0);
  }
}

verifySettings();
