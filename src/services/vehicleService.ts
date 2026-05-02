import { supabase } from '@/lib/supabase'

export interface Vehicle {
  id: string
  type: 'car' | 'bike'
  make: string
  model: string
  year: number
  price: number
  mileage: number
  image_url?: string
  image_urls?: string[]
  description?: string
  status: 'available' | 'sold'
  fuel?: string
  transmission?: string
  district?: string
  location?: string
  seller_id?: string
  created_at?: string
}

export interface Offer {
  id: string
  title: string
  description: string
  discount_text: string
  is_active: boolean
  created_at?: string
}

export interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  is_approved: boolean
  created_at?: string
}

export interface Inquiry {
  id: string
  full_name: string
  phone: string
  interested_in: string
  message: string
  status: 'new' | 'replied'
  created_at?: string
}

export interface SaleRecord {
  id?: string
  listing_id: string
  type: 'car' | 'bike'
  make: string
  model: string
  price: number
  sold_at?: string
}

const DB_TIMEOUT = 15000 // 15 seconds

async function withTimeout<T>(promise: Promise<T> | PromiseLike<T>, message: string): Promise<T> {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error(`${message} (Connection Timed Out)`)), DB_TIMEOUT)
  )
  return Promise.race([promise as Promise<T>, timeout])
}

