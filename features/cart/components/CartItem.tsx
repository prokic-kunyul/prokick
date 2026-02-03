'use client'

import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { CartItem as CartItemType } from '../store'
import { Trash03 } from '@untitledui/icons'
import { Button } from '@/components/ui/button'
import { Edit3 } from 'lucide-react'
import { useState } from 'react'
import { BatchCustomizeModal } from './BatchCustomizeModal'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { SIZE_PRESETS } from '@/lib/config'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: string, size: string, qty: number, customName?: string, customNumber?: string, customPatch?: string) => void
  onUpdateSize: (id: string, oldSize: string, newSize: string, customName?: string, customNumber?: string, customPatch?: string) => void
  onRemove: (id: string, size: string, customName?: string, customNumber?: string, customPatch?: string) => void
}

export function CartItem({ item, onUpdateQuantity, onUpdateSize, onRemove }: CartItemProps) {
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false)

  // Determine size options based on category
  const category = item.category || 'Jersey'
  const presetKey = (category === 'Sepatu' || category === 'Sepatu Futsal') ? 'Sepatu' : 'Jersey'
  const sizeOptions = SIZE_PRESETS[presetKey]?.map(p => p.size) || ['S', 'M', 'L', 'XL', 'XXL']

  // If item size is not in preset (e.g. One Size), add it
  if (!sizeOptions.includes(item.size)) {
    sizeOptions.push(item.size)
  }

  // Only show Customize button for Jerseys (assuming shoes don't need name/number)
  const canCustomize = category === 'Jersey' || !category

  return (
    <>
      <div className="bg-[#050A1F]/50 border border-blue-500/20 p-4 rounded-xl flex items-center gap-4 hover:border-cyan-400/30 transition-colors group">
        <div className="w-20 h-20 bg-blue-900/20 border border-blue-500/10 flex items-center justify-center overflow-hidden relative rounded-lg">
          {item.image ? (
            <Image src={item.image} alt={item.team} fill className="object-cover" sizes="80px" />
          ) : (
            <span className="text-xs text-blue-500/50">No Img</span>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-bold tracking-tight">{item.team}</h3>
          <p className="text-sm text-blue-200/60 font-medium">{item.type}</p>
          
          {/* Customization Display */}
          {(item.customName || item.customNumber || item.customPatch) && (
             <div className="text-xs text-yellow-500 font-mono mt-1 border-l-2 border-yellow-500 pl-2">
                {item.customName && <div>Name: {item.customName}</div>}
                {item.customNumber && <div>No: {item.customNumber}</div>}
                {item.customPatch && <div>Patch: {item.customPatch}</div>}
             </div>
          )}
          
          <div className="mt-2" />

          {/* Size Editor */}
          <div className="flex items-center gap-2 mb-2">
             <span className="text-xs text-blue-300/50 font-bold uppercase tracking-wider">Size:</span>
             <Select 
               value={item.size} 
               onValueChange={(newSize) => onUpdateSize(item.id, item.size, newSize, item.customName, item.customNumber, item.customPatch)}
             >
              <SelectTrigger className="w-[70px] h-8 bg-blue-900/20 border-blue-500/20 text-white text-xs focus:ring-cyan-500/50 focus:border-cyan-500/50">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent className="bg-[#050A1F] border-blue-500/20 text-white min-w-[70px]">
                {sizeOptions.map(size => (
                  <SelectItem key={size} value={size} className="text-xs cursor-pointer focus:bg-blue-900/30 focus:text-cyan-400">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
             </Select>
          </div>

          <p className="text-cyan-400 font-bold mt-1 text-lg drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">{formatCurrency(item.price)}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {canCustomize && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCustomizeModalOpen(true)}
              className="h-7 text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              {item.customName ? 'Edit Custom' : 'Kustomisasi'}
            </Button>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-blue-900/20 border border-blue-500/20 p-1 rounded-lg">
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => onUpdateQuantity(item.id, item.size, Math.max(1, item.quantity - 1), item.customName, item.customNumber, item.customPatch)} 
                className="h-8 w-8 rounded-md text-white hover:bg-cyan-500/20 hover:text-cyan-400"
              >
                -
              </Button>
              <span className="text-white text-sm w-6 text-center font-bold">{item.quantity}</span>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1, item.customName, item.customNumber, item.customPatch)} 
                className="h-8 w-8 rounded-md text-white hover:bg-cyan-500/20 hover:text-cyan-400"
              >
                +
              </Button>
            </div>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id, item.size, item.customName, item.customNumber, item.customPatch)} 
              className="text-blue-500/50 hover:text-red-400 hover:bg-red-500/10 rounded-full"
            >
              <Trash03 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <BatchCustomizeModal 
        item={item} 
        isOpen={isCustomizeModalOpen} 
        onClose={() => setIsCustomizeModalOpen(false)} 
      />
    </>
  )
}
