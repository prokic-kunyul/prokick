'use client'

import { createJersey } from '@/app/actions/jersey'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { StockManager } from '@/features/products/components/StockManager'
import { compressImage } from '@/lib/compression'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { ProductCategory } from '@/lib/config'

export default function NewJerseyPage() {
  const [previews, setPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  
  // Fixed Category
  const selectedCategory: ProductCategory = 'Jersey'

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const urls = files.map(file => URL.createObjectURL(file))
      setPreviews(urls)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setLoadingText('Compressing images...')

    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      
      // Get all file inputs
      const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
      const files = fileInput?.files

      if (files && files.length > 0) {
        // Clear existing images in FormData to replace with compressed ones
        formData.delete('images')
        
        for (let i = 0; i < files.length; i++) {
           const file = files[i]
           // Compress if image
           if (file.type.startsWith('image/')) {
             const compressed = await compressImage(file)
             formData.append('images', compressed)
             console.log(`Compressed ${file.name}: ${(file.size / 1024).toFixed(2)}KB -> ${(compressed.size / 1024).toFixed(2)}KB`)
           } else {
             formData.append('images', file)
           }
        }
      }

      setLoadingText('Uploading...')
      await createJersey(formData)
      // Action redirects, but if checks fail:
      toast.success('Product created!')
      
    } catch (error) {
      console.error(error)
      toast.error('Failed to create product')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass p-8 rounded-3xl">
        <header className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black text-white">Add New Jersey</h1>
          <p className="text-gray-400">Fill in the details for the new jersey.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="category" value="Jersey" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team / Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                Team / Product Name
              </label>
              <input 
                name="team" 
                required 
                placeholder="e.g. Manchester United"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              />
            </div>

            {/* League */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                League
              </label>
              <div className="relative">
                <input 
                  name="league" 
                  list="leagues"
                  placeholder="e.g. Premier League"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
                <datalist id="leagues">
                  <option value="Premier League" />
                  <option value="La Liga" />
                  <option value="Serie A" />
                  <option value="Bundesliga" />
                  <option value="National Team" />
                  <option value="World Cup 2026" />
                </datalist>
              </div>
            </div>

            {/* Season */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Season</label>
                <div className="relative">
                    <input 
                    name="season" 
                    list="seasons"
                    placeholder="e.g. 2024/2025"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
                <datalist id="seasons">
                    <option value="2024/2025" />
                    <option value="2023/2024" />
                    <option value="Classic" />
                </datalist>
                </div>
            </div>

            {/* Type */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Type</label>
                <select 
                name="type" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none"
                >
                <option value="Home" className="bg-slate-800">Home Kit</option>
                <option value="Away" className="bg-slate-800">Away Kit</option>
                <option value="Third" className="bg-slate-800">Third Kit</option>
                <option value="GK" className="bg-slate-800">Goalkeeper</option>
                <option value="Special Edition" className="bg-slate-800">Special Edition</option>
                </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Price */}
             <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Price ($)</label>
              <input 
                name="price" 
                type="number" 
                step="0.01" 
                required 
                placeholder="79.99"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              />
            </div>

            {/* Stock Manager (Replaces Stock & Sizes) */}
            <div className="col-span-full md:col-span-2">
              <StockManager category={selectedCategory} />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Description</label>
            <textarea 
              name="description" 
              rows={4}
              placeholder="Describe the jersey details..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>

          {/* Image Upload with Preview */}
          <div className="space-y-4">
             <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Product Images</label>
             
             {/* Previews Grid */}
             {previews.length > 0 && (
               <div className="grid grid-cols-4 gap-4 mb-4">
                 {previews.map((url, index) => (
                   <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/20">
                      <Image src={url} alt={`Preview ${index + 1}`} fill sizes="25vw" className="object-cover" />
                   </div>
                 ))}
               </div>
             )}

             <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center border-dashed hover:bg-white/10 transition-colors relative group cursor-pointer">
                <input 
                  name="images" 
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div className="pointer-events-none">
                  <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p className="font-bold text-gray-300">Click to Upload Images</p>
                  <p className="text-xs text-gray-500 mt-1">Select multiple files to see preview</p>
                </div>
             </div>
          </div>

          <div className="pt-6 flex items-center gap-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-1 flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {loadingText}
                </>
              ) : 'Save Product'}
            </button>
            <Link 
              href="/admin/jerseys"
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
