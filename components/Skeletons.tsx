'use client'

interface ProductSkeletonProps {
  count?: number
}

export function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-[4/5] bg-blue-900/10 border border-blue-500/10 mb-4" />
          
          {/* Text Skeletons */}
          <div className="space-y-2">
            <div className="h-4 bg-blue-900/10 rounded w-3/4" />
            <div className="h-3 bg-blue-900/10 rounded w-1/2" />
            <div className="h-5 bg-blue-900/10 rounded w-1/3 mt-3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-[#111] border border-white/10 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-6 bg-white/10 rounded w-24" />
              <div className="h-4 bg-white/10 rounded w-32" />
            </div>
            <div className="h-8 bg-white/10 rounded w-28" />
          </div>
          <div className="h-20 bg-white/5 rounded" />
        </div>
      ))}
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="animate-pulse flex gap-4 p-4 bg-blue-900/5 border border-blue-500/10 rounded-xl">
      <div className="w-24 h-24 bg-blue-900/10 rounded" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-blue-900/10 rounded w-3/4" />
        <div className="h-4 bg-blue-900/10 rounded w-1/2" />
        <div className="h-4 bg-blue-900/10 rounded w-1/4" />
      </div>
    </div>
  )
}
