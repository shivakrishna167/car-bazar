'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Trophy, Users, MapPin, Phone, MessageSquare, ArrowRight, Heart } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const owners = [
    {
      name: "Syed Younus",
      phone: "9849575114",
      role: "Founder & Managing Director",
      experience: "25+ Years in Automobile Industry",
      initials: "SY"
    },
    {
      name: "P. Satyanarayana",
      phone: "9949904505",
      role: "Managing Partner",
      experience: "20+ Years in Customer Relations",
      initials: "PS"
    }
  ]

  return (
    <div className="min-h-screen bg-secondary flex flex-col pt-20">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-secondary">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,204,0,0.05),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-8 shadow-xl"
           >
              <Heart size={16} className="text-primary" fill="currentColor" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Our Story & Legacy</span>
           </motion.div>
           
           <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 italic uppercase leading-[0.9]">
             Khammam&apos;s Trusted <br />
             <span className="text-primary italic">Auto Marketplace</span>
           </h1>
           
           <p className="max-w-3xl mx-auto text-gray-400 text-xl font-medium leading-relaxed italic">
             Friends Car Baazr has been the heart of Khammam&apos;s second-hand vehicle market for decades. Founded with a vision to provide transparent, quality-certified vehicles to our community.
           </p>
        </div>
      </section>

      {/* Meet the Owners */}
      <section className="py-20 sm:py-32 bg-white rounded-[3rem] sm:rounded-[5rem] -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16 sm:mb-24">
            <span className="bg-blue-100 text-blue-600 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-6 inline-block">Our Leadership</span>
            <h2 className="text-4xl sm:text-7xl font-black text-secondary tracking-tighter italic uppercase">Meet the Experts</h2>
            <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[9px] sm:text-[10px]">Directly handling every customer since day one</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {owners.map((owner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-[3.5rem] p-12 border border-gray-100 flex flex-col items-center text-center shadow-2xl shadow-gray-200/50 hover:scale-[1.02] transition-all group"
              >
                <div className="w-32 h-32 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black italic shadow-2xl shadow-blue-600/30 mb-8 shrink-0">
                  {owner.initials}
                </div>
                
                <h3 className="text-3xl font-black text-secondary italic uppercase tracking-tight mb-2">
                  {owner.name}
                </h3>
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
                  {owner.role}
                </p>
                
                <div className="h-1 w-12 bg-gray-100 mb-8 rounded-full" />
                
                <p className="text-gray-500 font-medium mb-10 text-lg leading-relaxed italic">
                  {owner.experience}
                </p>
                
                <div className="flex flex-col w-full gap-3 mt-auto">
                   <a 
                     href={`tel:+91${owner.phone}`}
                     className="bg-secondary text-white w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl"
                   >
                     <Phone size={16} fill="currentColor" /> Call Showroom
                   </a>
                   <a 
                     href={`https://wa.me/91${owner.phone}`}
                     className="bg-primary text-secondary w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all shadow-lg"
                   >
                     <MessageSquare size={16} fill="currentColor" /> WhatsApp Chat
                   </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Stats */}
      <section className="bg-secondary py-32 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-16 text-center relative z-10">
            <div className="space-y-4">
               <Trophy size={48} className="text-primary mx-auto mb-2" />
               <h4 className="text-5xl font-black text-white italic tracking-tighter leading-none">25+</h4>
               <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Years Excellence</p>
            </div>
            <div className="space-y-4">
               <ShieldCheck size={48} className="text-primary mx-auto mb-2" />
               <h4 className="text-5xl font-black text-white italic tracking-tighter leading-none">5000+</h4>
               <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Happy Customers</p>
            </div>
            <div className="space-y-4">
               <Users size={48} className="text-primary mx-auto mb-2" />
               <h4 className="text-5xl font-black text-white italic tracking-tighter leading-none">100%</h4>
               <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Trust Rating</p>
            </div>
            <div className="space-y-4">
               <MapPin size={48} className="text-primary mx-auto mb-2" />
               <h4 className="text-5xl font-black text-white italic tracking-tighter leading-none">Local</h4>
               <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Serving Khammam</p>
            </div>
         </div>
      </section>

      {/* Meet the Developer */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-secondary rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-16 flex flex-col md:flex-row items-center gap-12 sm:gap-20 relative overflow-hidden shadow-3xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -mr-20" />
            
            <div className="relative group shrink-0">
               <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl group-hover:bg-primary/40 transition-all duration-700" />
               <div className="relative w-48 h-64 sm:w-64 sm:h-80 rounded-[2.5rem] overflow-hidden border-2 border-primary/50 shadow-2xl ring-4 ring-white/5">
                  <img 
                    src="/images/shiva_v2.jpg" 
                    alt="Pasupuleti Shiva Krishna" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
               </div>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left relative z-10">
               <motion.span 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 className="bg-primary/20 text-primary px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.3em] mb-6"
               >
                 Platform Architect
               </motion.span>
               <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter italic uppercase mb-4 leading-tight">
                 PASUPULETI<br />
                 <span className="text-primary italic">SHIVA KRISHNA</span>
               </h2>
               <p className="text-gray-400 font-medium text-lg sm:text-xl max-w-xl leading-relaxed italic mb-8">
                 Bridging the gap between Khammam&apos;s traditional car bazaar and modern digital excellence. Crafting a seamless experience for every car buyer.
               </p>
               
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <a href="tel:+919014334144" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 border border-white/10">
                     Contact Developer <ArrowRight size={18} className="text-primary" />
                  </a>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-32 bg-white pb-48">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <div className="bg-gray-50 p-16 md:p-24 rounded-[4rem] border border-gray-100 shadow-3xl">
              <span className="text-primary text-6xl font-black block mb-8">“</span>
              <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase italic tracking-tight mb-8 leading-tight">Our Mission</h2>
              <p className="text-2xl text-gray-400 font-medium leading-relaxed italic mb-12">
                To bridge the gap between automobile dreams and reality for every family in Khammam, by providing the highest quality certified vehicles with honest pricing and lifetime relationship.
              </p>
              <Link 
                href="/listings" 
                className="inline-flex items-center gap-4 bg-primary text-secondary px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl shadow-primary/20"
              >
                Explore Inventory <ArrowRight size={20} />
              </Link>
           </div>
        </div>
      </section>
    </div>
  )
}
