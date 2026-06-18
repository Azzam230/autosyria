import { createClient } from "@/lib/supabase/server"
import type { Car } from "@/lib/types"
import SimilarCarsCarousel from "./SimilarCarsCarousel"

interface SimilarCarsProps {
  currentCar: Car
}

export default async function SimilarCars({ currentCar }: SimilarCarsProps) {
  const supabase = await createClient()
  if (!supabase) return null

  try {
    let query = supabase
      .from("cars")
      .select("*")
      .eq("status", "available")
      .neq("id", currentCar.id)
      .limit(8)

    query = query.or(`brand.eq.${currentCar.brand},governorate.eq.${currentCar.governorate}`)

    const { data: cars } = await query

    if (!cars || cars.length === 0) return null

    return (
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <SimilarCarsCarousel cars={cars as Car[]} />
      </div>
    )
  } catch {
    return null
  }
}
