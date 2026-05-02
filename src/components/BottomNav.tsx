'use client'

import { useState, useEffect } from 'react'
import { Home, Search, MessageSquare, Menu, Heart, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Cookies from 'js-cookie'

export default function BottomNav() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const sessionStr = Cookies.get('admin_session')
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr)
        if (session.role === 'admin') setIsAdmin(true)
      } catch (e) {
        console.error('Invalid session format')
      }
    }
  }, [])

  const [showWhatsApp, setShowWhatsApp] = useState(false)

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Explore', href: '/listings' },
    { icon: MessageSquare, label: 'WhatsApp', isWhatsApp: true },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    ...(isAdmin ? [{ icon: ShieldCheck, label: 'Admin', href: '/admin' }] : []),
  ]

  const admins = [
    { name: 'Syed Younus', number: '919849575114', color: 'bg-primary' },
    { name: 'Satyanarayana', number: '919949904505', color: 'bg-blue-600' }
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60]">
      {/* WhatsApp Selection Menu */}
      <AnimatePresence>
        {showWhatsApp && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWhatsApp(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[61]"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="absolute bottom-28 left-6 right-6 bg-secondary/95 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 z-[62] shadow-3xl"
            >
              <h3 className="text-white font-black uppercase italic tracking-widest text-xs mb-6 text-center">Contact Admin</h3>
              <div className="space-y-4">
                {admins.map((admin) => (
                  <a 
                    key={admin.number}
                    href={`https://wa.me/${admin.number}`}
                    className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors group"
                  >
                    <div className={`${admin.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                      <MessageSquare size={20} fill="currentColor" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-none mb-1">WhatsApp</span>
                      <span className="text-white font-black italic uppercase tracking-tight">{admin.name}</span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Nav Container */}
      <div className="bg-secondary/80 backdrop-blur-xl border-t border-white/10 px-6 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] relative z-[63]">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href
            
            if (item.isWhatsApp) {
              return (
                <button 
                  key="whatsapp-btn"
                  onClick={() => setShowWhatsApp(!showWhatsApp)}
                  className="relative flex flex-col items-center gap-1 group active:scale-90 transition-transform"
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    showWhatsApp ? 'bg-primary text-secondary scale-110 shadow-[0_0_20px_rgba(255,204,0,0.3)]' : 'text-gray-400 group-hover:text-white'
                  }`}>
                    <item.icon size={22} strokeWidth={showWhatsApp ? 3 : 2} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                    showWhatsApp ? 'text-primary' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </button>
              )
            }

            return (
              <Link 
                key={item.href} 
                href={item.href || '#'}
                className="relative flex flex-col items-center gap-1 group active:scale-90 transition-transform"
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-primary text-secondary scale-110 shadow-[0_0_20px_rgba(255,204,0,0.3)]' : 'text-gray-400 group-hover:text-white'
                }`}>
                  <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute -top-4 w-8 h-8 bg-primary/20 rounded-full blur-xl"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
