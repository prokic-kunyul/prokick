'use client'

import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import * as motion from "framer-motion/client"
import { X, ShoppingCart, Minus, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/features/cart/store'
import { SizeGuide } from '@/features/products/components/SizeGuide'
import toast from 'react-hot-toast'

interface ProductData {
  id: string
  team: string
  type: string
  league: string
  season: string
  price: number
  image: string | null
  sizes: string
  stockData: string | Record<string, number>
  category?: string
  description?: string
}

interface QuickViewModalProps {
  product: ProductData | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const stockData = useMemo(() => {
    if (!product) return {}
    return typeof product.stockData === 'string' 
      ? JSON.parse(product.stockData) 
      : product.stockData
  }, [product])

  const availableSizes = product?.sizes.split(',').filter(s => s.trim()) || []
  
  const getStockForSize = useCallback((size: string) => {
    return Number(stockData[size] || 0)
  }, [stockData])

  const handleAddToCart = () => {
    if (!product) return
    if (!selectedSize) {
      toast.error('Pilih ukuran terlebih dahulu')
      return
    }

    const stock = getStockForSize(selectedSize)
    if (stock < quantity) {
      toast.error(`Stok tidak cukup. Tersedia: ${stock}`)
      return
    }

    addItem({
      id: product.id,
      team: product.team,
      type: product.type,
      size: selectedSize,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity
    })

    toast.success(`${product.team} ditambahkan ke keranjang!`)
    onClose()
    setSelectedSize('')
    setQuantity(1)
  }

  if (!isOpen || !product) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0f1a] border border-blue-500/20 rounded-2xl shadow-2xl shadow-black/50"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-black/50">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.team}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#111]">
                <span className="text-gray-600 text-lg">No Image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <p className="text-sm text-cyan-400 font-medium mb-1">{product.league}</p>
              <h2 className="text-2xl font-black text-white">
                {product.team} <span className="text-cyan-400">{product.type}</span>
              </h2>
              {product.season && product.season !== '-' && (
                <p className="text-sm text-gray-500">{product.season}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">
                {formatCurrency(product.price)}
              </span>
              <span className="text-base text-gray-500 line-through">
                {formatCurrency(product.price * 1.25)}
              </span>
            </div>

            {/* Size Guide */}
            <SizeGuide category={product.category} />

            {/* Size Selection */}
            <div>
              <p className="text-sm text-gray-400 mb-2 font-medium">Pilih Ukuran:</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const stock = getStockForSize(size)
                  const isOutOfStock = stock === 0
                  const isSelected = selectedSize === size

                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`
                        px-4 py-2 text-sm font-bold border transition-all
                        ${isSelected 
                          ? 'bg-cyan-400 text-black border-cyan-400' 
                          : isOutOfStock
                            ? 'bg-gray-800/50 text-gray-600 border-gray-700 cursor-not-allowed line-through'
                            : 'bg-transparent text-white border-white/20 hover:border-cyan-400/50'
                        }
                      `}
                    >
                      {size}
                      {!isOutOfStock && stock < 5 && (
                        <span className="ml-1 text-[10px] text-orange-400">({stock})</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm text-gray-400 mb-2 font-medium">Jumlah:</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow"
            >
              <ShoppingCart className="w-5 h-5" />
              TAMBAH KE KERANJANG
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