export const vehicleService = {
  // ... (existing methods remain, adding new ones)
  async getActiveOffers() {
    return withTimeout(
      supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error
          return data as Offer[]
        }),
      'Loading Offers'
    )
  },

  async getAllOffers() {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Offer[]
  },

  async addOffer(offer: Omit<Offer, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('offers')
      .insert([offer])
      .select()
    
    if (error) throw error
    return data[0] as Offer
  },

  async updateOffer(id: string, offer: Partial<Offer>) {
    const { data, error } = await supabase
      .from('offers')
      .update(offer)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0] as Offer
  },

  async deleteOffer(id: string) {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },
  async cleanupOldSoldVehicles() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    try {
      await supabase
        .from('listings')
        .delete()
        .eq('status', 'sold')
        .lt('updated_at', oneDayAgo)
    } catch (err) {
      console.error("Failed to cleanup old sold vehicles:", err)
    }
  },

  async getAllListings() {
    // Fire and forget background cleanup
    this.cleanupOldSoldVehicles().catch(console.error)
    
    return withTimeout(
      supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error
          return data as Vehicle[]
        }),
      'Loading Inventory'
    )
  },

  async getFeaturedListings() {
    // Fire and forget background cleanup
    this.cleanupOldSoldVehicles().catch(console.error)

    return withTimeout(
      supabase
        .from('listings')
        .select('*')
        .limit(6)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error
          return data as Vehicle[]
        }),
      'Loading Featured Vehicles'
    )
  },

  async getVehicleById(id: string) {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Vehicle
  },

  async addVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('listings')
      .insert([vehicle])
      .select()
    
    if (error) throw error
    return data[0] as Vehicle
  },

  async updateVehicleStatus(id: string, status: 'available' | 'sold') {
    // 1. Fetch current vehicle data for history
    const vehicle = await this.getVehicleById(id)

    // 2. Update status in listings table
    const { data, error } = await supabase
      .from('listings')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
    
    if (error) throw error

    // 3. Update Sales History
    if (status === 'sold') {
      await this.recordSale({
        listing_id: vehicle.id,
        type: vehicle.type,
        make: vehicle.make,
        model: vehicle.model,
        price: vehicle.price
      })
    } else {
      await this.removeSaleHistory(id)
    }

    return data[0] as Vehicle
  },

  async recordSale(sale: SaleRecord) {
    const { error } = await supabase
      .from('sales_history')
      .insert([sale])
    if (error) throw error
  },

  async removeSaleHistory(listingId: string) {
    const { error } = await supabase
      .from('sales_history')
      .delete()
      .eq('listing_id', listingId)
    if (error) throw error
  },

  async getSalesStats() {
    const { data, error } = await supabase
      .from('sales_history')
      .select('*')
      .order('sold_at', { ascending: false })
    
    if (error) throw error
    const sales = data as SaleRecord[]

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const weekly = sales.filter(s => s.sold_at && new Date(s.sold_at) >= oneWeekAgo)
    const monthly = sales.filter(s => s.sold_at && new Date(s.sold_at) >= oneMonthAgo)

    return {
      weekly: {
        total: weekly.length,
        cars: weekly.filter(s => s.type === 'car').length,
        bikes: weekly.filter(s => s.type === 'bike').length,
        revenue: weekly.reduce((sum, s) => sum + s.price, 0)
      },
      monthly: {
        total: monthly.length,
        cars: monthly.filter(s => s.type === 'car').length,
        bikes: monthly.filter(s => s.type === 'bike').length,
        revenue: monthly.reduce((sum, s) => sum + s.price, 0)
      }
    }
  },

  async updateVehicle(id: string, vehicle: Partial<Vehicle>) {
    const { data, error } = await supabase
      .from('listings')
      .update(vehicle)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0] as Vehicle
  },

  async deleteVehicle(id: string) {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // ADMIN AUTH
  async adminLogin(username: string, password_hash: string) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password_hash)
      .single()
    
    if (error) return null
    return data
  },

  async resetAdminPassword(username: string, newPassword: string, pin: string) {
    const MASTER_PIN = "167426"
    if (pin !== MASTER_PIN) throw new Error("Incorrect Security PIN")
    
    const { data, error } = await supabase
      .from('admins')
      .update({ password_hash: newPassword })
      .eq('username', username)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // FAVORITES
  async toggleFavorite(userId: string, listingId: string) {
    const { data: existing } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('listing_id', listingId)
      if (error) throw error
      return false // Unfavorited
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, listing_id: listingId }])
      if (error) throw error
      return true // Favorited
    }
  },

  async isFavorite(userId: string, listingId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return !!data
  },

  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('listing_id, listings(*)')
      .eq('user_id', userId)
    
    if (error) throw error
    return (data as unknown as { listings: Vehicle }[]).map(item => item.listings)
  },

  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `listings/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('listings')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('listings')
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  async getReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Review[]
  },

  async getAllReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Review[]
  },

  async approveReview(id: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0] as Review
  },

  async deleteReview(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  async submitReview(review: Omit<Review, 'id' | 'is_approved' | 'created_at'>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ ...review, is_approved: false }])
      .select()
    
    if (error) throw error
    return data[0] as Review
  },

  // LOCAL STORAGE FAVORITES (ANONYMOUS)
  getLocalFavorites() {
    if (typeof window === 'undefined') return []
    const favs = localStorage.getItem('friends_car_bazar_favorites')
    return favs ? JSON.parse(favs) : []
  },

  toggleLocalFavorite(listingId: string) {
    if (typeof window === 'undefined') return false
    const favs = this.getLocalFavorites()
    const index = favs.indexOf(listingId)
    let isAdded = false

    if (index > -1) {
      favs.splice(index, 1)
      isAdded = false
    } else {
      favs.push(listingId)
      isAdded = true
    }

    localStorage.setItem('friends_car_bazar_favorites', JSON.stringify(favs))
    return isAdded
  },

  isLocalFavorite(listingId: string) {
    if (typeof window === 'undefined') return false
    const favs = this.getLocalFavorites()
    return favs.includes(listingId)
  },

  // INQUIRIES
  async submitInquiry(inquiry: Omit<Inquiry, 'id' | 'status' | 'created_at'>) {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{ ...inquiry, status: 'new' }])
      .select()
    
    if (error) throw error
    return data[0] as Inquiry
  },

  async getInquiries() {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Inquiry[]
  },

  async markInquiryReplied(id: string) {
    const { data, error } = await supabase
      .from('inquiries')
      .update({ status: 'replied' })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0] as Inquiry
  }
}
