
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-20 max-w-[1440px] mx-auto px-6">
      <div className="flex items-center justify-between mb-8 pt-6 py-4 border-b border-white/5">
         <Skeleton className="h-10 w-64 bg-slate-800" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:block w-64 space-y-8">
           <Skeleton className="h-screen w-full bg-slate-800 rounded-xl" />
        </div>

        <div className="flex-1">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-5 p-4 border border-white/10 rounded-xl bg-slate-900/50">
                  <Skeleton className="h-48 w-full rounded-lg bg-slate-800" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/5 rounded-lg bg-slate-800" />
                    <Skeleton className="h-4 w-4/5 rounded-lg bg-slate-800" />
                    <Skeleton className="h-4 w-2/5 rounded-lg bg-slate-800" />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
