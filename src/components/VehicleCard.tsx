'use client'

import { Car, Bike, Fuel, Gauge, Calendar, Phone, MapPin, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { vehicleService } from '@/services/vehicleService'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface VehicleProps {
  id: string
  type: 'car' | 'bike'
  make: string
  model: string
  year: number
  price: number
  mileage: number
  image_url?: string
  fuel?: string
  district?: string
  location?: string
  status: 'available' | 'sold'
}

export default function VehicleCard({ vehicle }: { vehicle: VehicleProps }) {
  const [isFav, setIsFav] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function checkFav() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const fav = await vehicleService.isFavorite(user.id, vehicle.id)
        setIsFav(fav)
      } else {
        setIsFav(vehicleService.isLocalFavorite(vehicle.id))
      }
    }
    checkFav()
  }, [vehicle.id])

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (user) {
      try {
        const newState = await vehicleService.toggleFavorite(user.id, vehicle.id)
        setIsFav(newState)
      } catch (err) {
        console.error(err)
      }
    } else {
      const isAdded = vehicleService.toggleLocalFavorite(vehicle.id)
      setIsFav(isAdded)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
      <div className="relative">
        <div className="aspect-[16/10] bg-gray-200 relative overflow-hidden">
          {vehicle.image_url ? (
            <Image 
              src={vehicle.image_url} 
              alt={`${vehicle.make} ${vehicle.model}`}
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-500 ${vehicle.status === 'sold' ? 'grayscale-[0.5] brightness-75' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/5 text-secondary/20">
              {vehicle.type === 'car' ? <Car size={64} /> : <Bike size={64} />}
            </div>
          )}
          
          {/* Status Tags */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            <span className="bg-blue-600/90 backdrop-blur-md text-white px-3 py-1 rounded-md text-[10px] font-bold shadow-lg">
              {vehicle.year} | {vehicle.district || 'Khammam'}
            </span>
            {vehicle.status === 'sold' && (
              <span className="bg-red-600 text-white px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-xl animate-pulse">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Sold Overlay */}
          {vehicle.status === 'sold' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
               <div className="border-4 border-white/40 px-8 py-3 rotate-[-15deg] scale-125">
                  <span className="text-white text-4xl font-black italic tracking-tighter drop-shadow-2xl">SOLD</span>
               </div>
            </div>
          )}
          
          <button 
            onClick={handleToggleFav}
            className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md shadow-md transition-all ${
              isFav ? 'bg-primary text-secondary' : 'bg-white text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart size={18} fill={isFav ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-black text-secondary group-hover:text-blue-600 transition-colors leading-tight">
            {vehicle.make}
          </h3>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{vehicle.model || 'Standard'}</p>
        </div>

        <div className="mb-6">
          <p className="text-2xl font-black text-blue-600">
            {formatPrice(vehicle.price)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2 text-gray-400">
            <Gauge size={14} />
            <span className="text-[11px] font-bold text-gray-500">{vehicle.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Fuel size={14} />
            <span className="text-[11px] font-bold text-gray-500">{vehicle.fuel || (vehicle.type === 'car' ? 'Petrol' : 'Petrol')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Car size={14} />
            <span className="text-[11px] font-bold text-gray-500">Manual</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin size={14} />
            <span className="text-[11px] font-bold text-gray-500">1st Owner</span>
          </div>
        </div>

        <div className="space-y-3 mt-auto">
          {/* Call Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="tel:+919849575114"
              className="bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-[10px] uppercase tracking-tighter flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
            >
              <Phone size={14} fill="currentColor" /> Call Younus
            </a>
            <a 
              href="tel:+919949904505"
              className="bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-[10px] uppercase tracking-tighter flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
            >
              <Phone size={14} fill="currentColor" /> Call Satya
            </a>
          </div>

          {/* WhatsApp Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a 
              href={`https://wa.me/919849575114?text=Hi, I am interested in this ${vehicle.make} ${vehicle.model}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-green-200 text-green-700 bg-green-50/50 text-center py-4 rounded-xl font-black text-[9px] uppercase tracking-tighter flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="text-sm">💬</span> WhatsApp (114)
            </a>
            <a 
              href={`https://wa.me/919949904505?text=Hi, I am interested in this ${vehicle.make} ${vehicle.model}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-green-200 text-green-700 bg-green-50/50 text-center py-4 rounded-xl font-black text-[9px] uppercase tracking-tighter flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="text-sm">💬</span> WhatsApp (505)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
