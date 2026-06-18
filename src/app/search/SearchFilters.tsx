"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { SlidersHorizontal, X, ArrowUpDown, RotateCcw, Search } from "lucide-react"
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
  const [count, setCount] = useState<number | null>(null)
  const [loadingCount, setLoadingCount] = useState(false)

  // Local filter state
  const [filters, setFilters] = useState({
    brand: searchParams.get("brand") || "",
    governorate: searchParams.get("governorate") || "",
    fuel_type: searchParams.get("fuel_type") || "",
    transmission: searchParams.get("transmission") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
  })

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasFilters = Object.values(filters).some(v => v !== "" && v !== "newest")

  // Fetch count when filters change (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      if (!hasFilters) {
        setCount(null)
        return
      }

      setLoadingCount(true)
      try {
        const supabase = createClient()
        let query = supabase.from("cars").select("*", { count: "exact", head: true }).eq("status", "available")

        if (filters.brand) query = query.eq("brand", filters.brand)
        if (filters.governorate) query = query.eq("governorate", filters.governorate)
        if (filters.fuel_type) query = query.eq("fuel_type", filters.fuel_type)
        if (filters.transmission) query = query.eq("transmission", filters.transmission)
        if (filters.minPrice) query = query.gte("price", Number(filters.minPrice))
        if (filters.maxPrice) query = query.lte("price", Number(filters.maxPrice))

        const { count: result } = await query
        setCount(result ?? 0)
      } catch {
        setCount(null)
      } finally {
        setLoadingCount(false)
      }
    }, 600)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [filters, hasFilters])

  const updateFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && (key !== "sort" || value !== "newest")) params.set(key, value)
    })
    params.set("page", "1")
    router.push(`/search?${params.toString()}`)
  }, [filters, router])

  const clearFilters = useCallback(() => {
    setFilters({ brand: "", governorate: "", fuel_type: "", transmission: "", minPrice: "", maxPrice: "", sort: "newest" })
    setCount(null)
    router.push("/search")
  }, [router])

  const filterFields = (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <select
        value={filters.brand}
        onChange={e => updateFilter("brand", e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      >
        <option value="">جميع الماركات</option>
        {brands.map(b => <option key={b} value={b}>{b}</option>)}
      </select>

      <select
        value={filters.governorate}
        onChange={e => updateFilter("governorate", e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      >
        <option value="">جميع المناطق</option>
        {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
      </select>

      <select
        value={filters.fuel_type}
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
        value={filters.transmission}
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
        value={filters.minPrice}
        onChange={e => updateFilter("minPrice", e.target.value.replace(/[^0-9]/g, ""))}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      />

      <input
        type="text"
        inputMode="numeric"
        placeholder="أعلى سعر"
        value={filters.maxPrice}
        onChange={e => updateFilter("maxPrice", e.target.value.replace(/[^0-9]/g, ""))}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      />

      <div className="relative">
        <select
          value={filters.sort}
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

  const applyButton = (
    <button
      onClick={applyFilters}
      className="flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-white px-5 py-2.5 text-sm font-semibold transition-colors"
    >
      <Search className="w-4 h-4" />
      تطبيق
      {loadingCount ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : count !== null && hasFilters ? (
        <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">{count}</span>
      ) : null}
    </button>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-sm">فلاتر البحث</h3>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors">
                <RotateCcw className="w-3 h-3" />
                إعادة ضبط
              </button>
            )}
          </div>
        </div>
        {filterFields}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted">
            {count !== null && hasFilters ? `${count} نتيجة متوقعة` : "عدّل الفلاتر لرؤية النتائج"}
          </span>
          {applyButton}
        </div>
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
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[85vh] overflow-y-auto p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">تصفية</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-1 hover:text-foreground text-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterFields}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
              <button
                onClick={() => { clearFilters(); setShowMobileFilters(false) }}
                className="flex-1 rounded-xl border border-border bg-card text-foreground py-3 text-sm font-semibold"
              >
                إعادة ضبط
              </button>
              <button
                onClick={() => { applyFilters(); setShowMobileFilters(false) }}
                className="flex-1 rounded-xl bg-accent text-white py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                تطبيق
                {loadingCount ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : count !== null && hasFilters ? (
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">{count}</span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
