'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Megaphone, Save, X, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { vehicleService, Offer } from '@/services/vehicleService'

export default function AdminOffersPage() {
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount_text: '',
    is_active: true
  })

  useEffect(() => {
    setMounted(true)
    const session = Cookies.get('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
    setHasSession(true)
    loadOffers()
  }, [router])

  if (!mounted) return null

  async function loadOffers() {
    setLoading(true)
    try {
      const data = await vehicleService.getAllOffers()
      setOffers(data)
    } catch (err: any) {
      console.error(err)
      alert(`Failed to load offers: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await vehicleService.addOffer(newOffer)
      setIsAdding(false)
      loadOffers()
      setNewOffer({ title: '', description: '', discount_text: '', is_active: true })
    } catch (err: any) {
      console.error(err)
      alert(`Failed to add offer: ${err.message}`)
    }
  }

  const toggleOfferStatus = async (id: string, currentStatus: boolean) => {
    try {
      await vehicleService.updateOffer(id, { is_active: !currentStatus })
      setOffers(offers.map(o => o.id === id ? { ...o, is_active: !currentStatus } : o))
    } catch (err: any) {
      console.error(err)
      alert(`Failed to update status: ${err.message}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this offer?')) {
      try {
        await vehicleService.deleteOffer(id)
        loadOffers()
      } catch (err: any) {
        console.error(err)
        alert(`Failed to delete: ${err.message}`)
      }
    }
  }

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
      <div className="bg-secondary text-white py-12 border-b-8 border-primary shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="bg-primary p-3 rounded-2xl text-secondary shadow-lg">
                <Megaphone size={32} />
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tight text-white">Manage <span className="text-primary">Offers</span></h1>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Homepage Promotional Banners</p>
             </div>
          </div>
          <div className="flex gap-4">
             <Link href="/admin" className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-xl font-bold text-sm transition-all border border-white/10 flex items-center gap-2">
                <ArrowLeft size={18} /> Back
             </Link>
             <button 
               onClick={() => setIsAdding(true)}
               className="bg-primary text-secondary px-8 py-4 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-primary/20"
             >
               <Plus size={18} /> Create Offer
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-primary/20 mb-12"
          >
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Offer Title</label>
                <input 
                  required
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl focus:ring-2 focus:ring-primary font-bold text-secondary"
                  value={newOffer.title}
                  onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                  placeholder="e.g. Festival Special"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Discount Label (Yellow Text)</label>
                <input 
                  required
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl focus:ring-2 focus:ring-primary font-bold text-secondary"
                  value={newOffer.discount_text}
                  onChange={e => setNewOffer({...newOffer, discount_text: e.target.value})}
                  placeholder="e.g. UP TO ₹20,000 OFF"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Description</label>
                <textarea 
                  required
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl focus:ring-2 focus:ring-primary font-bold text-secondary"
                  value={newOffer.description}
                  onChange={e => setNewOffer({...newOffer, description: e.target.value})}
                  rows={2}
                  placeholder="Details about the offer..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="bg-secondary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
                  <Save size={18} /> Save Offer
                </button>
                <button type="button" onClick={() => setIsAdding(false)} className="text-gray-400 font-bold px-4">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map(offer => (
              <div key={offer.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start group">
                <div>
                  <button 
                    onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3 inline-block transition-all hover:scale-105 active:scale-95 ${
                      offer.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {offer.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <h3 className="text-xl font-black text-secondary mb-1">{offer.title}</h3>
                  <p className="text-primary font-bold text-sm mb-3 italic">{offer.discount_text}</p>
                  <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-md">{offer.description}</p>
                </div>
                <button 
                  onClick={() => handleDelete(offer.id)}
                  className="p-3 text-red-100 bg-red-500 rounded-xl hover:scale-110 transition-all shadow-lg shadow-red-500/20"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
