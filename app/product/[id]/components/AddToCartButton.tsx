'use client'

import { useCartStore } from '@/features/cart/store'
import { useState } from 'react'

interface Props {
  jersey: {
    id: string
    team: string
    type: string
    size: string
    price: number
    image: string | null
    quantity: number
  }
}

export default function AddToCartButton({ jersey }: Props) {
  const addItem = useCartStore((state) => state.addItem)
  const [isAdded, setIsAdded] = useState(false)
  
  // Hydration fix for Persist middleware if needed, but we used skipHydration: true
  // so we need to ensure we are on client to read valid state, actually skipHydration 
  // means we might see mismatch if we render state immediately.
  // For the button action, it's fine.
  
  const handleAddToCart = () => {
    addItem(jersey)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <button 
      onClick={handleAddToCart}
      disabled={isAdded}
      className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
        isAdded 
          ? 'bg-green-600 text-white shadow-green-200' 
          : 'bg-gray-900 text-white hover:bg-black shadow-gray-200'
      }`}
    >
      {isAdded ? 'Added to Cart! ✓' : 'Add to Cart'}
    </button>
  )
}
