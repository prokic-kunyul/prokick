'use client'

import { deleteTestimonial } from '@/app/actions/testimonial'

export function DeleteTestimonialButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm('Delete this testimonial?')) {
      await deleteTestimonial(id)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      className="px-3 py-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-xs font-bold transition-colors"
    >
      Delete
    </button>
  )
}
