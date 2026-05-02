'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Car, Bike, Upload, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import { vehicleService } from '@/services/vehicleService'

export default function AddVehiclePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const session = Cookies.get('admin_session')
    if (!session) {
      router.push('/admin/login')
    }
  }, [router])

  const [formData, setFormData] = useState<{
    type: 'car' | 'bike';
    make: string;
    model: string;
    year: number;
    price: string;
    mileage: string;
    fuel: string;
    transmission: string;
    description: string;
    district: string;
    location: string;
    status: 'available' | 'sold';
    image_url: string;
    image_urls: string[];
  }>({
    type: 'car',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuel: 'Petrol',
    transmission: 'Manual',
    description: '',
    district: 'Khammam',
    location: '',
    status: 'available' as const,
    image_url: '',
    image_urls: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const priceNum = parseFloat(formData.price)
    const mileageNum = parseInt(formData.mileage)

    if (isNaN(priceNum) || isNaN(mileageNum)) {
      alert('Please enter valid numeric values for price and mileage')
      return
    }

    setLoading(true)
    
    try {
      const sessionData = JSON.parse(Cookies.get('admin_session') || '{}')
      const seller_id = sessionData.id

      await vehicleService.addVehicle({
        ...formData,
        price: priceNum,
        mileage: mileageNum,
        image_url: formData.image_urls[0] || undefined,
        image_urls: formData.image_urls,
        seller_id: seller_id
      })
      alert('Vehicle published successfully!')
      router.push('/admin')
    } catch (err: any) {
      console.error(err)
      alert(`Failed to publish listing: ${err.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-secondary text-white py-16 border-b-8 border-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Link href="/admin" className="inline-flex items-center gap-2 text-primary font-bold text-xs mb-8 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Add New <span className="text-primary">Listing</span></h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 space-y-10">
          
          {/* Vehicle Type Toggle */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'car'})}
              className={`flex-1 py-6 rounded-2xl font-bold border-2 transition-all flex items-center justify-center gap-4 ${
                formData.type === 'car' ? 'bg-secondary text-primary border-primary shadow-xl' : 'bg-white text-gray-400 border-gray-100 hover:border-primary/20'
              }`}
            >
              <Car size={32} /> Car
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'bike'})}
              className={`flex-1 py-6 rounded-2xl font-bold border-2 transition-all flex items-center justify-center gap-4 ${
                formData.type === 'bike' ? 'bg-secondary text-primary border-primary shadow-xl' : 'bg-white text-gray-400 border-gray-100 hover:border-primary/20'
              }`}
            >
              <Bike size={32} /> Bike
            </button>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Make / Brand</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Hyundai, Honda..."
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary"
                  value={formData.make}
                  onChange={(e) => setFormData({...formData, make: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Model Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Creta, Activa..."
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Year of Manufacture</label>
                <input 
                  required
                  type="number" 
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({...formData, year: e.target.value === '' ? new Date().getFullYear() : parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Asking Price (₹)</label>
                <input 
                  required
                  type="number" 
                  placeholder="Ex: 500000"
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Kilometers Driven</label>
                <input 
                  required
                  type="number" 
                  placeholder="Ex: 12000"
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary"
                  value={formData.mileage}
                  onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  {formData.type === 'car' ? 'Fuel Type' : 'Engine CC / Type'}
                </label>
                {formData.type === 'car' ? (
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary appearance-none"
                    value={formData.fuel}
                    onChange={(e) => setFormData({...formData, fuel: e.target.value})}
                  >
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                    <option>Electric</option>
                  </select>
                ) : (
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. 150cc, Electric"
                    className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary"
                    value={formData.fuel}
                    onChange={(e) => setFormData({...formData, fuel: e.target.value})}
                  />
                )}
              </div>

              {formData.type === 'car' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Transmission</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary appearance-none"
                    value={formData.transmission}
                    onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                  >
                    <option>Manual</option>
                    <option>Automatic</option>
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Telangana District</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary appearance-none"
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                >
                  {['Khammam', 'Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Nalgonda', 'Mahbubnagar', 'Adilabad', 'Suryapet', 'Siddipet', 'Medak'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Town / Area</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Near Kottha Busstand"
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block">Vehicle Images</label>
              
              <div className="flex flex-wrap gap-4">
                {formData.image_urls.map((url, index) => (
                  <div key={index} className="relative w-32 h-32 rounded-2xl overflow-hidden group shadow-xl border-4 border-white">
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const newUrls = [...formData.image_urls];
                        newUrls.splice(index, 1);
                        setFormData({...formData, image_urls: newUrls});
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <X size={14} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-secondary text-[10px] font-black uppercase text-center py-1">Cover Image</div>
                    )}
                  </div>
                ))}
                
                <label className="w-32 h-32 rounded-2xl border-4 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files
                      if (!files || files.length === 0) return
                      
                      try {
                        setLoading(true)
                        const uploadPromises = Array.from(files).map(file => vehicleService.uploadImage(file))
                        const urls = await Promise.all(uploadPromises)
                        
                        setFormData({
                          ...formData, 
                          image_urls: [...formData.image_urls, ...urls]
                        })
                        alert('Images uploaded successfully!')
                      } catch (err: any) {
                        console.error(err)
                        alert(`Upload failed: ${err.message}`)
                      } finally {
                        setLoading(false)
                      }
                    }}
                  />
                  <Upload size={32} className="text-gray-300 group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-black text-gray-400 uppercase">Upload</span>
                </label>
              </div>
              <p className="text-[10px] text-gray-400 italic font-medium">Tip: Use a horizontal (landscape) photo for best look.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Detailed Description</label>
              <textarea 
                rows={4}
                placeholder="Tell more about the vehicle condition, owner history..."
                className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold text-secondary"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center">
             <button
               type="submit"
               disabled={loading}
               className="w-full md:flex-1 bg-primary text-secondary py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
             >
               {loading ? 'Saving...' : <><Save /> Publish Listing</>}
             </button>
             <Link 
               href="/admin" 
               className="w-full md:w-auto px-12 py-6 rounded-2xl font-bold text-gray-400 hover:bg-gray-100 transition-all text-center"
             >
               Cancel
             </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
