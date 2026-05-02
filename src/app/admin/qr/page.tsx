'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QrCode, ArrowLeft, Download, Printer, ExternalLink, ShieldCheck, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function QRCodesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const baseUrl = 'https://car-bazar-two.vercel.app'

  useEffect(() => {
    setMounted(true)
    const session = Cookies.get('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
  }, [router])

  if (!mounted) return null

  const qrCodes = [
    {
      title: 'Customer Website',
      description: 'Scan this to open the main car bazar website',
      url: baseUrl,
      icon: User,
      color: 'bg-primary'
    },
    {
      title: 'Admin Dashboard',
      description: 'Scan this to access the management panel',
      url: `${baseUrl}/admin`,
      icon: ShieldCheck,
      color: 'bg-secondary'
    }
  ]

  const handlePrint = (title: string, url: string) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}`
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${title}</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 50px; }
              img { width: 400px; margin: 20px; }
              h1 { font-size: 24px; margin-bottom: 10px; }
              p { color: #666; margin-bottom: 30px; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <h1>FRIENDS CAR BAZAR</h1>
            <h2>${title}</h2>
            <p>${url}</p>
            <img src="${qrImageUrl}" alt="QR Code" />
            <p>Scan to visit our website</p>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-secondary text-white py-12 border-b-8 border-primary shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-bold mb-6 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-secondary shadow-lg">
              <QrCode size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">QR <span className="text-primary">Codes</span></h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Generate and Print Access Codes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {qrCodes.map((qr) => (
            <motion.div 
              key={qr.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="p-8 text-center flex-grow flex flex-col items-center justify-center">
                <div className={`${qr.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  <qr.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-secondary mb-2 uppercase">{qr.title}</h3>
                <p className="text-gray-500 font-semibold mb-8 text-sm">{qr.description}</p>
                
                <div className="relative group">
                  <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] blur-xl group-hover:bg-primary/20 transition-all" />
                  <div className="relative bg-white p-4 rounded-3xl border-4 border-secondary shadow-inner">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qr.url)}`}
                      alt={qr.title}
                      className="w-48 h-48 md:w-64 md:h-64"
                    />
                  </div>
                </div>
                
                <div className="mt-8 text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full">
                  {qr.url}
                </div>
              </div>
              
              <div className="grid grid-cols-2 border-t border-gray-100">
                <button 
                  onClick={() => handlePrint(qr.title, qr.url)}
                  className="flex items-center justify-center gap-2 py-6 font-black text-xs uppercase tracking-widest text-secondary hover:bg-primary/10 transition-all border-r border-gray-100"
                >
                  <Printer size={18} /> Print QR
                </button>
                <a 
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(qr.url)}&download=1`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 py-6 font-black text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-secondary transition-all"
                >
                  <Download size={18} /> Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-secondary text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <QrCode size={120} />
          </div>
          <div className="relative z-10">
            <h4 className="text-xl font-black uppercase mb-2">How to use?</h4>
            <p className="text-gray-400 font-semibold text-sm leading-relaxed max-w-2xl">
              You can print these QR codes and stick them at your office or dealership. 
              Customers can scan the <span className="text-primary font-bold">User Website</span> code to browse your cars, 
              and you can scan the <span className="text-primary font-bold">Admin Dashboard</span> code to quickly manage your listings from your phone!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
