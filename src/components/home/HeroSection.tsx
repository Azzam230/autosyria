"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { ArrowUpDown } from "lucide-react"
import { GOVERNORATES } from "@/lib/constants"
import { getImageUrl } from "@/lib/utils"

interface Brand {
  id: string
  name: string
  logo_url: string | null
}

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: الأقل أولاً" },
  { value: "price_desc", label: "السعر: الأعلى أولاً" },
]

const FALLBACK_COLORS = [
  "bg-red-600", "bg-blue-700", "bg-red-700", "bg-red-700",
  "bg-red-700", "bg-red-700", "bg-blue-600", "bg-teal-500",
  "bg-gray-900", "bg-blue-800", "bg-yellow-500", "bg-blue-700",
  "bg-red-600", "bg-red-700", "bg-gray-900",
]

export default function HeroSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeBrand = searchParams.get("brand") || ""
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    fetch("/api/brands").then(r => r.ok && r.json()).then(setBrands).catch(() => {})
  }, [])

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.set("page", "1")
      router.push(`/?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push("/")
  }, [router])

  const hasFilters = Array.from(searchParams.entries()).length > 0

  return (
    <section className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground leading-tight">
            اكتشف أفضل صفقات السيارات في سوريا
          </h1>
          <p className="text-muted mt-2 text-sm md:text-base max-w-lg mx-auto">
            تصفح آلاف الإعلانات من جميع المحافظات وتواصل مباشرة مع البائع
          </p>
        </div>

        {/* Brand Logos Row */}
        <div className="mb-5">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => updateFilter("brand", "")}
              className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl border transition-all shrink-0 min-w-[72px] ${
                !activeBrand
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-border bg-card text-muted hover:border-muted hover:text-foreground"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-muted/20 flex items-center justify-center">
                <span className="text-xs font-bold">الكل</span>
              </div>
              <span className="text-[10px] font-medium">الكل</span>
            </button>
            {brands.map((brand, i) => (
              <button
                key={brand.id}
                onClick={() => updateFilter("brand", brand.name === activeBrand ? "" : brand.name)}
                className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl border transition-all shrink-0 min-w-[72px] ${
                  brand.name === activeBrand
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-border bg-card text-muted hover:border-muted hover:text-foreground"
                }`}
              >
                {brand.logo_url ? (
                  <img src={getImageUrl(brand.logo_url, "brand-logos")} alt={brand.name} className="w-9 h-9 rounded-full object-contain border border-border bg-white" />
                ) : (
                  <div className={`w-9 h-9 rounded-full ${FALLBACK_COLORS[i % FALLBACK_COLORS.length]} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                    {brand.name.charAt(0)}
                  </div>
                )}
                <span className="text-[10px] font-medium leading-tight text-center">{brand.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters + Sort Row */}
        <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <select
                value={searchParams.get("governorate") || ""}
                onChange={e => updateFilter("governorate", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              >
                <option value="">المدينة</option>
                {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>

              <input
                type="number"
                placeholder="السعر من"
                value={searchParams.get("minPrice") || ""}
                onChange={e => updateFilter("minPrice", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              />

              <input
                type="number"
                placeholder="السعر إلى"
                value={searchParams.get("maxPrice") || ""}
                onChange={e => updateFilter("maxPrice", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              />

              <div className="relative">
                <select
                  value={searchParams.get("sort") || "newest"}
                  onChange={e => updateFilter("sort", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-8 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors appearance-none"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {hasFilters && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-xs text-muted">فلاتر مفعلة</span>
              <button onClick={clearFilters} className="text-xs text-accent hover:text-accent-hover font-medium transition-colors">
                مسح الكل
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
