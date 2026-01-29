'use client'

import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface CartItem {
  id: string
  team: string
  type: string
  size: string
  price: number
  image: string | null
  quantity: number
}

interface OrderData {
  id: string
  total: number
  customerName: string
  items: CartItem[]
  shippingZone: string
  shippingCost: number
}

interface TransferSuccessViewProps {
  orderData: OrderData
  bank: { name: string, number: string, holder: string }
  waPhone: string
  waText: string // Pre-generated text for simpler logic
}

export function TransferSuccessView({ orderData, bank, waPhone, waText }: TransferSuccessViewProps) {
  
  const handleConfirm = () => {
     window.open(`https://wa.me/${waPhone}?text=${waText}`, '_blank')
     toast.success('Membuka WhatsApp...')
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Disalin ke clipboard!')
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pt-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
      
      {/* Header */}
      <div className="bg-[#111] p-8 text-center border border-white/10 relative overflow-hidden">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-black font-bold">
           ✓
        </div>
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Order Berhasil!</h2>
        <p className="text-gray-400 text-sm">Kode Pesanan: <span className="font-mono text-white bg-white/10 px-2 py-1 select-all">{orderData.id}</span></p>
      </div>

      {/* Payment Details */}
      <div className="bg-[#111] p-8 border border-white/10 space-y-6">
        <div className="text-center space-y-2 mb-6">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Pembayaran</p>
            <p className="text-4xl font-black text-white">{formatCurrency(orderData.total)}</p>
        </div>

        <div className="space-y-3">
           <div className="p-5 bg-black border border-white/10 relative group hover:border-white/30 transition-colors">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Transfer ke Bank:</p>
              <div className="flex justify-between items-end">
                 <div>
                    <h3 className="text-xl font-bold text-white">{bank.name}</h3>
                    <p className="text-gray-400 text-sm">{bank.holder}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-2xl font-mono text-white font-bold tracking-wider">{bank.number}</p>
                 </div>
              </div>
              <button 
                onClick={() => handleCopy(bank.number)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                title="Copy Number"
              >
                📋
              </button>
           </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-blue-900/10 border border-blue-500/20">
           <span className="text-xl">💡</span>
           <p className="text-xs text-blue-200 leading-relaxed">
             Mohon transfer sesuai nominal. Setelah transfer, silakan konfirmasi dengan mengirimkan bukti via WhatsApp.
           </p>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={handleConfirm}
        className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold shadow-lg shadow-green-500/10 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-wider"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        Konfirmasi & Kirim Bukti
      </button>

      <div className="text-center">
         <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors uppercase tracking-widest font-bold">Kembali ke Beranda</Link>
      </div>
    </div>
  )
}
