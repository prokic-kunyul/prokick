import Link from 'next/link'
import { getTestimonials } from '@/services/testimonials'
import { DeleteTestimonialButton } from './components/DeleteTestimonialButton'

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-gray-400">Manage customer reviews.</p>
        </div>
        <Link href="/admin/testimonials/new" className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1 block">
          + Add Testimonial
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="glass p-6 rounded-2xl relative group">
            <div className="flex items-center gap-1 mb-3 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-current' : 'text-gray-600'}`} viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">&quot;{t.content}&quot;</p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
              <DeleteTestimonialButton id={t.id} />
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-500">No testimonials yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
