import { createClient } from "@/lib/supabase/server"
import type { Car } from "@/lib/types"
import CarCard from "./CarCard"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import { Car as CarIcon, Database } from "lucide-react"

interface CarGridProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CarGrid({ searchParams }: CarGridProps) {
  try {
    const params = searchParams ? await searchParams : {}
    const supabase = await createClient()

    if (!supabase) {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Database className="w-12 h-12 text-muted/30" />
          <p className="text-muted">في انتظار الاتصال بقاعدة البيانات</p>
        </div>
      )
    }

    let query = supabase
      .from("cars")
      .select("*", { count: "exact" })
      .eq("status", "available")

    const sort = (params.sort as string) || "newest"

    query = query.order("featured", { ascending: false })

    if (sort === "price_asc") {
      query = query.order("price", { ascending: true })
    } else if (sort === "price_desc") {
      query = query.order("price", { ascending: false })
    } else {
      query = query.order("created_at", { ascending: false })
    }

    if (params.q) {
      const q = params.q as string
      query = query.or(`brand.ilike.%${q}%,model.ilike.%${q}%`)
    }
    if (params.brand) query = query.eq("brand", params.brand)
    if (params.governorate) query = query.eq("governorate", params.governorate)
    if (params.fuel_type) query = query.eq("fuel_type", params.fuel_type)
    if (params.transmission) query = query.eq("transmission", params.transmission)
    if (params.minPrice) query = query.gte("price", Number(params.minPrice))
    if (params.maxPrice) query = query.lte("price", Number(params.maxPrice))

    const page = Number(params.page) || 1
    const from = (page - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    query = query.range(from, to)

    let cars: Car[] | null = null
    let count: number | null = null

    try {
      const result = await query
      cars = result.data as Car[] | null
      count = result.count
    } catch {
      // Retry without featured order (column may not exist yet)
      let fallback = supabase.from("cars").select("*", { count: "exact" }).eq("status", "available")
      if (sort === "price_asc") fallback = fallback.order("price", { ascending: true })
      else if (sort === "price_desc") fallback = fallback.order("price", { ascending: false })
      else fallback = fallback.order("created_at", { ascending: false })
      if (params.q) { const q = params.q as string; fallback = fallback.or(`brand.ilike.%${q}%,model.ilike.%${q}%`) }
      if (params.brand) fallback = fallback.eq("brand", params.brand)
      if (params.governorate) fallback = fallback.eq("governorate", params.governorate)
      if (params.fuel_type) fallback = fallback.eq("fuel_type", params.fuel_type)
      if (params.transmission) fallback = fallback.eq("transmission", params.transmission)
      if (params.minPrice) fallback = fallback.gte("price", Number(params.minPrice))
      if (params.maxPrice) fallback = fallback.lte("price", Number(params.maxPrice))
      fallback = fallback.range(from, to)
      const result = await fallback
      cars = result.data as Car[] | null
      count = result.count
    }

    if (!cars || cars.length === 0) {
      const hasFilters = params.q || params.brand || params.governorate || params.fuel_type || params.transmission || params.minPrice || params.maxPrice
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <CarIcon className="w-12 h-12 text-muted/30" />
          <p className="text-muted">{hasFilters ? "لا توجد سيارات تطابق بحثك. جرب تغيير الفلاتر." : "لا توجد سيارات متوفرة حالياً"}</p>
        </div>
      )
    }

    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {cars.map((car: Car, i: number) => (
            <CarCard key={car.id} car={car} priority={i < 4} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
              const isActive = p === page
              return (
                <a
                  key={p}
                  href={`/?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v)), page: String(p) }).toString()}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-accent text-white" : "bg-card text-muted hover:text-foreground border border-border"}`}
                >
                  {p}
                </a>
              )
            })}
          </div>
        )}
      </div>
    )
  } catch {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-muted">تعذر تحميل الإعلانات. حاول مرة أخرى لاحقاً.</p>
      </div>
    )
  }
}
