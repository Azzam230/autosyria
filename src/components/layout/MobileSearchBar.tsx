"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, Suspense } from "react"
import { Search } from "lucide-react"
import { useBrandNames } from "@/hooks/useBrands"
import { GOVERNORATES } from "@/lib/constants"

function MobileSearchBarInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const brands = useBrandNames()

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

  return (
    <div className="md:hidden border-b border-border bg-muted/10">
      <div className="max-w-7xl mx-auto px-3 py-2">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted shrink-0" />
          <select
            value={searchParams.get("brand") || ""}
            onChange={e => updateFilter("brand", e.target.value)}
            className="flex-1 min-w-0 rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">الماركة</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select
            value={searchParams.get("governorate") || ""}
            onChange={e => updateFilter("governorate", e.target.value)}
            className="flex-1 min-w-0 rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">المدينة</option>
            {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <input
            type="number"
            placeholder="من"
            value={searchParams.get("minPrice") || ""}
            onChange={e => updateFilter("minPrice", e.target.value)}
            className="w-16 rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            type="number"
            placeholder="إلى"
            value={searchParams.get("maxPrice") || ""}
            onChange={e => updateFilter("maxPrice", e.target.value)}
            className="w-16 rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>
    </div>
  )
}

export default function MobileSearchBar() {
  return (
    <Suspense fallback={null}>
      <MobileSearchBarInner />
    </Suspense>
  )
}
