'use client'

import { formatCurrency } from '@/lib/utils'
import { Tag01 } from '@untitledui/icons'
import { Separator } from '@/components/ui/separator'

interface OrderSummaryProps {
  totalQty: number
  subtotal: number
  customization: number
  shipping: number
  shippingIncluded: boolean
  total: number
  freeShipping: boolean
  activePromos: string[]
  bonusJersey: number
  paymentMethod: 'whatsapp' | 'transfer'
}

export function OrderSummary({
  totalQty,
  subtotal,
  customization,
  shipping,
  shippingIncluded,
  total,
  freeShipping,
  activePromos,
  bonusJersey,
  paymentMethod,
}: OrderSummaryProps) {
  return (
    <div className="space-y-4 pt-4 text-sm font-medium">
      <div className="flex justify-between text-blue-200/60">
        <span>Subtotal <span className="text-xs text-blue-200/40">({totalQty} items)</span></span>
        <span className="text-white">{formatCurrency(subtotal)}</span>
      </div>
      
      {customization > 0 && (
        <div className="flex justify-between text-blue-200/60">
          <span>Kustomisasi</span>
          <span className="text-white">{formatCurrency(customization)}</span>
        </div>
      )}
      
      <div className="flex justify-between text-blue-200/60 items-baseline">
        <span>Ongkir</span>
        <span className={freeShipping ? 'text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'text-white'}>
          {freeShipping ? (
            'GRATIS'
          ) : (
            formatCurrency(shipping)
          )}
        </span>
      </div>

      {/* Active Promos */}
      {activePromos.length > 0 && (
        <div className="py-2 space-y-1.5">
          {activePromos.map(promo => (
            <p key={promo} className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
              <Tag01 className="w-3.5 h-3.5" />
              {promo} Digunakan
            </p>
          ))}
        </div>
      )}

      {/* Bonus Jersey */}
      {bonusJersey > 0 && (
        <div className="py-2">
           <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
              🎉 +{bonusJersey} Bonus Jersey Termasuk
           </p>
        </div>
      )}

      <Separator className="bg-blue-500/20 my-4" />

      <div className="flex justify-between items-end">
        <span className="text-blue-200/60 pb-1 font-bold uppercase tracking-wider text-xs">Total</span>
        <div className="text-right">
          <p className="text-3xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{formatCurrency(total)}</p>
          {!shippingIncluded && paymentMethod === 'whatsapp' && (
             <p className="text-[10px] text-blue-200/40 uppercase tracking-widest mt-1">Belum termasuk ongkir</p>
          )}
        </div>
      </div>
    </div>
  )
}
