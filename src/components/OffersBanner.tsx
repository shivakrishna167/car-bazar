'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, X, Percent } from 'lucide-react'
import { vehicleService, Offer } from '@/services/vehicleService'

export default function OffersBanner() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await vehicleService.getActiveOffers()
        setOffers(data)
      } catch (err) {
        console.error('Failed to load offers:', err)
      }
    }
    loadOffers()
  }, [])

  useEffect(() => {
    if (offers.length > 1) {
      const timer = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % offers.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [offers])

  if (!isVisible || offers.length === 0) return null

  const offer = offers[currentOfferIndex]

  return (
    <div className="bg-secondary relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={offer.id}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary text-secondary p-1.5 rounded-lg flex items-center justify-center">
              <Percent size={16} strokeWidth={3} />
            </div>
            <p className="text-white font-black text-sm tracking-tight uppercase">
              <span className="text-primary italic">{offer.discount_text}</span> — {offer.title}
            </p>
          </div>
          
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          
          <p className="text-gray-400 text-xs font-bold truncate max-w-md hidden lg:block">
            {offer.description}
          </p>

          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
            Claim Offer <ArrowRight size={14} />
          </button>
        </motion.div>
      </AnimatePresence>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>

      {/* Pulsing glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-primary/5 blur-3xl rounded-full" />
    </div>
  )
}
