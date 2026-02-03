'use client'

import { useCartStore } from '@/features/cart/store'
import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, ShoppingBag } from 'lucide-react' 
import { motion } from "framer-motion"

interface AddToCartButtonProps {
  id: string
  team: string
  type: string
  price: number
  image: string
  availableSizes: string[]
  stockData: Record<string, number>
  category?: string
}

export function AddToCartButton({ id, team, type, price, image, availableSizes, stockData, category }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState(() => {
    const firstAvailable = availableSizes.find(s => (stockData[s.trim()] || 0) > 0)
    return (firstAvailable || availableSizes[0])?.trim()
  })

  const [quantity, setQuantity] = useState(1)
  
  const addItem = useCartStore((state) => state.addItem)

  const currentStock = stockData[selectedSize] || 0
  const isOutOfStock = currentStock === 0
  const maxQuantity = currentStock > 0 ? currentStock : 1

  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(1, Math.min(newQty, maxQuantity))
    setQuantity(validQty)
  }

  const handleSizeChange = (s: string) => {
     setSelectedSize(s)
     setQuantity(1)
  }

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('Maaf, stok habis untuk ukuran ini!')
      return
    }
    
    if (quantity > currentStock) {
       toast.error(`Hanya tersisa ${currentStock} item!`)
       return
    }

    addItem({
      id,
      team,
      type,
      size: selectedSize,
      price,
      image,
      category,
      quantity: quantity
    })

    // Reset
    setQuantity(1)
    
    toast.success(`Ditambahkan ke keranjang: ${team} (${selectedSize}) x${quantity}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
         <div className="flex flex-wrap items-center p-1 bg-white/5 rounded-[2rem] border border-white/10 relative">
           <span className="text-sm font-medium text-gray-400 px-4 ml-2 py-2">Pilih Ukuran</span>
           {availableSizes.map(size => {
             const s = size.trim()
             const stock = stockData[s] || 0
             const isSoldOut = stock === 0
             const isSelected = selectedSize === s
             
             return (
               <button
                 key={s}
                 onClick={() => {
                   if (!isSoldOut) {
                    handleSizeChange(s)
                   }
                 }}
                 disabled={isSoldOut}
                 className={`relative px-4 sm:px-6 py-3 text-sm font-bold rounded-full transition-all duration-300 z-10 ${
                   isSelected ? 'text-black' : isSoldOut ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white'
                 }`}
               >
                 {s}
                 {isSelected && (
                   <motion.div
                     layoutId="active-size"
                     className="absolute inset-0 bg-white rounded-full -z-10"
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   />
                 )}
                 {isSoldOut && (
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-full h-px bg-white/10 -rotate-45"></div>
                   </div>
                 )}
               </button>
             )
           })}
         </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
           <span className="text-sm font-medium text-gray-400">Jumlah Item</span>
           <div className="flex items-center gap-3 sm:gap-4 bg-[#111] border border-white/10 p-1.5 sm:p-2 w-full sm:w-fit justify-between sm:justify-start rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)} 
              className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:bg-white/10 hover:text-white"
              disabled={isOutOfStock || quantity <= 1}
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <span className="w-8 text-center text-white font-bold text-sm sm:text-base">{isOutOfStock ? 0 : quantity}</span>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)} 
              className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:bg-white/10 hover:text-white"
              disabled={isOutOfStock || quantity >= maxQuantity}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {currentStock > 0 && currentStock < 5 && (
         <Badge variant="destructive" className="animate-pulse">
           Segera habis! Tersisa {currentStock} item.
         </Badge>
      )}

      <Button 
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full py-6 sm:py-7 h-auto font-black text-base sm:text-lg transition-transform active:scale-95 disabled:scale-100 disabled:opacity-50 whitespace-normal ${isOutOfStock ? 'bg-muted text-muted-foreground' : 'bg-white text-black hover:bg-gray-200'}`}
      >
        {isOutOfStock ? 'STOK HABIS' : (
          <span className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 leading-tight">
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> 
              Tambah ke Keranjang
            </span>
            <span className="hidden sm:inline">-</span>
            <span>{formatCurrency(price * quantity)}</span>
          </span>
        )}
      </Button>
    </div>
  )
}
