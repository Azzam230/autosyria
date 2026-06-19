import { createClient } from "@/lib/supabase/server"
import type { Car } from "@/lib/types"
import type { Ad } from "@/lib/types"
import CarCard from "./CarCard"
import AdDisplay from "@/components/ads/AdDisplay"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import { Car as CarIcon, AlertCircle } from "lucide-react"

function weightedRandom(ads: Ad[]): Ad {
  if (ads.length === 0) throw new Error("No ads")
  if (ads.length === 1) return ads[0]
  const maxOrder = Math.max(...ads.map(a => a.sort_order))
  const minOrder = Math.min(...ads.map(a => a.sort_order))
  const range = maxOrder - minOrder + 1
  const weights = ads.map(a => range - (a.sort_order - minOrder))
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight
  for (let i = 0; i < ads.length; i++) {
    random -= weights[i]
    if (random <= 0) return ads[i]
  }
  return ads[ads.length - 1]
}

async function getAds(position: string): Promise<Ad[]> {
  try {
    const supabase = await createClient()
    if (!supabase) return []
    const { data } = await supabase.from("ads").select("*").eq("is_active", true).eq("position", position)
    return (data as Ad[]) || []
  } catch {
    return []
  }
}

interface CarGridProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CarGrid({ searchParams }: CarGridProps) {
  console.log("[CarGrid] START")
  let params: { [key: string]: string | string[] | undefined } = {}
  try {
    params = searchParams ? await searchParams : {}
    console.log("[CarGrid] searchParams:", JSON.stringify(params))
  } catch {
    console.log("[CarGrid] searchParams parse FAILED")
  }

  console.log("[CarGrid] Calling createClient()...")
  const supabase = await createClient()

  if (!supabase) {
    console.log("[CarGrid] supabase is NULL - showing waiting message")
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-muted">في انتظار الاتصال بقاعدة البيانات</p>
      </div>
    )
  }

  console.log("[CarGrid] supabase client OK, building query...")

  try {
    let query = supabase
      .from("cars")
      .select("*", { count: "exact" })
      .eq("status", "available")
    console.log("[CarGrid] Base query built")

    const sort = (params.sort as string) || "newest"
    console.log("[CarGrid] sort:", sort)
    if (sort === "price_asc") query = query.order("price", { ascending: true })
    else if (sort === "price_desc") query = query.order("price", { ascending: false })
    else query = query.order("created_at", { ascending: false })
    console.log("[CarGrid] order applied")

    if (params.q) {
      const q = params.q as string
      query = query.or(`brand.ilike.%${q}%,model.ilike.%${q}%`)
      console.log("[CarGrid] filter q:", q)
    }
    if (params.brand) { query = query.eq("brand", params.brand); console.log("[CarGrid] filter brand:", params.brand) }
    if (params.governorate) { query = query.eq("governorate", params.governorate); console.log("[CarGrid] filter governorate:", params.governorate) }
    if (params.fuel_type) { query = query.eq("fuel_type", params.fuel_type); console.log("[CarGrid] filter fuel_type:", params.fuel_type) }
    if (params.transmission) { query = query.eq("transmission", params.transmission); console.log("[CarGrid] filter transmission:", params.transmission) }
    if (params.minPrice) { query = query.gte("price", Number(params.minPrice)); console.log("[CarGrid] filter minPrice:", params.minPrice) }
    if (params.maxPrice) { query = query.lte("price", Number(params.maxPrice)); console.log("[CarGrid] filter maxPrice:", params.maxPrice) }

    const page = Math.max(1, Number(params.page) || 1)
    const from = (page - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    console.log("[CarGrid] Executing query, page:", page, "range:", from, "-", to)
    const { data: cars, error, count } = await query.range(from, to)
    console.log("[CarGrid] Query result - error:", error?.message, "count:", count, "cars:", cars?.length)

    if (error) {
      console.error("[CarGrid] QUERY ERROR:", error.message, error.code, error.details, error.hint)
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle className="w-10 h-10 text-muted/30" />
          <p className="text-muted">تعذر تحميل الإعلانات. حاول مرة أخرى لاحقاً.</p>
        </div>
      )
    }

    if (!cars || cars.length === 0) {
      console.log("[CarGrid] No cars returned")
      const hasFilters = !!(params.q || params.brand || params.governorate || params.fuel_type || params.transmission || params.minPrice || params.maxPrice)
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <CarIcon className="w-12 h-12 text-muted/30" />
          <p className="text-muted">{hasFilters ? "لا توجد سيارات تطابق بحثك. جرب تغيير الفلاتر." : "لا توجد سيارات متوفرة حالياً"}</p>
        </div>
      )
    }

    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

    const homeAds = await getAds("home_between_cards")

    const elements: React.ReactNode[] = []
    cars.forEach((car: Car, i: number) => {
      elements.push(<CarCard key={car.id} car={car} priority={i < 4} />)
      if ((i + 1) % 4 === 0 && homeAds.length > 0) {
        const ad = weightedRandom(homeAds)
        elements.push(
          <div key={`ad-${i}`} className="col-span-1">
            <AdDisplay ad={ad} className="aspect-[16/9] w-full" />
          </div>
        )
      }
    })

    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {elements}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
              const isActive = p === page
              const hrefParams = new URLSearchParams()
              Object.entries(params).forEach(([k, v]) => { if (v && typeof v === "string") hrefParams.set(k, v) })
              hrefParams.set("page", String(p))
              return (
                <a
                  key={p}
                  href={`/?${hrefParams.toString()}`}
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
  } catch (err) {
    console.error("[CarGrid] CATCH ERROR:", err instanceof Error ? err.message : err, err instanceof Error ? err.stack : "")
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <AlertCircle className="w-10 h-10 text-muted/30" />
        <p className="text-muted">تعذر تحميل الإعلانات. حاول مرة أخرى لاحقاً.</p>
      </div>
    )
  }
}
