import Link from 'next/link'
import { createTestimonial } from '@/app/actions/testimonial'

export default function NewTestimonialPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/testimonials" className="text-gray-400 hover:text-white transition-colors">
          &larr; Back to Testimonials
        </Link>
        <h1 className="text-3xl font-bold mt-4">Add New Testimonial</h1>
      </div>

      <form action={createTestimonial} className="glass p-8 rounded-2xl space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Customer Name *</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Role / Description</label>
          <input
            type="text"
            name="role"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            placeholder="Manchester United Fan"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Testimonial Content *</label>
          <textarea
            name="content"
            required
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
            placeholder="Write the customer's review here..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Rating (1-5)</label>
          <select
            name="rating"
            defaultValue="5"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
            <option value="2">⭐⭐ (2 Stars)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">📸 Foto Bukti</label>
          <input
            type="file"
            name="proofImage"
            accept="image/*"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-bold file:cursor-pointer hover:file:bg-blue-700"
          />
          <p className="text-xs text-gray-500 mt-1">Upload foto jersey yang diterima, screenshot chat, dll (optional)</p>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all"
        >
          Add Testimonial
        </button>
      </form>
    </div>
  )
}
