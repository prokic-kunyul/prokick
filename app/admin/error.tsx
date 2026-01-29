'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md text-center p-8 bg-[#111] border border-white/10 rounded-xl">
        <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">❌</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Admin Error</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Failed to load this admin page. Please try again or go back to dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
          <Link 
            href="/admin/dashboard"
            className="px-5 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
