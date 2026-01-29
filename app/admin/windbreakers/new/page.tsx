
'use client'

import { createWindbreaker } from '@/app/actions/windbreakers'
import Link from 'next/link'
import { StockManager } from '@/features/products/components/StockManager'

export default function NewWindbreakerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass p-8 rounded-3xl">
        <header className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black text-white">Add New Windbreaker</h1>
          <p className="text-gray-400">Add a new jacket to inventory.</p>
        </header>

        <form action={createWindbreaker} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Product Name</label>
              <input 
                name="team" 
                required 
                placeholder="e.g. Manchester United Anthem Jacket"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Type</label>
               <select 
                 name="type" 
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none"
               >
                 <option value="Windbreaker" className="bg-slate-800">Windbreaker</option>
                 <option value="Hoodie" className="bg-slate-800">Hoodie</option>
                 <option value="Jacket" className="bg-slate-800">Jacket</option>
                 <option value="Drill Top" className="bg-slate-800">Drill Top</option>
               </select>
            </div>
            
             <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Price ($)</label>
              <input 
                name="price" 
                type="number" 
                step="0.01" 
                required 
                placeholder="250000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              />
            </div>

            <div className="col-span-full md:col-span-2">
              <StockManager category="Windbreaker" />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Product Image</label>
             <input 
               name="images" 
               type="file"
               accept="image/*"
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
               required
             />
          </div>

          <div className="pt-6 flex items-center gap-4">
            <button 
              type="submit" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex-1"
            >
              Save Item
            </button>
            <Link 
              href="/admin/windbreakers"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
