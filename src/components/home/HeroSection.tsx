"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { ArrowUpDown } from "lucide-react"
import { BRANDS, GOVERNORATES } from "@/lib/constants"

const BRAND_COLORS: Record<string, string> = {
  "كيا": "bg-[#BB162B]",
  "هيونداي": "bg-[#002C5F]",
  "تويوتا": "bg-[#EB0A1E]",
  "نيسان": "bg-[#C3002F]",
  "ميتسوبيشي": "bg-[#D7182A]",
  "شيفروليه": "bg-[#C8102E]",
  "بي إم دبليو": "bg-[#0066B1]",
  "مرسيدس": "bg-[#00B3B3]",
  "أودي": "bg-[#000000]",
  "فولكس فاجن": "bg-[#001E50]",
  "رينو": "bg-[#FFC420]",
  "بيجو": "bg-[#003B78]",
  "سوزوكي": "bg-[#E40421]",
  "هوندا": "bg-[#C8102E]",
  "مازدا": "bg-[#101010]",
}

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: الأقل أولاً" },
  { value: "price_desc", label: "السعر: الأعلى أولاً" },
]

export default function HeroSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeBrand = searchParams.get("brand") || ""

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
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
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
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
            {BRANDS.map(brand => (
              <button
                key={brand}
                onClick={() => updateFilter("brand", brand === activeBrand ? "" : brand)}
                className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl border transition-all shrink-0 min-w-[72px] ${
                  brand === activeBrand
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-border bg-card text-muted hover:border-muted hover:text-foreground"
                }`}
              >
                <div className={`w-9 h-9 rounded-full ${BRAND_COLORS[brand] || "bg-muted"} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                  {brand.charAt(0)}
                </div>
                <span className="text-[10px] font-medium leading-tight text-center">{brand}</span>
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
