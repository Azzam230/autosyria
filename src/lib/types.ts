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
