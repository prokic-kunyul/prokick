'use client'

import { Header } from '@/components/layout/Header'
import { useState } from 'react'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder logic - in real app would call server action
    setStatus(`Searching for order #${orderId}... (Demo: Not Found)`)
  }

  return (
    <div className="min-h-screen bg-[#050A1F] text-white">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-3xl font-black text-white">Lacak Pesanan</h1>
          <p className="text-gray-400">Masukkan Nomor Pesanan Anda untuk melihat status pengiriman.</p>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <input 
              type="text" 
              placeholder="Contoh: ORD-12345"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-center uppercase tracking-widest"
            />
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
            >
              Lacak Sekarang
            </button>
          </form>

          {status && (
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 mt-8">
              <p className="text-sm font-medium text-gray-300">{status}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
