'use client'

import * as React from "react"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  // Demo: If only 1 name provided, duplicate it to mock 5 images for gallery feel
  // In production, this would be real images.
  const displayImages = images.length === 1 
    ? [images[0], images[0], images[0], images[0], images[0]] 
    : images

  useEffect(() => {
    if (!api) {
      return
    }

    const onSelect = () => {
      setCurrent(prev => {
        const next = api.selectedScrollSnap()
        return prev !== next ? next : prev
      })
    }

    onSelect()
    api.on("select", onSelect)
    
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  const scrollTo = (index: number) => {
    api?.scrollTo(index)
  }

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-white/5 rounded-none flex items-center justify-center text-gray-500 border border-white/10">
        No Images
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Carousel */}
      <Carousel setApi={setApi} className="w-full relative group">
        <CarouselContent>
          {displayImages.map((img, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-square bg-[#050505] border border-white/5 overflow-hidden">
                <Image 
                  src={img} 
                  alt={`Product view ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-black/50 border-white/10 text-white hover:bg-black hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        <CarouselNext className="right-4 bg-black/50 border-white/10 text-white hover:bg-black hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </Carousel>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {displayImages.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => scrollTo(idx)}
            className={cn(
              "relative w-20 h-20 flex-shrink-0 border transition-all duration-300 bg-[#050505] overflow-hidden",
              current === idx 
                ? "border-white opacity-100" 
                : "border-white/10 opacity-50 hover:opacity-100 hover:border-white/30"
            )}
          >
            <Image src={img} fill sizes="80px" className="object-cover" alt={`Thumbnail ${idx + 1}`} />
          </button>
        ))}
      </div>
    </div>
  )
}
