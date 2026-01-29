'use client'

import { useState, useEffect } from 'react'
import { SIZE_PRESETS, DEFAULT_SIZE_PRESET } from '@/lib/config'

interface StockItem {
  size: string
  qty: number
}

interface Props {
  initialData?: Record<string, number>
  category?: string
}

export function StockManager({ initialData, category }: Props) {
  // Default sizes if no initial data
  const defaultStocks: StockItem[] = DEFAULT_SIZE_PRESET

  // Load initial data or defaults (Lazy Init)
  const [stocks, setStocks] = useState<StockItem[]>(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      return Object.entries(initialData).map(([size, qty]) => ({ size, qty }))
    }
    return category && SIZE_PRESETS[category] ? SIZE_PRESETS[category] : defaultStocks
  })

  // Watch for category changes or external initialData updates
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
       // eslint-disable-next-line react-hooks/set-state-in-effect
       setStocks(Object.entries(initialData).map(([size, qty]) => ({ size, qty })))
    } else {
       // Only reset to defaults if explicit category change implies it or if we strictly need to sync
       const preset = category && SIZE_PRESETS[category] ? SIZE_PRESETS[category] : defaultStocks
       setStocks(preset)
    }
  }, [initialData, category, defaultStocks])

  const addSize = () => setStocks([...stocks, { size: '', qty: 0 }])
  
  const removeSize = (idx: number) => {
    setStocks(stocks.filter((_, i) => i !== idx))
  }

  const update = (idx: number, field: keyof StockItem, val: string | number) => {
    const newStocks = [...stocks]
    if (field === 'qty') {
      newStocks[idx].qty = Number(val)
    } else {
      newStocks[idx].size = String(val)
    }
    setStocks(newStocks)
  }

  // Special case for "Produk Lainnya" (No sizes)
  if (category === 'Produk Lainnya') {
     const singleQty = stocks.length > 0 ? stocks[0].qty : 0
     
     // Update hidden inputs for single stock
     // We use a dummy size "Normal" or "AllSize" because the DB/Order system likely expects a size
     const stockDataString = JSON.stringify({ "Normal": Number(singleQty) })
     
     return (
       <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
         <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">
               📦 Stock (Single Item)
            </label>
         </div>
         
         <input type="hidden" name="stock" value={singleQty} />
         <input type="hidden" name="sizes" value="Normal" />
         <input type="hidden" name="stockData" value={stockDataString} />
         
         <div className="space-y-2">
              <label className="text-xs text-gray-500">Total Quantity</label>
              <input 
                 type="number"
                 placeholder="Available Stock"
                 min="0"
                 value={singleQty}
                 onChange={e => setStocks([{ size: 'Normal', qty: Number(e.target.value) }])}
                 className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none text-lg font-bold"
                 required
               />
         </div>
       </div>
     )
  }

  // Derived values for hidden inputs
  const totalStock = stocks.reduce((acc, s) => acc + (Number(s.qty) || 0), 0)
  const sizesString = stocks.filter(s => s.size).map(s => s.size).join(',')
  
  // Create object map { "S": 10, "M": 5 }
  const stockDataMap = stocks.reduce((acc, s) => {
    if (s.size) acc[s.size] = Number(s.qty) || 0
    return acc
  }, {} as Record<string, number>)
  
  const stockDataString = JSON.stringify(stockDataMap)

  return (
    <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">
          📦 Stock Management
        </label>
        <div className="text-xs text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
          Total: {totalStock} Items
        </div>
      </div>
      
      {/* Hidden inputs for Server Action */}
      <input type="hidden" name="stock" value={totalStock} />
      <input type="hidden" name="sizes" value={sizesString} />
      <input type="hidden" name="stockData" value={stockDataString} />

      <div className="space-y-3">
        {stocks.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-center animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono text-gray-500">
              {idx + 1}
            </div>
            
            <div className="flex-1">
               <input 
                 placeholder="Size (e.g. S, XL, 10-12y)"
                 value={item.size}
                 onChange={e => update(idx, 'size', e.target.value)}
                 className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none text-sm font-bold uppercase transition-colors"
                 required
               />
            </div>
            
            <div className="w-32 relative">
               <input 
                 type="number"
                 placeholder="Qty"
                 min="0"
                 value={item.qty}
                 onChange={e => update(idx, 'qty', e.target.value)}
                 className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 focus:outline-none text-right font-mono text-sm"
                 required
               />
               <span className="absolute left-3 top-2 text-xs text-gray-600 font-bold">QTY</span>
            </div>
            
            <button 
              type="button" 
              onClick={() => removeSize(idx)} 
              className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Remove variant"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      
      <button 
        type="button" 
        onClick={addSize} 
        className="text-sm flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-500/10 transition-colors mt-2"
      >
        <span>＋</span> Add Size Variant
      </button>
    </div>
  )
}
