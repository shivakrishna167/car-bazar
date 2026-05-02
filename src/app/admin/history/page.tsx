'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { History, ArrowLeft, Car, Bike, Search, Loader2, Calendar, IndianRupee } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { vehicleService, SaleRecord } from '@/services/vehicleService'

export default function SalesHistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<SaleRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const session = Cookies.get('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
    loadHistory()
  }, [router])

  async function loadHistory() {
    setLoading(true)
    try {
      const data = await vehicleService.getSalesHistory()
      setHistory(data)
    } catch (err) {
      console.error(err)
      alert('Failed to load sales history')
    } finally {
      setLoading(false)
    }
  }

  const filtered = history.filter(item =>
    `${item.make} ${item.model}`.toLowerCase().includes(search.toLowerCase())
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-secondary text-white py-12 border-b-8 border-primary shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-bold mb-6 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-secondary shadow-lg">
              <History size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Sales <span className="text-primary">History</span></h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Permanent Ledger of All Sold Vehicles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-100 bg-white">
             <div className="p-4 md:p-8 text-center border-r border-gray-100">
                <p className="text-gray-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Total Sold</p>
                <p className="text-lg md:text-3xl font-black text-secondary">{history.length}</p>
             </div>
             <div className="p-4 md:p-8 text-center border-r border-gray-100">
                <p className="text-gray-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Total Value</p>
                <p className="text-lg md:text-2xl font-black text-green-500">₹{(history.reduce((sum, s) => sum + s.price, 0) / 100000).toFixed(2)}L</p>
             </div>
             <div className="p-4 md:p-8 text-center border-r border-gray-100">
                <p className="text-gray-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Cars</p>
                <p className="text-lg md:text-3xl font-black text-primary">{history.filter(s => s.type === 'car').length}</p>
             </div>
             <div className="p-4 md:p-8 text-center">
                <p className="text-gray-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Bikes</p>
                <p className="text-lg md:text-3xl font-black text-primary">{history.filter(s => s.type === 'bike').length}</p>
             </div>
          </div>

          {/* Search Bar */}
          <div className="p-8 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search history..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary font-semibold text-secondary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <p className="font-bold text-gray-500 text-sm">Showing {filtered.length} records</p>
          </div>

          {/* History List */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 text-center">
                <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Sales Data...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-20 text-center text-gray-400 font-bold">
                No sales history found.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-secondary text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5">Vehicle</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">Price</th>
                    <th className="px-8 py-5">Sold Date</th>
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
                          <span className="text-lg font-bold">{item.make} {item.model}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 capitalize text-sm">{item.type}</td>
                      <td className="px-8 py-6 tabular-nums text-lg font-bold text-green-600">₹{(item.price / 100000).toFixed(2)} Lakh</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar size={14} />
                          {item.sold_at ? new Date(item.sold_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
