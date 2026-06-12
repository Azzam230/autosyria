export type CarStatus = 'available' | 'sold'
export type SellRequestStatus = 'pending' | 'reviewed' | 'approved'

export interface Car {
  id: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number | null
  governorate: string
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
