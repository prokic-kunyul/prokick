'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PATCH_TYPES_CLUB, PATCH_TYPES_NATIONAL } from '@/lib/promo'
import { useCartStore } from '@/features/cart/store'
import type { CartItem } from '@/features/cart/store'
import toast from 'react-hot-toast'

interface BatchCustomizeModalProps {
  item: CartItem
  isOpen: boolean
  onClose: () => void
}

interface CustomRow {
  index: number
  customName: string
  customNumber: string
  customPatch: string
  selected: boolean
}

export function BatchCustomizeModal({ item, isOpen, onClose }: BatchCustomizeModalProps) {
  const [rows, setRows] = useState<CustomRow[]>(() => 
    Array.from({ length: item.quantity }).map((_, i) => ({
      index: i,
      customName: '',
      customNumber: '',
      customPatch: 'unselected',
      selected: true // Default: Customize this item
    }))
  )

  const addItems = useCartStore((state) => state.addItems)
  const removeItem = useCartStore((state) => state.removeItem)

  const handleUpdateRow = (index: number, field: keyof CustomRow, value: string | boolean) => {
    setRows(prev => prev.map(row => row.index === index ? { ...row, [field]: value } : row))
  }

  const handleSave = () => {
    // 1. Validate
    const itemsToCustomize = rows.filter(r => r.selected)
    const itemsToKeepPlain = rows.filter(r => !r.selected)

    if (itemsToCustomize.length === 0 && itemsToKeepPlain.length === item.quantity) {
       // All unselected? Just close. No changes needed if original item was plain.
       if (!item.customName && !item.customNumber && !item.customPatch) {
          onClose()
          return
       }
    }

    // 2. Prepare new items
    const newItems = itemsToCustomize.map(row => ({
      ...item,
      quantity: 1, // Split into individuals
      customName: row.customName || undefined,
      customNumber: row.customNumber || undefined,
      customPatch: (row.customPatch && row.customPatch !== 'unselected') ? row.customPatch : undefined
    }))

    // 3. Prepare plain items (if any remain)
    if (itemsToKeepPlain.length > 0) {
      newItems.push({
        ...item,
        quantity: itemsToKeepPlain.length,
        customName: undefined,
        customNumber: undefined,
        customPatch: undefined
      })
    }

    // 4. Update Store: Remove old batch item, add new items
    removeItem(item.id, item.size, item.customName, item.customNumber, item.customPatch)
    addItems(newItems)

    toast.success('Kustomisasi berhasil disimpan!')
    onClose()
  }

  if (!isOpen) return null

  const isNational = item.category === 'national' || item.type?.toLowerCase().includes('timnas')

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-2xl bg-[#0a0f1a] border border-cyan-500/20 rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-white">Kustomisasi Batch</h2>
            <p className="text-sm text-gray-400">
              Isi detail untuk <span className="text-cyan-400 font-bold">{item.quantity} item</span> {item.team} ({item.size})
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 mb-6 custom-scrollbar">
          {rows.map((row) => (
            <div 
              key={row.index}
              className={`p-4 rounded-xl border transition-colors ${row.selected ? 'bg-white/5 border-cyan-500/30' : 'bg-black/20 border-white/5 opacity-60'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                 <div 
                   onClick={() => handleUpdateRow(row.index, 'selected', !row.selected)}
                   className={`w-6 h-6 rounded border flex items-center justify-center cursor-pointer transition-colors ${row.selected ? 'bg-cyan-500 border-cyan-500' : 'border-white/20 hover:border-white/50'}`}
                 >
                   {row.selected && <Check className="w-4 h-4 text-black font-bold" />}
                 </div>
                 <span className="text-sm font-bold text-white">Item #{row.index + 1}</span>
                 {!row.selected && <span className="text-xs text-gray-500 italic">(Tanpa Kustomisasi)</span>}
              </div>

              {row.selected && (
                <div className="grid sm:grid-cols-[1.5fr_0.8fr_1fr] gap-3">
                   <input 
                       type="text" 
                       placeholder="Nama"
                       value={row.customName}
                       onChange={(e) => handleUpdateRow(row.index, 'customName', e.target.value.toUpperCase())}
                       className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none uppercase font-bold"
                   />
                   <input 
                       type="text" 
                       placeholder="Nomor"
                       value={row.customNumber}
                       onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '')
                          if (val.length <= 2) handleUpdateRow(row.index, 'customNumber', val)
                       }}
                       className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none text-center font-bold"
                   />
                   <Select 
                     value={row.customPatch}
                     onValueChange={(val) => handleUpdateRow(row.index, 'customPatch', val)}
                   >
                     <SelectTrigger className="w-full bg-black/40 border-white/10 text-white text-sm h-10">
                       <SelectValue placeholder="Patch" />
                     </SelectTrigger>
                     <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                       <SelectItem value="unselected">-- No Patch --</SelectItem>
                       {(isNational ? PATCH_TYPES_NATIONAL : PATCH_TYPES_CLUB).map(p => (
                         <SelectItem key={p.id} value={p.label}>{p.label}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
           <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
             Batal
           </Button>
           <Button onClick={handleSave} className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold px-8">
             <Save className="w-4 h-4 mr-2" />
             Simpan Perubahan
           </Button>
        </div>

      </motion.div>
    </>
  )
}
