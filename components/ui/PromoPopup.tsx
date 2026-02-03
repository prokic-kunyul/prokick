'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const PROMO_POPUP_KEY = 'prokick-promo-seen'

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeen = localStorage.getItem(PROMO_POPUP_KEY)
    
    if (!hasSeen) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem(PROMO_POPUP_KEY, 'true')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-md"
          >
            <div className="relative bg-gradient-to-br from-[#0a1628] to-[#050A1F] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)]">
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  <Gift className="w-10 h-10 text-white" />
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-bold mb-4">
                  <Sparkles className="w-4 h-4" />
                  PROMO SPESIAL
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                  BELI 3 GRATIS 1!
                </h2>

                {/* Description */}
                <p className="text-blue-100/70 mb-6 leading-relaxed">
                  Dapatkan 1 jersey GRATIS untuk setiap pembelian 3 jersey. 
                  Promo berlaku untuk semua koleksi!
                </p>

                {/* CTA Button */}
                <Button
                  asChild
                  className="w-full py-6 text-lg font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:brightness-110 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <Link href="/#collection" onClick={handleClose}>
                    BELANJA SEKARANG
                  </Link>
                </Button>

                {/* Dismiss Link */}
                <button
                  onClick={handleClose}
                  className="mt-4 text-sm text-blue-300/50 hover:text-blue-300 transition-colors"
                >
                  Nanti saja
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
