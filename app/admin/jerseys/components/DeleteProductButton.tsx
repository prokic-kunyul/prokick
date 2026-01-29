'use client'

import { deleteJersey } from '@/app/actions/jersey'
import { useState } from 'react'

export function DeleteProductButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(true)
      await deleteJersey(id)
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
    >
      {isDeleting ? '...' : 'Delete'}
    </button>
  )
}
