'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { StockManager } from '@/features/products/components/StockManager'
import { updateJersey } from '@/app/actions/jersey'
import { compressImage } from '@/lib/compression'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function JerseyEditForm({ jersey }: { jersey: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  // Bind the id to the action (this creates a new function)
  // However, we can't pass this bound function easily to manual fetch.
  // We'll call updateJersey(id, formData) manually.

  // Parse stock data
  let stockDataMap = {}
  try {
    stockDataMap = JSON.parse(jersey.stockData || '{}')
  } catch (e) {
    console.error('Failed to parse stockData', e)
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
 
       setLoadingText('Updating Product...')
       await updateJersey(jersey.id, formData)
       toast.success('Product updated!')
       
     } catch (error) {
       console.error(error)
       toast.error('Failed to update product')
       setIsSubmitting(false)
     }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/jerseys" className="text-gray-400 hover:text-white transition-colors">
          &larr; Back to Products
        </Link>
        <h1 className="text-3xl font-bold mt-4">Edit Product</h1>
        <p className="text-gray-400">Editing: {jersey.team}</p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Team Name *</label>
            <input
              type="text"
              name="team"
              required
              defaultValue={jersey.team}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">League *</label>
            <input
              type="text"
              name="league"
              required
              list="leagues"
              defaultValue={jersey.league}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Season *</label>
            <input
              type="text"
              name="season"
              required
              defaultValue={jersey.season}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Category (Group)</label>
            <input
              type="text"
              name="category"
              readOnly
              value="Jersey"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Type *</label>
            <select
              name="type"
              required
              defaultValue={jersey.type}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Home">Home</option>
              <option value="Away">Away</option>
              <option value="Third">Third</option>
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Special Edition">Special Edition</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Price (IDR) *</label>
            <input
              type="number"
              name="price"
              required
              defaultValue={Number(jersey.price)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Stock Manager */}
        <div>
          <StockManager initialData={stockDataMap} />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={jersey.description || ''}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        {/* Current Images */}
        {jersey.images && jersey.images.length > 0 && (
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Current Images</label>
            <div className="flex gap-2 flex-wrap">
              {jersey.images.map((img: { id: string; url: string }) => (
                <div key={img.id} className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 relative">
                  <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Upload New Images (replaces existing)</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-bold file:cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
             <>
               <Loader2 className="w-5 h-5 animate-spin" />
               {loadingText}
             </>
          ) : 'Update Product'}
        </button>
      </form>
    </div>
  )
}
