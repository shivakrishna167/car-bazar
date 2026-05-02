'use client'

import { motion } from 'framer-motion'
import { Car, Zap, ShieldCheck, Clock, Wallet, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ServicesPage() {
  const services = [
    {
      title: "Buy With Confidence",
      description: "Every vehicle undergoes a 125-point quality inspection to ensure you get only the best showroom-quality cars and bikes.",
      icon: ShieldCheck,
      color: "bg-blue-600",
      textColor: "text-blue-600"
    },
    {
      title: "Easy Financing",
      description: "Low interest rates and instant approval options from leading banks. We handle all the paperwork for your smooth purchase.",
      icon: Wallet,
      color: "bg-primary",
      textColor: "text-secondary"
    },
    {
      title: "RC Transfer Support",
      description: "Complete assistance for hassle-free registration and ownership transfer. We ensure all legal documentation is perfect.",
      icon: FileText,
      color: "bg-blue-600",
      textColor: "text-blue-600"
    },
    {
      title: "Exchange Offers",
      description: "Best market value for your old vehicle. Exchange your car or bike with us for a newer model instantly.",
      icon: Zap,
      color: "bg-primary",
      textColor: "text-secondary"
    },
    {
      title: "After-Sales Checkup",
      description: "Complimentary service checks for the first month to ensure your vehicle is performing at its absolute best.",
      icon: Clock,
      color: "bg-blue-600",
      textColor: "text-blue-600"
    },
    {
      title: "Custom Sourcing",
      description: "Looking for something specific? We will find the exact car or bike model you want within 7 days.",
      icon: Car,
      color: "bg-primary",
      textColor: "text-secondary"
    }
  ]

  return (
    <div className="min-h-screen bg-secondary flex flex-col pt-20">
      <main className="flex-grow pt-20 pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 text-primary px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-6 inline-block"
            >
              How We Help
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-7xl font-black text-white tracking-tighter italic uppercase mb-8"
            >
              Premium <span className="text-primary italic">Services</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed"
            >
              Beyond just selling vehicles, we provide a complete ecosystem of support to make your ownership journey seamless and joyful.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {services.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] hover:bg-white/10 transition-all group"
              >
                <div className={`${service.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-black/20 group-hover:scale-110 transition-transform`}>
                  <service.icon size={36} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase mb-4 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-400 font-medium leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="bg-primary p-12 md:p-20 rounded-[4rem] text-secondary overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-black/5 -skew-x-12 translate-x-1/2"></div>
            <div className="max-w-3xl relative z-10">
              <h2 className="text-3xl sm:text-6xl font-black italic uppercase tracking-tighter mb-8 leading-none">
                Ready to Experience<br />Our Service?
              </h2>
              <p className="text-xl font-bold mb-10 leading-relaxed italic">
                Join 1000+ happy customers in Khammam. Let us handle everything while you enjoy your new ride.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link href="/contact" className="bg-secondary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-2xl">
                  Get Started <ArrowRight size={18} />
                </Link>
                <a href="tel:+919849575114" className="border-4 border-secondary/20 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-secondary hover:text-white transition-all">
                  Call Showroom
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
