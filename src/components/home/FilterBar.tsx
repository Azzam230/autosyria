"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Select from "@/components/ui/Select"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { BRANDS, GOVERNORATES } from "@/lib/constants"
import { Search, X } from "lucide-react"

export default function FilterBar() {
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

  const brandOptions = BRANDS.map(b => ({ value: b, label: b }))
  const govOptions = GOVERNORATES.map(g => ({ value: g, label: g }))
  const hasFilters = searchParams.toString().length > 0

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-muted" />
        <h2 className="font-semibold text-foreground">بحث متقدم</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select
          options={brandOptions}
          placeholder="الماركة"
          value={searchParams.get("brand") || ""}
          onChange={e => updateFilter("brand", e.target.value)}
        />
        <Select
          options={govOptions}
          placeholder="المحافظة"
          value={searchParams.get("governorate") || ""}
          onChange={e => updateFilter("governorate", e.target.value)}
        />
        <Input
          type="number"
          placeholder="السعر من"
          value={searchParams.get("minPrice") || ""}
          onChange={e => updateFilter("minPrice", e.target.value)}
        />
        <Input
          type="number"
          placeholder="السعر إلى"
          value={searchParams.get("maxPrice") || ""}
          onChange={e => updateFilter("maxPrice", e.target.value)}
        />
      </div>

      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4" />
            مسح الفلاتر
          </Button>
        </div>
      )}
    </div>
  )
}
