'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, User, Lock, ArrowRight, Car, KeyRound, CheckCircle2, AlertCircle, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { vehicleService } from '@/services/vehicleService'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const admin = await vehicleService.adminLogin(username, password)
      if (admin) {
        // Use Cookies for secure session management (accessible by middleware)
        import('js-cookie').then((Cookies) => {
          Cookies.default.set('admin_session', JSON.stringify({
            id: admin.id,
            name: admin.name,
            username: admin.username,
            role: 'admin',
            timestamp: Date.now()
          }), { expires: 1, secure: true, sameSite: 'strict' })
          
          router.push('/admin')
        })
      } else {
        setError('Invalid Phone Number or Password')
      }
    } catch (err) {
      setError('An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  const handlePinVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === "167426") {
      setMode('reset')
      setError('')
    } else {
      setError('Incorrect Recovery PIN')
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await vehicleService.resetAdminPassword(username, newPassword, pin)
      setSuccess('Password changed successfully!')
      setTimeout(() => {
        setMode('login')
        setSuccess('')
        setPassword('')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
           <div className="bg-primary w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <ShieldCheck size={40} className="text-secondary" />
           </div>
           <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              Admin <span className="text-primary underline decoration-4 underline-offset-4">Portal</span>
           </h1>
           <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-loose">
             Friends Car Baazr <br /> Authorized Access Terminal
           </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
           {/* Success Overlay */}
           <AnimatePresence>
             {success && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-primary z-50 flex flex-col items-center justify-center text-secondary text-center p-10"
               >
                 <CheckCircle2 size={64} className="mb-4" />
                 <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Success!</h3>
                 <p className="font-bold">{success}</p>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="space-y-6">
             {error && (
               <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold"
               >
                 <AlertCircle size={18} /> {error}
               </motion.div>
             )}

             <AnimatePresence mode="wait">
               {mode === 'login' && (
                 <motion.form 
                   key="login"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   onSubmit={handleLogin} 
                   className="space-y-6"
                 >
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Phone Number</label>
                       <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            required
                            type="tel" 
                            placeholder="98495 XXXXX"
                            className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-white placeholder-gray-600 transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Security Key</label>
                       <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            required
                            type="password" 
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-white placeholder-gray-600 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                       </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-secondary py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                      {loading ? 'Authenticating...' : <><KeyRound /> Unlock Dashboard</>}
                    </button>

                    <button 
                      type="button" 
                      onClick={() => setMode('forgot')}
                      className="w-full text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-primary transition-colors"
                    >
                       Forgot Password? Reset via PIN
                    </button>
                 </motion.form>
               )}

               {mode === 'forgot' && (
                 <motion.form 
                   key="forgot"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   onSubmit={handlePinVerify}
                   className="space-y-6"
                 >
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Authorized Phone</label>
                       <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            required
                            type="tel" 
                            placeholder="Enter your phone number"
                            className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-white placeholder-gray-600 transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">6-Digit Recovery PIN</label>
                       <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            required
                            type="password" 
                            maxLength={6}
                            placeholder="••••••"
                            className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-white placeholder-gray-600 tracking-[0.5em] transition-all text-center"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                          />
                       </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-primary text-secondary py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl"
                    >
                       Verify Identity
                    </button>

                    <button 
                      type="button" 
                      onClick={() => setMode('login')}
                      className="w-full text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-primary transition-colors"
                    >
                       Back to Login
                    </button>
                 </motion.form>
               )}

               {mode === 'reset' && (
                 <motion.form 
                    key="reset"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleReset}
                    className="space-y-6"
                 >
                    <div className="space-y-2">
                       <p className="bg-primary/10 text-primary p-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest border border-primary/20 mb-4">
                          Identity Verified - Create New Key
                       </p>
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">New Security Key</label>
                       <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input 
                            required
                            type="password" 
                            placeholder="Minimum 8 characters"
                            className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-white placeholder-gray-600 transition-all"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                       </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-500 text-white py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl"
                    >
                       {loading ? 'Changing...' : 'Update & Continue'}
                    </button>
                 </motion.form>
               )}
             </AnimatePresence>
           </div>

           <div className="pt-6 border-t border-white/5 text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                 Friends Car Baazr Terminal v2.1
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  )
}
