'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MessageSquare, X, Send, CheckCircle2, User, Quote } from 'lucide-react'
import { vehicleService, Review } from '@/services/vehicleService'

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    user_name: '',
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    try {
      const data = await vehicleService.getReviews()
      setReviews(data)
    } catch (err) {
      console.error('Failed to load reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await vehicleService.submitReview(formData)
      setSubmitted(true)
      setTimeout(() => {
        setShowForm(false)
        setSubmitted(false)
        setFormData({ user_name: '', rating: 5, comment: '' })
      }, 3000)
    } catch (err: any) {
      console.error(err)
      alert(`Failed to submit review: ${err.message || 'Please try again.'}`)
    }
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  return (
    <section className="py-32 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <div className="max-w-xl">
            <span className="bg-blue-100 text-blue-600 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-6 inline-block">Testimonials</span>
            <h2 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter italic uppercase leading-[0.9]">
              What Our<br />Customers Say
            </h2>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50">
              <div className="text-center border-r border-gray-100 pr-6">
                <p className="text-4xl font-black text-secondary">{averageRating}</p>
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              <div className="pl-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Reviews</p>
                <p className="font-bold text-secondary">{reviews.length + 120}+ Happy Clients</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowForm(true)}
              className="bg-secondary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-secondary/20 flex items-center gap-3 active:scale-95"
            >
              <MessageSquare size={18} /> Write a Review
            </button>
          </div>
        </div>

        {/* Reviews Grid/Scroller */}
        {/* Reviews Grid/Scroller */}
        <div className="relative group">
          {/* Mobile Horizontal Scroll */}
          <div className="flex md:hidden overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar -mx-4 px-4">
            {reviews.length === 0 && !loading && (
              <div className="min-w-[85vw] snap-center bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 relative">
                 <Quote className="absolute top-6 right-6 text-primary/10" size={40} />
                 <div className="flex text-primary mb-4">
                   {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                 </div>
                 <p className="text-gray-500 font-medium text-base leading-relaxed italic mb-8 relative z-10">
                   "Friends Car Bazar provided me with an exceptional experience. Highly recommended for quality vehicles."
                 </p>
                 <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                    <div className="w-12 h-12 bg-primary text-secondary rounded-xl flex items-center justify-center font-black italic">JS</div>
                    <div>
                       <h4 className="font-black text-secondary uppercase italic text-sm">Janardhan S.</h4>
                       <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Verified Buyer</p>
                    </div>
                 </div>
              </div>
            )}

            {reviews.map((review) => (
              <div key={review.id} className="min-w-[85vw] snap-center">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 h-full relative">
                   <Quote className="absolute top-6 right-6 text-primary/10" size={40} />
                   <div className="flex text-primary mb-4">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                     ))}
                   </div>
                   <p className="text-gray-500 font-medium text-base leading-relaxed italic mb-8 relative z-10 line-clamp-4">
                     "{review.comment}"
                   </p>
                   <div className="flex items-center gap-4 border-t border-gray-50 pt-6 mt-auto">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black italic">
                         {review.user_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                         <h4 className="font-black text-secondary uppercase italic text-sm">{review.user_name}</h4>
                         <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Customer</p>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Fallback Static Review if none in DB */}
             {reviews.length === 0 && !loading && (
               <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-500">
                  <Quote className="absolute top-10 right-10 text-primary/10" size={60} />
                  <div className="flex text-primary mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed italic mb-10 relative z-10">
                    "Friends Car Bazar provided me with an exceptional experience. The pricing was transparent and the vehicle condition was exactly as described."
                  </p>
                  <div className="flex items-center gap-4 border-t border-gray-50 pt-8">
                     <div className="w-14 h-14 bg-primary text-secondary rounded-2xl flex items-center justify-center font-black italic shadow-lg shadow-primary/20">
                        JS
                     </div>
                     <div>
                        <h4 className="font-black text-secondary uppercase italic">Janardhan S.</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verified Buyer</p>
                     </div>
                  </div>
               </div>
             )}

             {reviews.map((review, idx) => (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 key={review.id}
                 className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-500"
               >
                  <Quote className="absolute top-10 right-10 text-primary/10" size={60} />
                  <div className="flex text-primary mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed italic mb-10 relative z-10 line-clamp-4">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-4 border-t border-gray-50 pt-8">
                     <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black italic shadow-lg shadow-blue-600/20">
                        {review.user_name.substring(0, 2).toUpperCase()}
                     </div>
                     <div>
                        <h4 className="font-black text-secondary uppercase italic">{review.user_name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customer Review</p>
                     </div>
                  </div>
               </motion.div>
             ))}
          </div>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowForm(false)}
                className="absolute inset-0 bg-secondary/80 backdrop-blur-md"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden relative z-10 shadow-3xl"
              >
                {submitted ? (
                  <div className="p-16 text-center space-y-6">
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-4xl font-black text-secondary italic uppercase tracking-tight">Review Submitted!</h3>
                    <p className="text-gray-500 font-medium pb-8 border-b border-gray-100">Thank you for your feedback. Our team will review and publish it shortly.</p>
                    
                    <button 
                      onClick={() => {
                        setShowForm(false)
                        setSubmitted(false)
                      }}
                      className="w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                      Back to Home
                    </button>
                  </div>
                ) : (
                  <div className="p-8 sm:p-12 relative">
                    <button 
                      onClick={() => setShowForm(false)}
                      className="absolute top-8 right-8 text-gray-300 hover:text-secondary transition-colors"
                    >
                      <X size={24} />
                    </button>
                    
                    <h3 className="text-3xl font-black text-secondary italic uppercase tracking-tight mb-2">Share Your Experience</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-10">We value your honest feedback</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Your Name"
                          className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary"
                          value={formData.user_name}
                          onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFormData({...formData, rating: star})}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                formData.rating >= star ? 'bg-primary text-secondary shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-300'
                              }`}
                            >
                              <Star size={20} fill={formData.rating >= star ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Your Feedback</label>
                        <textarea 
                          required
                          rows={4}
                          placeholder="Tell us about the service, vehicle quality..."
                          className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary"
                          value={formData.comment}
                          onChange={(e) => setFormData({...formData, comment: e.target.value})}
                        />
                      </div>
                      
                      <button 
                        type="submit"
                        className="w-full bg-secondary text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-secondary/20 group mt-4"
                      >
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
