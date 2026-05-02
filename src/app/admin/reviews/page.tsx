'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle, Trash2, ShieldCheck, XCircle, Search, Star, Loader2, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { vehicleService, Review } from '@/services/vehicleService'

export default function ReviewManagement() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setMounted(true)
    const session = Cookies.get('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
    setHasSession(true)
    loadReviews()
  }, [router])

  if (!mounted) return null

  async function loadReviews() {
    setLoading(true)
    try {
      const data = await vehicleService.getAllReviews()
      setReviews(data)
    } catch (err) {
      console.error(err)
      alert('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await vehicleService.approveReview(id)
      setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: true } : r))
    } catch (err) {
      alert('Failed to approve review')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this review permanently?')) {
      try {
        await vehicleService.deleteReview(id)
        setReviews(reviews.filter(r => r.id !== id))
      } catch (err) {
        alert('Failed to delete review')
      }
    }
  }

  const filtered = reviews.filter(r => 
    r.user_name.toLowerCase().includes(search.toLowerCase()) || 
    r.comment.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Reviews...</p>
      </div>
    )
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
      <div className="bg-secondary text-white py-16 border-b-8 border-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Link href="/admin" className="inline-flex items-center gap-2 text-primary font-bold text-xs mb-8 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Review <span className="text-primary">Management</span></h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-4">Manage your customer feedback</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          
          <div className="p-8 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-100">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search reviews..." 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary font-semibold text-secondary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <div className="flex gap-8">
                <div className="text-center">
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Pending</p>
                   <p className="text-2xl font-black text-orange-500">{reviews.filter(r => !r.is_approved).length}</p>
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Approved</p>
                   <p className="text-2xl font-black text-green-500">{reviews.filter(r => r.is_approved).length}</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <div className="p-20 text-center text-gray-300">
                <MessageSquare size={64} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-sm">No reviews found</p>
              </div>
            ) : (
              filtered.map((review) => (
                <div key={review.id} className="p-8 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center font-black italic">
                          {review.user_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-secondary italic uppercase tracking-tight">{review.user_name}</h4>
                          <div className="flex text-primary">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                        {!review.is_approved && (
                          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ml-2">Pending</span>
                        )}
                      </div>
                      <p className="text-gray-600 font-medium leading-relaxed italic text-lg">"{review.comment}"</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">
                        Submitted on {new Date(review.created_at!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex md:flex-col justify-end gap-3 shrink-0">
                      {!review.is_approved ? (
                        <button 
                          onClick={() => handleApprove(review.id)}
                          className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-green-500 font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-green-50 rounded-lg">
                          <CheckCircle size={14} /> Approved
                        </div>
                      )}
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="flex items-center gap-2 bg-white border border-red-100 text-red-500 px-6 py-3 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
