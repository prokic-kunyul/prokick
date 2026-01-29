'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { QuickViewModal } from '@/components/QuickViewModal'

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

interface QuickViewContextType {
  openQuickView: (product: ProductData) => void
  closeQuickView: () => void
}

const QuickViewContext = createContext<QuickViewContextType | null>(null)

export function useQuickView() {
  const context = useContext(QuickViewContext)
  if (!context) {
    throw new Error('useQuickView must be used within QuickViewProvider')
  }
  return context
}

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<ProductData | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openQuickView = (productData: ProductData) => {
    setProduct(productData)
    setIsOpen(true)
  }

  const closeQuickView = () => {
    setIsOpen(false)
    setTimeout(() => setProduct(null), 300) // Clear after animation
  }

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView }}>
      {children}
      <QuickViewModal 
        product={product} 
        isOpen={isOpen} 
        onClose={closeQuickView} 
      />
    </QuickViewContext.Provider>
  )
}
