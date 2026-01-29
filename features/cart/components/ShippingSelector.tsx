'use client'

import { formatCurrency } from '@/lib/utils'
import { SHIPPING_ZONES, ShippingZoneId } from '@/lib/promo'

interface ShippingSelectorProps {
  zone: ShippingZoneId
  onZoneChange: (zone: ShippingZoneId) => void
  freeShipping: boolean
}

export function ShippingSelector({ zone, onZoneChange, freeShipping }: ShippingSelectorProps) {
  if (freeShipping) {
    return (
      <div className="bg-[#111] border border-green-500/20 p-3">
        <p className="text-green-500 font-bold text-center text-sm uppercase tracking-wider">🎉 Gratis Ongkir!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-300">📍 Wilayah Pengiriman</label>
      <select
        value={zone}
        onChange={(e) => onZoneChange(e.target.value as ShippingZoneId)}
        className="w-full px-4 py-3 bg-black border border-white/10 text-white focus:border-white focus:outline-none cursor-pointer appearance-none"
      >
        {SHIPPING_ZONES.map((z) => (
          <option key={z.id} value={z.id} className="bg-black text-white">
            {z.label} - {formatCurrency(z.price)}
          </option>
        ))}
      </select>
    </div>
  )
}
