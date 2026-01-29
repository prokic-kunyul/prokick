'use client'

interface PaymentMethodSelectorProps {
  method: 'whatsapp' | 'transfer'
  onMethodChange: (method: 'whatsapp' | 'transfer') => void
  bankName?: string
  bankAccount?: string
  bankHolder?: string
}

export function PaymentMethodSelector({
  method,
  onMethodChange,
  bankName,
  bankAccount,
  bankHolder,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all group ${method === 'whatsapp' ? 'bg-blue-900/20 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-transparent border-blue-500/20 hover:border-cyan-400/30 hover:bg-blue-900/10'}`}>
        <input type="radio" name="payment" className="hidden" checked={method === 'whatsapp'} onChange={() => onMethodChange('whatsapp')} />
        <div className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all ${method === 'whatsapp' ? 'bg-cyan-400 border-cyan-400 text-black' : 'bg-blue-900/10 border-blue-500/20 text-blue-500/50 group-hover:border-cyan-400/50'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413-.248-.694.024-1.289.173-1.413.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </div>
        <div>
          <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">Order via WhatsApp</div>
          <div className="text-xs text-blue-200/50">Cepat & mudah</div>
        </div>
      </label>

      <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all group ${method === 'transfer' ? 'bg-blue-900/20 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-transparent border-blue-500/20 hover:border-cyan-400/30 hover:bg-blue-900/10'}`}>
        <input type="radio" name="payment" className="hidden" checked={method === 'transfer'} onChange={() => onMethodChange('transfer')} />
        <div className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all ${method === 'transfer' ? 'bg-cyan-400 border-cyan-400 text-black' : 'bg-blue-900/10 border-blue-500/20 text-blue-500/50 group-hover:border-cyan-400/50'}`}>
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
        </div>
        <div>
          <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">Transfer Bank</div>
          <div className="text-xs text-blue-200/50">Konfirmasi manual</div>
        </div>
      </label>

      {/* Bank Details */}
      {method === 'transfer' && bankAccount && (
        <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-xl animate-in slide-in-from-top-2">
          <p className="text-xs text-blue-300 font-bold uppercase mb-2 tracking-wider">Transfer ke:</p>
          <p className="text-white font-black text-lg">{bankName}</p>
          <p className="text-2xl font-mono text-cyan-400 tracking-widest my-2 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">{bankAccount}</p>
          <p className="text-sm text-blue-200/60 font-medium">a.n {bankHolder}</p>
        </div>
      )}
    </div>
  )
}
