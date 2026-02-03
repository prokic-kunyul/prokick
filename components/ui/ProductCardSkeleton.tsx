export function ProductCardSkeleton() {
  return (
    <div className="bg-[#0a1628]/50 rounded-2xl overflow-hidden border border-blue-500/10 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-blue-900/20" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-blue-900/30 rounded-lg w-3/4" />
        
        {/* Subtitle */}
        <div className="h-4 bg-blue-900/20 rounded-lg w-1/2" />

        {/* Price */}
        <div className="h-6 bg-cyan-500/20 rounded-lg w-2/3 mt-4" />

        {/* Button */}
        <div className="h-10 bg-blue-900/30 rounded-lg w-full mt-4" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
