import Image from 'next/image'
import { getPublicTestimonials } from '@/services/testimonials'
import { Star01 } from '@untitledui/icons'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export async function TestimonialList() {
  const testimonials = await getPublicTestimonials()

  if (testimonials.length === 0) return null

  return (
    <section className="py-20 bg-[#050A1F] text-white overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050A1F] to-transparent z-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] uppercase">
            KATA MEREKA
          </h2>
          <p className="text-blue-200/60 text-lg max-w-2xl mx-auto">
            Bergabung dengan ribuan kolektor yang telah menemukan jersey impian mereka.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-7xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((t) => (
              <CarouselItem key={t.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full bg-blue-900/10 backdrop-blur-md border border-blue-500/20 p-6 rounded-2xl relative hover:border-cyan-400/50 hover:bg-blue-900/20 transition-all duration-300 group shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)] flex flex-col">
                   
                   {/* Decorative Quote Mark */}
                   <div className="absolute top-4 right-6 text-6xl font-serif text-blue-500/10 z-0">
                     &quot;
                   </div>
    
                   {/* Proof Image */}
                   {t.proofImage && (
                     <div className="mb-6 overflow-hidden relative h-56 rounded-xl border border-white/5 flex-shrink-0">
                       <Image 
                         src={t.proofImage} 
                         alt="Foto Bukti" 
                         fill
                         sizes="(max-width: 768px) 100vw, 33vw"
                         className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 cursor-pointer"
                       />
                     </div>
                   )}
    
                   <div className="flex items-center gap-1 mb-4 relative z-10">
                     {[...Array(5)].map((_, i) => (
                       <Star01 
                         key={i} 
                         className={`w-4 h-4 ${i < t.rating ? 'fill-cyan-400 text-cyan-400' : 'text-blue-900'}`} 
                       />
                     ))}
                   </div>
    
                   <p className="text-blue-100/80 mb-6 leading-relaxed text-sm font-medium relative z-10 flex-grow">
                     &quot;{t.content}&quot;
                   </p>
    
                   <div className="flex items-center gap-4 pt-4 border-t border-blue-500/20 relative z-10 mt-auto">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                        <span className="text-xs font-black text-white">{t.name[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">{t.name}</h4>
                        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{t.role || 'Verified Buyer'}</p>
                      </div>
                   </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 -translate-x-full bg-blue-900/50 border-blue-500/30 text-white hover:bg-cyan-500 hover:text-black" />
            <CarouselNext className="right-0 translate-x-full bg-blue-900/50 border-blue-500/30 text-white hover:bg-cyan-500 hover:text-black" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
