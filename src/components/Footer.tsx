import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Car, Heart, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-24 pb-28 md:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <Link href="/" className="flex flex-col gap-4 group">
              <div className="bg-white p-2 rounded-xl shadow-lg w-fit">
                <img 
                  src="/logo.png" 
                  alt="Friends Car Bazar" 
                  className="h-16 w-auto object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                ఫ్రెండ్స్ కార్ బజార్
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed font-medium italic">
              Khammam&apos;s most trusted destination for premium pre-owned cars and bikes. Transparency and trust in every deal.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/friends_car_bazaar" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-2xl hover:bg-primary hover:text-secondary transition-all shadow-xl">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com/friends_car_bazaar" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-2xl hover:bg-primary hover:text-secondary transition-all shadow-xl">
                <Instagram size={20} />
              </a>
              <a href="mailto:friendscarbazaar@gmail.com" className="bg-white/5 p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl">
                <Mail size={20} />
              </a>
              <a href="https://wa.me/919949904505" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-2xl hover:bg-[#25D366] hover:text-white transition-all shadow-xl">
                <MessageSquare size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-black mb-8 text-xs uppercase tracking-[0.2em] italic">Navigation</h3>
            <ul className="space-y-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
              <li><Link href="/" className="hover:text-primary transition-colors flex items-center gap-2">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2">About Us</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors flex items-center gap-2">Our Services</Link></li>
              <li><Link href="/listings" className="hover:text-primary transition-colors flex items-center gap-2">Inventory</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2 text-primary">Contact Us</Link></li>
            </ul>
          </div>

          {/* Quick Contact */}
          <div>
            <h3 className="text-white font-black mb-8 text-xs uppercase tracking-[0.2em] italic">Quick Contact</h3>
            <ul className="space-y-6 text-gray-400">
              <li className="flex gap-4">
                <MapPin className="text-primary shrink-0" size={20} />
                <span className="font-bold text-[11px] leading-relaxed uppercase tracking-wider italic">
                  Near Kotta Busstand, RR Public School Beside, Bypassroad Khammam
                </span>
              </li>
              <li className="space-y-5">
                <a href="tel:+919849575114" className="flex gap-4 items-center group">
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-primary transition-colors">
                    <Phone className="text-primary group-hover:text-secondary" size={16} fill="currentColor" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest leading-none mb-1">Syed Younus</span>
                    <span className="font-black text-white text-sm tracking-tight italic">9849575114</span>
                  </div>
                </a>
                <a href="tel:+919949904505" className="flex gap-4 items-center group">
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <Phone className="text-primary group-hover:text-white" size={16} fill="currentColor" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest leading-none mb-1">P. Satyanarayana</span>
                    <span className="font-black text-white text-sm tracking-tight italic">9949904505</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Trust Badge */}
          <div>
            <h3 className="text-white font-black mb-8 text-xs uppercase tracking-[0.2em] italic">Showroom Hours</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Mon - Sat</span>
                <span className="font-black text-primary text-xs italic">9 AM - 8 PM</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Sunday</span>
                <span className="font-black text-red-500 text-xs italic uppercase">Closed</span>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
                 <div className="bg-primary/20 p-3 rounded-full text-primary">
                    <Heart size={20} fill="currentColor" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-gray-500">
                   Voted #1 pre-owned car market in Khammam
                 </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-8">
          <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] text-center md:text-left">
            &copy; {new Date().getFullYear()} Friends Car Bazar. All Rights Reserved.
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8 bg-white/5 px-6 md:pl-4 md:pr-10 py-7 md:py-5 rounded-[2rem] md:rounded-[3rem] border border-white/5 group hover:border-primary/30 transition-all shadow-2xl w-full md:w-auto">
            <div className="relative w-28 h-36 md:w-32 md:h-44 rounded-xl md:rounded-2xl overflow-hidden border-2 border-primary/50 shadow-xl ring-2 md:ring-4 ring-white/5">
              <img 
                src="/images/shiva_v2.jpg" 
                alt="Shiva Krishna" 
                className="w-full h-full object-cover scale-[1.0] transition-transform duration-700"
              />
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1 md:mb-2 bg-white/5 px-3 py-1 rounded-full">Developed By</span>
              <span className="text-lg md:text-2xl font-black text-white tracking-tighter uppercase group-hover:text-primary transition-colors leading-tight">PASUPULETI SHIVA KRISHNA</span>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-2 md:mt-3">
                <a href="tel:+919014334144" className="text-primary font-black tracking-widest text-[12px] md:text-sm flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <span className="text-white/30 text-[8px] md:text-[9px] font-normal uppercase">Contact:</span> 9014334144
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
