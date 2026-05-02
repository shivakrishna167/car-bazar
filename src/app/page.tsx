'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Bike, ShieldCheck, BadgeCheck, Zap, ArrowRight, Star, MapPin, Loader2, Users, Phone, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import VehicleCard from '@/components/VehicleCard'
import ReviewSection from '@/components/ReviewSection'
import OffersBanner from '@/components/OffersBanner'
import VehicleSkeleton from '@/components/VehicleSkeleton'
import { vehicleService, Vehicle } from '@/services/vehicleService'

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('friends_car_bazar_featured_cache')
      return cached ? JSON.parse(cached) : []
    }
    return []
  })
  const [loading, setLoading] = useState(true)
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const [takingLong, setTakingLong] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    let slowTimer: NodeJS.Timeout

    async function loadData() {
      try {
        setLoading(true)
        setTakingLong(false)
        
        slowTimer = setTimeout(() => {
          setTakingLong(true)
        }, 4000)

        const [vehicles, offers] = await Promise.all([
          vehicleService.getFeaturedListings(),
          vehicleService.getActiveOffers()
        ])
        
        setFeaturedVehicles(vehicles)
        if (vehicles) {
          localStorage.setItem('friends_car_bazar_featured_cache', JSON.stringify(vehicles))
        }

        if (offers && offers.length > 0) {
          setCurrentOffer(offers[0])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
        setTakingLong(false)
        clearTimeout(slowTimer)
      }
    }
    loadData()
    return () => clearTimeout(slowTimer)
  }, [])
  return (
    <div className="flex flex-col gap-0 min-h-screen bg-secondary">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden bg-secondary">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,204,0,0.05),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-8">
               <span className="text-primary font-black text-xs uppercase tracking-[0.2em]">#1 Trusted Car Dealer in Khammam</span>
            </div>

            <div className="flex flex-col items-center gap-6 mb-8 px-4">
               <AnimatePresence>
                 {currentOffer && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.5, y: -20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     className="relative group"
                   >
                     <div className="absolute -inset-1 bg-gradient-to-r from-primary via-yellow-400 to-primary rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                     <div className="relative flex items-center gap-3 bg-secondary border border-primary/30 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-primary shadow-2xl">
                        <Zap size={18} fill="currentColor" className="animate-bounce" />
                        <span className="text-[10px] sm:text-lg font-black uppercase tracking-widest italic drop-shadow-sm line-clamp-1">
                          {currentOffer.discount_text}: {currentOffer.title}
                        </span>
                        <Zap size={18} fill="currentColor" className="animate-bounce" />
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-4">
                 Find Your<br />
                 <span className="text-primary italic">Dream Car</span><br />
                 Today
               </h1>

               <p className="text-gray-400 text-base md:text-xl font-medium max-w-2xl leading-relaxed">
                 Experience the joy of owning a quality vehicle. New or pre-owned, we have the perfect car waiting for you with easy finance options.
               </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
               <Link href="/listings" className="bg-primary text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">
                 Browse Cars <ArrowRight size={20} />
               </Link>
            </div>
          </motion.div>

          {/* Search Box - Hidden on mobile, showing simpler button or compact version */}
          <motion.div 
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-white/10 shadow-3xl mt-12 mb-12 mx-4"
          >
            <div className="flex flex-col gap-6">
              <div className="flex justify-center gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="search-type" defaultChecked className="w-5 h-5 accent-primary" />
                  <span className="text-white font-bold text-sm">Cars</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="search-type" className="w-5 h-5 accent-primary" />
                  <span className="text-white font-bold text-sm">Bikes</span>
                </label>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search model or brand..." 
                  className="w-full px-6 py-4 bg-white rounded-xl font-bold text-secondary text-sm focus:outline-none focus:ring-4 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(`/listings?search=${encodeURIComponent(searchQuery)}`)
                    }
                  }}
                />
              </div>

              <button 
                onClick={() => router.push(`/listings?search=${encodeURIComponent(searchQuery)}`)}
                className="bg-primary text-secondary w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl"
              >
                 <Search size={18} strokeWidth={3} /> Search
              </button>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-12 mt-12 sm:mt-24 w-full max-w-4xl border-t border-white/10 pt-12">
             <div className="flex flex-col p-4 bg-white/5 rounded-2xl">
                <span className="text-2xl sm:text-4xl font-black text-white">1000+</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Cars Sold</span>
             </div>
             <div className="flex flex-col p-4 bg-white/5 rounded-2xl">
                <span className="text-2xl sm:text-4xl font-black text-white">20+</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Experience</span>
             </div>
             <div className="flex flex-col p-4 bg-white/5 rounded-2xl">
                <span className="text-2xl sm:text-4xl font-black text-white">500+</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Clients</span>
             </div>
             <div className="flex flex-col p-4 bg-white/5 rounded-2xl">
                <span className="text-2xl sm:text-4xl font-black text-white">50+</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Monthly</span>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Popular Vehicles */}
          <div className="mb-24">
            <motion.div 
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12"
            >
              <div>
                <p className="text-blue-600 font-bold uppercase tracking-widest mb-3 text-xs">Featured Cars</p>
                <h2 className="text-5xl font-black text-secondary tracking-tighter uppercase italic">Popular Vehicles</h2>
                <p className="text-gray-400 font-medium mt-2">Hand-picked quality cars at best prices</p>
              </div>
              <Link href="/listings?type=car" className="group flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-2xl font-black text-secondary hover:bg-primary transition-all text-xs uppercase tracking-widest border border-gray-100">
                View All Cars <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <div className="relative group">
              {/* Mobile Horizontal Scroll */}
              <div className="flex md:hidden overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar -mx-4 px-4 mt-6">
                {loading && featuredVehicles.filter(v => v.type === 'car').length === 0 ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="min-w-[85vw] snap-center">
                       <VehicleSkeleton />
                    </div>
                  ))
                ) : featuredVehicles.filter(v => v.type === 'car').length > 0 ? (
                  featuredVehicles.filter(v => v.type === 'car').map(vehicle => (
                    <div key={vehicle.id} className="min-w-[85vw] snap-center">
                       <VehicleCard vehicle={vehicle} />
                    </div>
                  ))
                ) : (
                  <div className="min-w-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                     <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Coming Soon...</p>
                  </div>
                )}
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
                {loading && featuredVehicles.filter(v => v.type === 'car').length === 0 ? (
                  Array(3).fill(0).map((_, i) => (
                    <VehicleSkeleton key={i} />
                  ))
                ) : featuredVehicles.filter(v => v.type === 'car').length > 0 ? (
                  featuredVehicles.filter(v => v.type === 'car').map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                     <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No Cars available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Latest Bikes */}
          <div className="mb-24">
            <motion.div 
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12"
            >
              <div>
                <p className="text-blue-600 font-bold uppercase tracking-widest mb-3 text-xs">New Arrivals</p>
                <h2 className="text-5xl font-black text-secondary tracking-tighter uppercase italic">Latest Bikes</h2>
                <p className="text-gray-400 font-medium mt-2">Quality tested two-wheelers for every rider</p>
              </div>
              <Link href="/listings?type=bike" className="group flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-2xl font-black text-secondary hover:bg-primary transition-all text-xs uppercase tracking-widest border border-gray-100">
                View All Bikes <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <div className="relative group">
              {/* Mobile Horizontal Scroll */}
              <div className="flex md:hidden overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar -mx-4 px-4 mt-6">
                {loading && featuredVehicles.filter(v => v.type === 'bike').length === 0 ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="min-w-[85vw] snap-center">
                       <VehicleSkeleton />
                    </div>
                  ))
                ) : featuredVehicles.filter(v => v.type === 'bike').length > 0 ? (
                  featuredVehicles.filter(v => v.type === 'bike').map(vehicle => (
                    <div key={vehicle.id} className="min-w-[85vw] snap-center">
                       <VehicleCard vehicle={vehicle} />
                    </div>
                  ))
                ) : (
                  <div className="min-w-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                     <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Stay Tuned...</p>
                  </div>
                )}
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
                {loading && featuredVehicles.filter(v => v.type === 'bike').length === 0 ? (
                  Array(3).fill(0).map((_, i) => (
                    <VehicleSkeleton key={i} />
                  ))
                ) : featuredVehicles.filter(v => v.type === 'bike').length > 0 ? (
                  featuredVehicles.filter(v => v.type === 'bike').map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                     <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No Bikes available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="bg-blue-100 text-blue-600 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-6 inline-block">Our Services</span>
          <h2 className="text-5xl md:text-6xl font-black text-secondary tracking-tighter mb-8 italic uppercase">Complete Car<br />Solutions</h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto mb-20 leading-relaxed">
            From buying to financing, we provide end-to-end services for all your automobile needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 hover:scale-105 transition-transform">
               <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-8">
                  <ShieldCheck size={40} />
               </div>
               <h3 className="text-2xl font-black text-secondary mb-4 italic uppercase">Certified Selection</h3>
               <p className="text-gray-400 font-medium">Every vehicle is rigorously inspected to meet our highest quality standards.</p>
            </div>
            <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 hover:scale-105 transition-transform md:-mt-8 md:mb-8">
               <div className="bg-primary/20 w-20 h-20 rounded-2xl flex items-center justify-center text-secondary mx-auto mb-8">
                  <Zap size={40} />
               </div>
               <h3 className="text-2xl font-black text-secondary mb-4 italic uppercase">Instant Approval</h3>
               <p className="text-gray-400 font-medium">Get easy financing options and quick documentation support same day.</p>
            </div>
            <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 hover:scale-105 transition-transform">
               <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-8">
                  <Star size={40} />
               </div>
               <h3 className="text-2xl font-black text-secondary mb-4 italic uppercase">After Sales</h3>
               <p className="text-gray-400 font-medium">Comprehensive support for RC transfer and regular maintenance checks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Owners Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="bg-blue-100 text-blue-600 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-6 inline-block">Our Team</span>
            <h2 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter italic uppercase">Meet the Experts</h2>
            <p className="text-gray-400 font-medium mt-4">Passionate professionals dedicated to your car dreams</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 max-w-4xl mx-auto">
            <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group text-center sm:text-left">
               <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white text-3xl sm:text-4xl font-black italic shadow-2xl shadow-blue-600/30 shrink-0">
                  SY
               </div>
               <div className="flex-grow">
                  <h3 className="text-2xl sm:text-3xl font-black text-secondary italic uppercase tracking-tight">Syed Younus</h3>
                  <p className="text-gray-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest mt-1 mb-4">Co-Founder & Managing Partner</p>
                  <a href="tel:+919849575114" className="text-blue-600 font-black flex items-center justify-center sm:justify-start gap-2 hover:translate-x-1 transition-transform">
                     <Phone size={18} fill="currentColor" /> 9849575114
                  </a>
               </div>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group text-center sm:text-left md:mt-12 md:-mb-12">
               <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white text-3xl sm:text-4xl font-black italic shadow-2xl shadow-blue-600/30 shrink-0">
                  PS
               </div>
               <div className="flex-grow">
                  <h3 className="text-2xl sm:text-3xl font-black text-secondary italic uppercase tracking-tight">P. Satyanarayana</h3>
                  <p className="text-gray-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest mt-1 mb-4">Co-Founder & Sales Head</p>
                  <a href="tel:+919949904505" className="text-blue-600 font-black flex items-center justify-center sm:justify-start gap-2 hover:translate-x-1 transition-transform">
                     <Phone size={18} fill="currentColor" /> 9949904505
                  </a>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Testimonials */}
      <ReviewSection />

      {/* Address CTA */}
      <section className="py-24 bg-primary text-secondary overflow-hidden relative mb-20 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <MapPin size={48} className="mb-6 sm:mb-8" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight italic uppercase">
            Visit Our Showroom
          </h2>
          <p className="text-lg font-bold max-w-2xl mb-12 leading-relaxed italic underline decoration-secondary/30 decoration-4 px-4">
            Near Kotta Busstand, RR Public School Beside, Bypassroad Khammam
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full max-w-sm sm:max-w-none">
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              className="bg-secondary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl"
            >
              Get Directions <ArrowRight />
            </a>
            <a 
              href="tel:+919849575114" 
              className="bg-white text-secondary px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-3 border-4 border-secondary shadow-lg"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
