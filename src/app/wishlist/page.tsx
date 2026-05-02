'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Search, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { vehicleService, Vehicle } from '@/services/vehicleService'
import VehicleCard from '@/components/VehicleCard'

export default function WishlistPage() {
  const [favorites, setFavorites] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    async function loadFavorites() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          const data = await vehicleService.getUserFavorites(user.id)
          setFavorites(data)
        } else {
          const localIds = vehicleService.getLocalFavorites()
          if (localIds.length > 0) {
            const vehiclePromises = localIds.map(async (id: string) => {
              try {
                return await vehicleService.getVehicleById(id)
              } catch (err) {
                console.warn(`Vehicle ${id} not found or deleted`)
                return null
              }
            })
            const vehicles = await Promise.all(vehiclePromises)
            setFavorites(vehicles.filter((v): v is Vehicle => v !== null))
          } else {
            setFavorites([])
          }
        }
      } catch (err) {
        console.error('Error loading favorites:', err)
      } finally {
        setLoading(false)
      }
    }
    loadFavorites()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-secondary pt-20 pb-32 text-center overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/listings" className="inline-flex items-center gap-2 text-primary font-bold mb-6 hover:text-white transition-colors text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Showroom
          </Link>
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
             <Heart className="text-primary fill-primary" size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 italic uppercase">My <span className="text-primary italic">Wishlist</span></h1>
          <p className="text-gray-400 font-medium">Your collection of saved cars and bikes. Ready to take the next step?</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {loading ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-xl border border-gray-100 flex flex-col items-center">
            <Loader2 className="animate-spin text-primary mb-4" size={48} />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading your favorites...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <VehicleCard vehicle={vehicle} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center shadow-xl border border-gray-100">
             <div className="bg-gray-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-inner">
                <Heart size={40} className="text-gray-200" />
             </div>
             <h3 className="text-3xl font-black text-secondary tracking-tight mb-4 uppercase italic">Wishlist is Empty</h3>
             <p className="text-gray-500 font-medium max-w-md mx-auto mb-10">
               You haven't saved any vehicles yet. Browse our inventory and click the heart icon to save your favorites.
             </p>
             <Link 
               href="/listings"
               className="bg-primary text-secondary px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all shadow-xl shadow-primary/20"
             >
               Explore Showroom
             </Link>
          </div>
        )}
      </div>
    </div>
  )
}
