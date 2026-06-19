export type CarStatus = 'available' | 'sold'
export type SellRequestStatus = 'pending' | 'reviewed' | 'approved'
export type FuelType = 'بنزين' | 'ديزل' | 'كهرباء' | 'هايبرد'
export type Transmission = 'عادي' | 'أوتوماتيك' | 'CVT'

export interface Car {
  id: string
  ref_number: number
  brand: string
  model: string
  year: number
  price: number
  mileage: number | null
  governorate: string
  fuel_type: FuelType | null
  transmission: Transmission | null
  engine_cc: number | null
  color: string | null
  description: string | null
  phone: string | null
  images: string[]
  status: CarStatus
  featured?: boolean
  created_at: string
}

export interface SellRequest {
  id: string
  brand: string
  model: string
  year: number
  expected_price: number
  phone_number: string
  status: SellRequestStatus
  created_at: string
}

export interface CarFilters {
  brand?: string
  governorate?: string
  minPrice?: number
  maxPrice?: number
}

export type AdPosition = 'home_between_cards' | 'search_sidebar' | 'car_detail_sidebar'

export interface Ad {
  id: string
  image_url: string
  link_url: string | null
  position: AdPosition
  alt_text: string | null
  is_active: boolean
  sort_order: number
  views: number
  clicks: number
  created_at: string
  updated_at: string
}
