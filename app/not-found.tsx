import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold font-[family-name:var(--font-russo-one)] tracking-wider">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-200">
            Page Not Found
          </h2>
          <p className="text-gray-400">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <Link 
          href="/"
          className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors uppercase tracking-wide text-sm"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
