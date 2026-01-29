'use client'

import { updateSettings } from '@/app/actions/settings'
import { useTransition } from 'react'
import { toast } from 'react-hot-toast'

interface SettingsFormProps {
  initialSettings: {
    bankName: string
    bankAccount: string
    bankHolder: string
    whatsapp: string
  }
}

import { useRouter } from 'next/navigation'

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateSettings(formData)
      if (result.success) {
        toast.success('Settings updated successfully!')
        router.refresh() // Force UI update
      } else {
        toast.error('Failed to update settings')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Bank Information */}
      <section>
         <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
           Payment Information
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">Bank Name</label>
              <input name="bankName" defaultValue={initialSettings.bankName} placeholder="e.g. BCA" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">Account Number</label>
              <input name="bankAccount" defaultValue={initialSettings.bankAccount} placeholder="e.g. 1234567890" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-300">Account Holder Name</label>
              <input name="bankHolder" defaultValue={initialSettings.bankHolder} placeholder="e.g. PT JERSEY STORE" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
         </div>
      </section>

      {/* Contact Information */}
      <section>
         <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
           Contact Details
         </h2>
         <div className="bg-white/5 p-6 rounded-2xl">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">WhatsApp Number</label>
              <input name="whatsapp" defaultValue={initialSettings.whatsapp} placeholder="e.g. 628123456789" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              <p className="text-xs text-gray-500">Use international format without &apos;+&apos; (e.g. 62...)</p>
            </div>
         </div>
      </section>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]"
      >
        {isPending ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}
