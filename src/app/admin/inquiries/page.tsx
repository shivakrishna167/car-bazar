'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, MessageCircle, Phone, CheckCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { vehicleService, Inquiry } from '@/services/vehicleService'

export default function AdminInquiries() {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    const session = Cookies.get('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
    setHasSession(true)
    loadInquiries()
  }, [router])

  async function loadInquiries() {
    setLoading(true)
    try {
      const data = await vehicleService.getInquiries()
      setInquiries(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const markAsReplied = async (id: string) => {
    try {
      await vehicleService.markInquiryReplied(id)
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status: 'replied' } : i))
    } catch (err) {
      console.error(err)
      alert("Failed to update status")
    }
  }

  const handleWhatsAppReply = (inquiry: Inquiry) => {
    // Format the phone number: remove spaces and extra characters, ensure it starts with country code if possible
    let cleanPhone = inquiry.phone.replace(/[\s\-\(\)]/g, '')
    if (!cleanPhone.startsWith('+91') && cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone
    }
    
    // Create a pre-filled message
    const message = `Hello ${inquiry.full_name}, this is Friends Car Bazar. We received your inquiry regarding "${inquiry.interested_in}". How can we help you today?`
    
    // Open WhatsApp
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank')
    
    // Mark as replied
    if (inquiry.status === 'new') {
      markAsReplied(inquiry.id)
    }
  }

  if (!hasSession || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Inquiries...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-secondary text-white py-16 border-b-8 border-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/admin" className="inline-flex items-center gap-2 text-primary font-bold text-xs mb-8 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
             <div className="bg-primary p-4 rounded-2xl text-secondary">
               <MessageCircle size={32} />
             </div>
             <div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tight">Customer <span className="text-primary">Inquiries</span></h1>
               <p className="text-gray-400 font-medium mt-2">Manage and reply to messages from the contact form</p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 space-y-6">
        {inquiries.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-black text-secondary mb-2">No Inquiries Yet</h3>
            <p className="text-gray-500 font-medium">When customers fill out the contact form, their messages will appear here.</p>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={inquiry.id} 
              className={`bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border transition-all ${inquiry.status === 'new' ? 'border-primary/50' : 'border-gray-100'}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-secondary">{inquiry.full_name}</h3>
                    {inquiry.status === 'new' ? (
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">New</span>
                    ) : (
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle size={10} /> Replied
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm font-bold">
                    <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                      <Phone size={16} /> {inquiry.phone}
                    </a>
                    <span className="text-gray-300">•</span>
                    <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                      {inquiry.interested_in}
                    </span>
                    {inquiry.created_at && (
                       <>
                         <span className="text-gray-300">•</span>
                         <span className="text-gray-400">
                           {new Date(inquiry.created_at).toLocaleDateString()}
                         </span>
                       </>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl relative">
                    <MessageCircle className="absolute top-6 left-6 text-gray-300" size={24} />
                    <p className="pl-10 text-gray-600 font-medium leading-relaxed italic">
                      "{inquiry.message}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:w-48 shrink-0">
                  <button 
                    onClick={() => handleWhatsAppReply(inquiry)}
                    className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-green-500/20"
                  >
                    Reply on WhatsApp
                  </button>
                  {inquiry.status === 'new' && (
                    <button 
                      onClick={() => markAsReplied(inquiry.id)}
                      className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
