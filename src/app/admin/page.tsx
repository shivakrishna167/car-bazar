'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit3, CheckCircle, XCircle, LogOut, LayoutDashboard, Car, Bike, Search, Loader2, Megaphone, MessageSquare, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { vehicleService, Vehicle } from '@/services/vehicleService'

export default function AdminDashboard() {
  const router = useRouter()
  const [listings, setListings] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState<{
    weekly: { total: number, cars: number, bikes: number, revenue: number },
    monthly: { total: number, cars: number, bikes: number, revenue: number }
  } | null>(null)

  useEffect(() => {
    setMounted(true)
    const session = Cookies.get('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
    setHasSession(true)
    loadListings()
  }, [router])

  if (!mounted) return null

  async function loadListings() {
    setLoading(true)
    try {
      const [listingsData, statsData] = await Promise.all([
        vehicleService.getAllListings(),
        vehicleService.getSalesStats()
      ])
      setListings(listingsData)
      setStats(statsData)
    } catch (err) {
      console.error(err)
      alert('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing permanently?')) {
      try {
        await vehicleService.deleteVehicle(id)
        setListings(listings.filter(l => l.id !== id))
      } catch (err) {
        console.error(err)
        alert('Failed to delete listing')
      }
    }
  }

  const toggleStatus = async (id: string, currentStatus: 'available' | 'sold') => {
    const newStatus = currentStatus === 'available' ? 'sold' : 'available'
    try {
      await vehicleService.updateVehicleStatus(id, newStatus)
      setListings(listings.map(l =>
        l.id === id ? { ...l, status: newStatus } : l
      ))
      // Refresh stats after status change
      const newStats = await vehicleService.getSalesStats()
      setStats(newStats)
    } catch (err) {
      console.error(err)
      alert('Failed to update status')
    }
  }

  const handleLogout = () => {
    Cookies.remove('admin_session')
    setHasSession(false)
    router.push('/admin/login')
    // Force a reload to clear any cached states in components like Navbar
    window.location.href = '/'
  }

  const filtered = listings.filter(l =>
    `${l.make} ${l.model}`.toLowerCase().includes(search.toLowerCase())
  )

  if (!hasSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Authenticating...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Admin Header */}
      <div className="bg-secondary text-white py-12 border-b-8 border-primary shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-secondary shadow-lg">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Admin <span className="text-primary">Dashboard</span></h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Manage Friends Car Baazr Inventory</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-2 md:gap-3 w-full">
            <Link
              href="/admin/reviews"
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-white/20 transition-all text-[10px] md:text-sm flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} className="md:w-[18px] md:h-[18px]" /> Reviews
            </Link>
            <Link
              href="/admin/inquiries"
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-white/20 transition-all text-[10px] md:text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} className="md:w-[18px] md:h-[18px]" /> Inquiries
            </Link>
            <Link
              href="/admin/offers"
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-white/20 transition-all text-[10px] md:text-sm flex items-center justify-center gap-2"
            >
              <Megaphone size={14} className="md:w-[18px] md:h-[18px]" /> Offers
            </Link>
            <Link
              href="/admin/add"
              className="bg-primary text-secondary px-3 md:px-8 py-3 md:py-4 rounded-xl font-bold text-[10px] md:text-sm flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl shadow-primary/20"
            >
              <Plus size={14} className="md:w-[18px] md:h-[18px]" /> Add New
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 md:px-6 py-3 rounded-xl font-bold text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={14} className="md:w-[16px] md:h-[16px]" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 border-b border-gray-100 bg-white">
            <div className="p-4 md:p-8 text-center border-r border-gray-100">
              <p className="text-gray-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Total</p>
              <p className="text-lg md:text-4xl font-black text-secondary">{listings.length}</p>
            </div>
            <div className="p-4 md:p-8 text-center border-r border-gray-100">
              <p className="text-gray-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Live</p>
              <p className="text-lg md:text-4xl font-black text-green-500">
                {listings.filter(l => l.status === 'available').length}
              </p>
            </div>
            <div className="p-4 md:p-8 text-center">
              <p className="text-gray-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Sold</p>
              <p className="text-lg md:text-4xl font-black text-red-500">
                {listings.filter(l => l.status === 'sold').length}
              </p>
            </div>
          </div>

          {/* Business Growth Stats */}
          {stats && (
            <div className="p-6 md:p-10 bg-secondary/5 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <LayoutDashboard size={20} />
                </div>
                <h2 className="text-xl font-black text-secondary uppercase tracking-tight">Business Growth</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weekly */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Last 7 Days</p>
                      <h3 className="text-3xl font-black text-secondary">{stats.weekly.total} <span className="text-sm font-bold text-gray-400">Sold</span></h3>
                    </div>
                    <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Weekly</div>
                  </div>
                  <div className="flex gap-4 border-t border-gray-50 pt-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Car size={14} className="text-primary" />
                      <span className="text-xs font-bold text-secondary">{stats.weekly.cars} Cars</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
                      <Bike size={14} className="text-primary" />
                      <span className="text-xs font-bold text-secondary">{stats.weekly.bikes} Bikes</span>
                    </div>
                  </div>
                </div>

                {/* Monthly */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Last 30 Days</p>
                      <h3 className="text-3xl font-black text-secondary">{stats.monthly.total} <span className="text-sm font-bold text-gray-400">Sold</span></h3>
                    </div>
                    <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Monthly</div>
                  </div>
                  <div className="flex gap-4 border-t border-gray-50 pt-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Car size={14} className="text-primary" />
                      <span className="text-xs font-bold text-secondary">{stats.monthly.cars} Cars</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
                      <Bike size={14} className="text-primary" />
                      <span className="text-xs font-bold text-secondary">{stats.monthly.bikes} Bikes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search & Action Bar */}
          <div className="p-8 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Filter inventory..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary font-semibold text-secondary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <p className="font-bold text-gray-500 text-sm">Showing {filtered.length} items</p>
          </div>

          {/* Listings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-secondary text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5">Vehicle</th>
                  <th className="px-8 py-5">Type</th>
                  <th className="px-8 py-5">Year</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-secondary">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shadow-inner">
                          {item.type === 'car' ? <Car size={24} /> : <Bike size={24} />}
                        </div>
                        <span className="text-lg group-hover:text-primary transition-colors font-bold">{item.make} {item.model}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 capitalize text-sm">{item.type}</td>
                    <td className="px-8 py-6">{item.year}</td>
                    <td className="px-8 py-6 tabular-nums text-lg font-bold">₹{(item.price / 100000).toFixed(2)} Lakh</td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => toggleStatus(item.id, item.status)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize shadow-sm transition-all hover:scale-105 active:scale-95 ${item.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/edit/${item.id}`} className="p-2.5 hover:bg-secondary hover:text-white rounded-lg transition-colors">
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2.5 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
