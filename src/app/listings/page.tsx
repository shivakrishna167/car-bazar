'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2 } from 'lucide-react'
import { vehicleService, Vehicle } from '@/services/vehicleService'
import { useSearchParams } from 'next/navigation'
import VehicleCard from '@/components/VehicleCard'
import SearchFilters from '@/components/SearchFilters'
import VehicleSkeleton from '@/components/VehicleSkeleton'

function ListingsContent() {
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') || 'all'
  const initialSearch = searchParams.get('search') || ''
  
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(() => {
    // Try to load from cache initially
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('friends_car_bazar_inventory_cache')
      return cached ? JSON.parse(cached) : []
    }
    return []
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [takingLong, setTakingLong] = useState(false)
  const [filters, setFilters] = useState({
    search: initialSearch,
    brand: 'all',
    minPrice: '',
    maxPrice: '',
    type: initialType
  })

  useEffect(() => {
    setMounted(true)
    setFilters(prev => ({ 
      ...prev, 
      type: initialType,
      search: initialSearch 
    }))
  }, [initialType, initialSearch])

  useEffect(() => {
    if (!mounted) return;
    
    let slowTimer: NodeJS.Timeout
    
    async function loadVehicles() {
      try {
        setLoading(true)
        setError(null)
        setTakingLong(false)
        
        // Show warning if it takes more than 4 seconds
        slowTimer = setTimeout(() => {
          setTakingLong(true)
        }, 4000)

        const data = await vehicleService.getAllListings()
        setAllVehicles(data || [])
        
        // Save to cache
        if (data) {
          localStorage.setItem('friends_car_bazar_inventory_cache', JSON.stringify(data))
        }
      } catch (err: any) {
        console.error('Fetch error:', err)
        setError(err.message || 'Failed to connect to database.')
      } finally {
        setLoading(false)
        setTakingLong(false)
        clearTimeout(slowTimer)
      }
    }
    loadVehicles()
    
    return () => clearTimeout(slowTimer)
  }, [mounted])



  const brands = useMemo(() => {
    const b = new Set(allVehicles.map(v => v.make))
    return Array.from(b).sort()
  }, [allVehicles])

  const filteredVehicles = useMemo(() => {
    return allVehicles.filter(v => {
      const matchesSearch = !filters.search || 
        `${v.make} ${v.model}`.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.description?.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesType = filters.type === 'all' || v.type === filters.type
      
      const matchesBrand = filters.brand === 'all' || v.make === filters.brand
      
      const matchesMinPrice = !filters.minPrice || v.price >= parseInt(filters.minPrice)
      const matchesMaxPrice = !filters.maxPrice || v.price <= parseInt(filters.maxPrice)

      return matchesSearch && matchesType && matchesBrand && matchesMinPrice && matchesMaxPrice
    })
  }, [allVehicles, filters])

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-secondary pt-16 sm:pt-24 pb-32 sm:pb-48 text-center overflow-hidden relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,204,0,0.05),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black tracking-[0.2em] mb-4 text-[10px] uppercase"
          >
            Showroom Inventory
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-7xl font-black text-white tracking-tighter mb-8 italic uppercase"
          >
            Premium <span className="text-primary italic">Vehicles</span>
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-gray-400 font-medium max-w-xl mx-auto italic"
          >
            Discover unmatched quality and transparent pricing across our handpicked selection of cars and bikes in Khammam.
          </motion.p>
        </div>
      </div>

      {/* Filters & Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <SearchFilters 
          onFilterChange={setFilters} 
          brands={brands} 
          activeFilters={filters}
        />

        <div className="mt-16 pb-24">
          {loading && allVehicles.length === 0 ? (
            <div className="space-y-12">
               {takingLong && (
                 <motion.div 
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-primary/10 border border-primary/20 p-4 rounded-2xl text-center"
                 >
                   <p className="text-secondary font-bold text-xs uppercase tracking-widest">
                     Connection is slow. Please wait while we fetch the latest inventory...
                   </p>
                 </motion.div>
               )}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {[...Array(6)].map((_, i) => <VehicleSkeleton key={i} />)}
               </div>
            </div>
          ) : error && allVehicles.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-24 text-center shadow-3xl border border-red-100 flex flex-col items-center">
              <div className="bg-red-50 p-6 rounded-3xl mb-8">
                <Search size={64} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-secondary uppercase italic mb-4">Connection Failed</h3>
              <p className="text-gray-500 font-medium mb-8 max-w-md">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-secondary text-white px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-all"
              >
                Try Again
              </button>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <VehicleCard vehicle={vehicle} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white rounded-[4rem] p-24 text-center shadow-3xl border border-gray-100 max-w-4xl mx-auto">
               <div className="bg-gray-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-white shadow-2xl">
                  <Search size={48} className="text-gray-200" />
               </div>
               <h3 className="text-4xl font-black text-secondary tracking-tight mb-6 italic uppercase">No Vehicles Found</h3>
               <p className="text-gray-400 font-medium max-w-md mx-auto italic text-lg leading-relaxed">
                 We couldn&apos;t find any results matching your filters. Try adjusting your search criteria or contact us for custom sourcing.
               </p>
               <button 
                 onClick={() => setFilters({ search: '', brand: 'all', minPrice: '', maxPrice: '', type: 'all' })}
                 className="mt-12 bg-secondary text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all"
               >
                 Reset All Filters
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen bg-secondary flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={64} />
          </div>
        }>
          <ListingsContent />
        </Suspense>
      </main>
    </div>
  )
}
