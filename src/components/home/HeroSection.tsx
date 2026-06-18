"use client"

import { useEffect, useState, useCallback, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import { getImageUrl } from "@/lib/utils"

interface Brand {
  id: string
  name: string
  logo_url: string | null
}

const FALLBACK_COLORS = [
  "bg-red-600", "bg-blue-700", "bg-red-700", "bg-red-700",
  "bg-red-700", "bg-red-700", "bg-blue-600", "bg-teal-500",
  "bg-gray-900", "bg-blue-800", "bg-yellow-500", "bg-blue-700",
  "bg-red-600", "bg-red-700", "bg-gray-900",
]

export default function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    fetch("/api/brands").then(r => r.ok && r.json()).then(setBrands).catch(() => {})
  }, [])

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      const q = query.trim()
      if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
      else router.push("/search")
    },
    [query, router]
  )

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-accent/[0.04] to-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-3">
            ابحث عن سيارتك المثالية
          </h1>
          <p className="text-muted text-sm md:text-base mb-8 max-w-lg mx-auto leading-relaxed">
            آلاف الإعلانات من السويداء. وفر وقتك وتصفح بسهولة.
          </p>

          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="ماركة, موديل..."
                className="w-full rounded-2xl border border-border bg-card pr-12 pl-4 py-3.5 text-base text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm transition-all"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-2xl bg-accent hover:bg-accent-hover text-white px-6 py-3.5 text-base font-semibold transition-colors shadow-sm"
            >
              بحث
            </button>
          </form>

          <button
            onClick={() => router.push("/search")}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            بحث متقدم
          </button>
        </div>

        {brands.length > 0 && (
          <div className="max-w-3xl mx-auto mt-10 md:mt-12">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-center flex-wrap">
              {brands.map((brand, i) => (
                <button
                  key={brand.id}
                  onClick={() => router.push(`/search?brand=${encodeURIComponent(brand.name)}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:border-accent/30 hover:bg-accent/5 transition-all shrink-0"
                >
                  {brand.logo_url ? (
                    <img src={getImageUrl(brand.logo_url, "brand-logos")} alt={brand.name} className="w-6 h-6 rounded-full object-contain border border-border bg-white" />
                  ) : (
                    <div className={`w-6 h-6 rounded-full ${FALLBACK_COLORS[i % FALLBACK_COLORS.length]} flex items-center justify-center text-white font-bold text-[9px] shadow-sm`}>
                      {brand.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground">{brand.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
