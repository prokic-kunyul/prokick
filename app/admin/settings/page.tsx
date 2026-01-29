import { db } from '@/lib/db'
import { settings } from '@/db/schema'
import { SettingsForm } from './SettingsForm'

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const allSettings = await db.select().from(settings)
  const settingsMap = allSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)

  const initialSettings = {
    bankName: settingsMap.bankName || '',
    bankAccount: settingsMap.bankAccount || '',
    bankHolder: settingsMap.bankHolder || '',
    whatsapp: settingsMap.whatsapp || ''
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass p-8 rounded-3xl">
        <header className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black text-white">Store Settings</h1>
          <p className="text-gray-400">Configure checkout and contact details.</p>
        </header>

        <SettingsForm initialSettings={initialSettings} />
      </div>
    </div>
  )
}
