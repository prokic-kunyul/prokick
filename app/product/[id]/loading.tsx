export default function ProductLoading() {
  return (
    <div className="pt-24 pb-16 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-white/5 animate-pulse rounded-none" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-white/5 animate-pulse" />
              ))}
            </div>
          </div>
          
          {/* Info Skeleton */}
          <div className="space-y-6">
            <div className="h-4 w-24 bg-white/5 animate-pulse" />
            <div className="h-10 w-3/4 bg-white/5 animate-pulse" />
            <div className="h-6 w-32 bg-white/5 animate-pulse" />
            <div className="h-20 w-full bg-white/5 animate-pulse" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-12 h-12 bg-white/5 animate-pulse" />
              ))}
            </div>
            <div className="h-14 w-full bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
