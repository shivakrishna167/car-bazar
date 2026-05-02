'use client'

import Link from 'next/link'
import { Car, Menu, X, Phone, Heart, ShieldCheck, Home, Info, Briefcase, PhoneCall, LogIn, Bike, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Cookies from 'js-cookie'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Cleanup old localStorage session (migration to cookies)
    if (typeof window !== 'undefined' && localStorage.getItem('admin_session')) {
      localStorage.removeItem('admin_session')
    }

    // Initial check for cookie on client side
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

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Cars for Sale', href: '/listings?type=car', icon: Car },
    { name: 'Bikes', href: '/listings?type=bike', icon: Bike },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Contact', href: '/contact', icon: PhoneCall },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin', icon: ShieldCheck }] : []),
  ]

  return (
    <>
    {/* Main Navbar */}
    <nav className="bg-secondary text-white fixed top-0 left-0 right-0 h-24 z-[60] shadow-2xl flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
                <div className="bg-white p-1 rounded-lg shadow-inner ring-1 ring-white/10 overflow-hidden">
                  <img 
                    src="/logo.png" 
                    alt="Friends Car Bazar" 
                    className="h-12 md:h-16 w-auto object-contain"
                  />
                </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-gray-200 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2"
              >
                {link.name === 'Wishlist' && <Heart size={14} className="fill-primary text-primary" />}
                {link.name === 'Admin' && <ShieldCheck size={14} className="text-primary" />}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-4 -mr-4 text-white hover:text-primary transition-all active:scale-95 relative z-[70]"
            aria-label="Open Menu"
          >
            <div className="p-2 border-2 border-white/20 rounded-xl bg-secondary/50">
               <Menu size={32} />
            </div>
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    <div 
      className={`fixed inset-0 z-[100] bg-secondary flex flex-col transition-all duration-500 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } lg:hidden`}
    >
        {/* Header inside mobile menu */}
        <div className="p-8 flex justify-between items-center">
          <div className="bg-white p-1.5 rounded-xl shadow-lg">
            <img 
              src="/logo.png" 
              alt="Friends Car Bazar" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-primary hover:text-secondary transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Links Area */}
        <div className="flex-1 overflow-y-auto px-10 py-10 flex flex-col gap-12">
          <div>
            <h3 className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em] italic mb-8 border-b border-white/5 pb-4">
              Navigation
            </h3>
            <div className="flex flex-col gap-4">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between bg-white/5 p-6 rounded-3xl active:bg-primary active:text-secondary transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="bg-white/10 p-3 rounded-xl group-active:bg-secondary/20">
                        <link.icon size={24} className="text-primary group-active:text-secondary" />
                      </div>
                      <span className="text-xl font-black uppercase tracking-tight text-white group-active:text-secondary">
                        {link.name}
                      </span>
                    </div>
                    <ArrowRight size={20} className="text-gray-600 group-active:text-secondary" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
              ఫ్రెండ్స్ కార్ బజార్ <br />
              Khammam's Most Trusted Dealer
            </p>
          </div>
        </div>
    </div>
    
    {/* Spacer for fixed header */}
    <div className="h-24" />
    </>
  )
}
