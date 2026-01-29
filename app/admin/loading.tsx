export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-medium">Loading admin...</p>
      </div>
    </div>
  )
}
