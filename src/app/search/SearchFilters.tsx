"use client"

import { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal, X, ArrowUpDown, RotateCcw } from "lucide-react"
import { useBrandNames } from "@/hooks/useBrands"
import { GOVERNORATES } from "@/lib/constants"

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: الأقل أولاً" },
  { value: "price_desc", label: "السعر: الأعلى أولاً" },
]

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const brands = useBrandNames()
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.set("page", "1")
      router.push(`/search?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push("/search")
  }, [router])

  const hasFilters = Array.from(searchParams.entries()).some(([k]) => k !== "page")

  const filterFields = (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <select
        value={searchParams.get("brand") || ""}
        onChange={e => updateFilter("brand", e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      >
        <option value="">جميع الماركات</option>
        {brands.map(b => <option key={b} value={b}>{b}</option>)}
      </select>

      <select
        value={searchParams.get("governorate") || ""}
        onChange={e => updateFilter("governorate", e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      >
        <option value="">جميع المحافظات</option>
        {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
      </select>

      <select
        value={searchParams.get("fuel_type") || ""}
        onChange={e => updateFilter("fuel_type", e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      >
        <option value="">نوع الوقود</option>
        <option value="بنزين">بنزين</option>
        <option value="ديزل">ديزل</option>
        <option value="كهرباء">كهرباء</option>
        <option value="هايبرد">هايبرد</option>
      </select>

      <select
        value={searchParams.get("transmission") || ""}
        onChange={e => updateFilter("transmission", e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      >
        <option value="">نوع القير</option>
        <option value="عادي">عادي</option>
        <option value="أوتوماتيك">أوتوماتيك</option>
        <option value="CVT">CVT</option>
      </select>

      <input
        type="text"
        inputMode="numeric"
        placeholder="أقل سعر"
        value={searchParams.get("minPrice") || ""}
        onChange={e => updateFilter("minPrice", e.target.value.replace(/[^0-9]/g, ""))}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      />

      <input
        type="text"
        inputMode="numeric"
        placeholder="أعلى سعر"
        value={searchParams.get("maxPrice") || ""}
        onChange={e => updateFilter("maxPrice", e.target.value.replace(/[^0-9]/g, ""))}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      />

      <div className="relative">
        <select
          value={searchParams.get("sort") || "newest"}
          onChange={e => updateFilter("sort", e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-8 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors appearance-none"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block bg-card border border-border rounded-2xl p-5 shadow-sm">
        {filterFields}
        {hasFilters && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
            <span className="text-xs text-muted">فلاتر مفعلة</span>
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover font-medium transition-colors">
              <RotateCcw className="w-3 h-3" />
              إعادة ضبط
            </button>
          </div>
        )}
      </div>

      {/* Mobile Trigger */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="md:hidden flex items-center gap-2 w-full rounded-2xl border border-border bg-card p-3.5 text-sm text-muted shadow-sm"
      >
        <SlidersHorizontal className="w-4 h-4 text-accent" />
        <span>تصفية النتائج</span>
        {hasFilters && <span className="mr-auto text-xs text-accent font-medium">فلاتر مفعلة</span>}
      </button>

      {/* Mobile Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[80vh] overflow-y-auto p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">تصفية</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-1 hover:text-foreground text-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterFields}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-4 w-full rounded-xl bg-accent text-white py-3 font-semibold text-sm"
            >
              عرض النتائج
            </button>
          </div>
        </div>
      )}
    </>
  )
}
