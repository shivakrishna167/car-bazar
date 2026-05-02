'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Car, Bike, Fuel, Gauge, Calendar, Phone, MapPin, 
  ArrowLeft, Share2, Heart, ShieldCheck, ChevronRight 
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { vehicleService, Vehicle } from '@/services/vehicleService'
import { supabase } from '@/lib/supabase'

export default function VehicleDetailsPage() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    async function loadVehicle() {
      try {
        const data = await vehicleService.getVehicleById(id as string)
        setVehicle(data)
        
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          const fav = await vehicleService.isFavorite(user.id, id as string)
          setIsFav(fav)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadVehicle()
  }, [id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleToggleFav = async () => {
    if (!user) {
      alert('Please login to save favorites')
      return
    }
    try {
      const newState = await vehicleService.toggleFavorite(user.id, id as string)
      setIsFav(newState)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
        <Link href="/listings" className="text-primary font-bold hover:underline">Back to Inventory</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/listings" className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors">
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Back to Search</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-secondary">
              <Share2 size={20} />
            </button>
            <button 
              onClick={handleToggleFav}
              className={`p-2.5 rounded-xl transition-colors ${isFav ? 'bg-primary text-secondary' : 'hover:bg-gray-100 text-secondary'}`}
            >
              <Heart size={20} fill={isFav ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Left Column: Image Gallery & Description */}
          <div className="lg:col-span-3 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100"
            >
              <div className="aspect-[16/10] bg-gray-200 relative group">
                {(vehicle.image_urls && vehicle.image_urls.length > 0) ? (
                  <Image src={vehicle.image_urls[activeImageIndex]} alt={vehicle.model} fill className="object-cover transition-opacity duration-300" />
                ) : vehicle.image_url ? (
                  <Image src={vehicle.image_url} alt={vehicle.model} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/5 text-secondary/20">
                    {vehicle.type === 'car' ? <Car size={120} /> : <Bike size={120} />}
                  </div>
                )}
              </div>
              
              {vehicle.image_urls && vehicle.image_urls.length > 1 && (
                <div className="flex overflow-x-auto gap-4 p-4 scrollbar-hide">
                  {vehicle.image_urls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-4 transition-all ${activeImageIndex === index ? 'border-primary scale-105 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <Image src={url} alt={`${vehicle.model} - view ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-secondary mb-6 flex items-center gap-4">
                Description <div className="h-1 flex-grow bg-gray-50 rounded-full"></div>
              </h2>
              <p className="text-gray-500 font-medium leading-[1.8] text-lg">
                {vehicle.description || "No description provided for this vehicle. Please contact the seller for more details about the condition, maintenance history, and features."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex items-start gap-5">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-secondary shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary mb-1">Quality Inspection</h4>
                    <p className="text-xs text-secondary/60 font-medium">This vehicle has passed our 125-point quality check.</p>
                  </div>
               </div>
               <div className="bg-secondary/5 rounded-3xl p-8 border border-secondary/10 flex items-start gap-5">
                  <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary mb-1">Paperwork Done</h4>
                    <p className="text-xs text-secondary/60 font-medium">Hassle-free RC transfer and documentation support guaranteed.</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Pricing & Spec Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col sticky top-40">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{vehicle.year} Model</span>
                  <span className="bg-white border border-gray-100 text-gray-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{vehicle.type}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight mb-2">{vehicle.make} {vehicle.model}</h1>
                <p className="text-primary text-3xl sm:text-4xl font-black">{formatPrice(vehicle.price)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">Mileage</p>
                  <p className="font-bold text-secondary text-sm sm:text-base flex items-center gap-2"><Gauge size={16} className="text-primary" /> {vehicle.mileage.toLocaleString()} km</p>
                </div>
                <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">Fuel Type</p>
                  <p className="font-bold text-secondary text-sm sm:text-base flex items-center gap-2"><Fuel size={16} className="text-primary" /> {vehicle.fuel || "Petrol"}</p>
                </div>
                <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">Location</p>
                  <p className="font-bold text-secondary text-sm sm:text-base flex items-center gap-2"><MapPin size={16} className="text-primary" /> {vehicle.district || "Khammam"}</p>
                </div>
                <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 sm:mb-2">Year</p>
                  <p className="font-bold text-secondary text-sm sm:text-base flex items-center gap-2"><Calendar size={16} className="text-primary" /> {vehicle.year}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href="tel:+919849575114"
                    className="bg-secondary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl"
                  >
                    <Phone size={14} /> Call Younus
                  </a>
                  <a 
                    href="tel:+919949904505"
                    className="bg-secondary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl"
                  >
                    <Phone size={14} /> Call Satya
                  </a>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href={`https://wa.me/919849575114?text=Interested in ${vehicle.make} ${vehicle.model}`}
                    target="_blank"
                    className="bg-primary text-secondary py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/10"
                  >
                    <span className="text-sm">💬</span> WhatsApp
                  </a>
                  <a 
                    href={`https://wa.me/919949904505?text=Interested in ${vehicle.make} ${vehicle.model}`}
                    target="_blank"
                    className="bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-green-500/10"
                  >
                    <span className="text-sm">💬</span> WhatsApp
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <ShieldCheck size={24} />
                 </div>
                 <p className="text-[10px] font-medium text-gray-400 leading-normal uppercase tracking-widest">
                   Verify all documents before paying. <br /> Our team can assist with transfer.
                 </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
