'use client'

import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
  brands: string[];
  activeFilters?: any;
}

export default function SearchFilters({ onFilterChange, brands, activeFilters }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState(activeFilters || {
    search: '',
    brand: 'all',
    minPrice: '',
    maxPrice: '',
    type: 'all'
  })

  useEffect(() => {
    if (activeFilters) {
      setFilters(activeFilters)
    }
  }, [activeFilters])

  const handleSearch = (val: string) => {
    const newFilters = { ...filters, search: val }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleType = (val: string) => {
    const newFilters = { ...filters, type: val }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleBrand = (val: string) => {
    const newFilters = { ...filters, brand: val }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePrice = (min: string, max: string) => {
    const newFilters = { ...filters, minPrice: min, maxPrice: max }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-6 border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-grow w-full lg:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search make or model..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-semibold text-secondary placeholder-gray-400"
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {filters.search && (
            <button onClick={() => handleSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary">
               <X size={18} />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          <button 
            onClick={() => handleType('all')}
            className={`px-6 py-4 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
              filters.type === 'all' ? 'bg-primary text-secondary' : 'bg-gray-50 text-gray-500'
            }`}
          >
            All Vehicles
          </button>
          <button 
            onClick={() => handleType('car')}
            className={`px-6 py-4 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
              filters.type === 'car' ? 'bg-primary text-secondary' : 'bg-gray-50 text-gray-500'
            }`}
          >
            Cars
          </button>
          <button 
            onClick={() => handleType('bike')}
            className={`px-6 py-4 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
              filters.type === 'bike' ? 'bg-primary text-secondary' : 'bg-gray-50 text-gray-500'
            }`}
          >
            Bikes
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`px-6 py-4 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              isOpen ? 'bg-secondary text-white' : 'bg-gray-50 text-gray-500'
            }`}
          >
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Brand</label>
            <div className="relative">
              <select 
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none appearance-none font-bold text-secondary text-sm"
                value={filters.brand}
                onChange={(e) => handleBrand(e.target.value)}
              >
                <option value="all">All Brands</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Price Range</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                placeholder="Min" 
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-sm text-secondary placeholder-gray-400"
                value={filters.minPrice}
                onChange={(e) => handlePrice(e.target.value, filters.maxPrice)}
              />
              <span className="text-gray-300 font-bold">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-sm text-secondary placeholder-gray-400"
                value={filters.maxPrice}
                onChange={(e) => handlePrice(filters.minPrice, e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => {
                const reset = { search: '', brand: 'all', minPrice: '', maxPrice: '', type: 'all' }
                setFilters(reset)
                onFilterChange(reset)
              }}
              className="w-full p-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 border-dashed border-gray-100 text-gray-400 hover:border-red-100 hover:text-red-400 transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
