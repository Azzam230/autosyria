import { createClient } from "@/lib/supabase/server"
import type { Car } from "@/lib/types"
import CarCard from "./CarCard"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import { Car as CarIcon, Database } from "lucide-react"

interface CarGridProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CarGrid({ searchParams }: CarGridProps) {
  const params = await searchParams
  const supabase = await createClient()

  if (!supabase) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Database className="w-16 h-16 text-muted/30" />
        <p className="text-muted text-lg">في انتظار الاتصال بقاعدة البيانات</p>
        <p className="text-sm text-muted/60">قم بتعيين NEXT_PUBLIC_SUPABASE_URL في ملف .env.local</p>
      </div>
    )
  }

  let query = supabase
    .from("cars")
    .select("*", { count: "exact" })
    .eq("status", "available")
    .order("created_at", { ascending: false })

  if (params.brand) query = query.eq("brand", params.brand)
  if (params.governorate) query = query.eq("governorate", params.governorate)
  if (params.minPrice) query = query.gte("price", Number(params.minPrice))
  if (params.maxPrice) query = query.lte("price", Number(params.maxPrice))

  const page = Number(params.page) || 1
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  query = query.range(from, to)

  const { data: cars, count } = await query

  if (!cars || cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <CarIcon className="w-16 h-16 text-muted/30" />
        <p className="text-muted text-lg">لا توجد سيارات متوفرة حالياً</p>
      </div>
    )
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cars.map((car: Car) => (
          <CarCard key={car.id} car={car} />
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
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-accent text-white" : "bg-card text-muted hover:text-foreground border border-border"}`}
              >
                {p}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
