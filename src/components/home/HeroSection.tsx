"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Search } from "lucide-react"
import { BRANDS, GOVERNORATES } from "@/lib/constants"

export default function HeroSection() {
  const router = useRouter()
  const searchParams = useSearchParams()

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
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground leading-tight">
            اكتشف أفضل صفقات السيارات في سوريا
          </h1>
          <p className="text-muted mt-2 text-sm md:text-base max-w-lg mx-auto">
            تصفح آلاف الإعلانات من جميع المحافظات وتواصل مباشرة مع البائع
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={searchParams.get("brand") || ""}
              onChange={e => updateFilter("brand", e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
            >
              <option value="">الماركة</option>
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

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
