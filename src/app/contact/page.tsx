'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col pt-20">
      <main className="flex-grow pt-20 pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 text-primary px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-6 inline-block"
            >
              Get In Touch
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-7xl font-black text-white tracking-tighter italic uppercase"
            >
              Contact Us
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 font-medium mt-4 max-w-xl mx-auto"
            >
              Have questions or ready to find your dream car? Reach out to our team in Khammam today.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all">
                  <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center text-secondary mb-6">
                    <Phone size={24} fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase mb-2">Call Younus</h3>
                  <a href="tel:+919849575114" className="text-primary font-bold text-lg hover:underline">+91 98495 75114</a>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all">
                  <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6">
                    <Phone size={24} fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase mb-2">Call Satya</h3>
                  <a href="tel:+919949904505" className="text-blue-400 font-bold text-lg hover:underline">+91 99499 04505</a>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem]">
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="bg-primary/20 p-4 rounded-xl text-primary shrink-0">
                      <MapPin size={28} />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">Showroom Address</h4>
                      <p className="text-gray-400 font-bold italic">
                        Near Kotta Busstand, RR Public School Beside,<br />
                        Bypassroad Khammam, Telangana
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="bg-primary/20 p-4 rounded-xl text-primary shrink-0">
                      <Mail size={28} />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">Email Us</h4>
                      <a href="mailto:friendscarbazaar@gmail.com" className="text-gray-400 font-bold italic hover:text-primary transition-colors">
                        friendscarbazaar@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="bg-primary/20 p-4 rounded-xl text-primary shrink-0 h-fit">
                      <MessageCircle size={28} />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">WhatsApp Support</h4>
                      <p className="text-gray-400 font-bold italic mb-6">Chat with us for instant details</p>
                      <div className="flex flex-wrap gap-4">
                        <a 
                          href="https://wa.me/919849575114" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-primary text-secondary px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                          Chat (114)
                        </a>
                        <a 
                          href="https://wa.me/919949904505" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                          Chat (505)
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-secondary font-black text-[10px] uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-secondary font-black text-[10px] uppercase tracking-widest ml-1">Phone Number</label>
                    <input type="tel" placeholder="+91 00000 00000" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-secondary font-black text-[10px] uppercase tracking-widest ml-1">Interested In</label>
                  <select className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold text-sm appearance-none">
                    <option>Buying a Car</option>
                    <option>Buying a Bike</option>
                    <option>Financing Options</option>
                    <option>Other Inquiry</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-secondary font-black text-[10px] uppercase tracking-widest ml-1">Message</label>
                  <textarea rows={4} placeholder="Tell us what you're looking for..." className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold text-sm resize-none"></textarea>
                </div>
                <button className="w-full bg-secondary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all">
                  Send Message <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
