"use client"

import { useEffect, useState, useCallback, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal, Car, Shield, Sparkles } from "lucide-react"
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
    <section className="relative overflow-hidden">
      {/* Mobile layout */}
      <div className="md:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-10 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground leading-tight mb-3">
              اكتشف أفضل صفقات السيارات في سوريا
            </h1>
            <p className="text-muted text-sm mb-6 max-w-lg mx-auto">
              تصفح آلاف الإعلانات من جميع المحافظات وتواصل مباشرة مع البائع
            </p>

            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="ابحث عن ماركة, موديل..."
                  className="w-full rounded-xl border border-border bg-card pr-9 pl-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm transition-all"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-accent hover:bg-accent-hover text-white px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm"
              >
                بحث
              </button>
            </form>

            <button
              onClick={() => router.push("/search")}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              بحث متقدم
            </button>
          </div>

          {brands.length > 0 && (
            <div className="max-w-3xl mx-auto mt-8">
              <p className="text-center text-[10px] text-muted mb-2">تصفية حسب الماركة</p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none justify-center">
                {brands.map((brand, i) => (
                  <button
                    key={brand.id}
                    onClick={() => router.push(`/search?brand=${encodeURIComponent(brand.name)}`)}
                    className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:border-accent/30 hover:bg-accent/5 transition-all shrink-0 min-w-[68px]"
                  >
                    {brand.logo_url ? (
                      <img src={getImageUrl(brand.logo_url, "brand-logos")} alt={brand.name} className="w-8 h-8 rounded-full object-contain border border-border bg-white" />
                    ) : (
                      <div className={`w-8 h-8 rounded-full ${FALLBACK_COLORS[i % FALLBACK_COLORS.length]} flex items-center justify-center text-white font-bold text-[10px] shadow-sm`}>
                        {brand.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-[10px] font-medium leading-tight text-center text-muted">{brand.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-12">
            {/* Left: Content */}
            <div className="flex-1 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                سوق السيارات الأول في سوريا
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                اكتشف أفضل صفقات السيارات في سوريا
              </h1>
              <p className="text-muted text-base lg:text-lg mb-8 leading-relaxed">
                تصفح آلاف الإعلانات من جميع المحافظات. تواصل مباشرة مع البائع واشتر سيارتك المثالية.
              </p>

              <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="ابحث عن ماركة, موديل..."
                    className="w-full rounded-2xl border border-border bg-card pr-12 pl-4 py-3.5 text-base text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 rounded-2xl bg-accent hover:bg-accent-hover text-white px-7 py-3.5 text-base font-semibold transition-colors shadow-sm"
                >
                  بحث
                </button>
              </form>

              <button
                onClick={() => router.push("/search")}
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                بحث متقدم
              </button>

              {brands.length > 0 && (
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-xs text-muted mb-3">تصفية حسب الماركة</p>
                  <div className="flex gap-2.5 flex-wrap">
                    {brands.map((brand, i) => (
                      <button
                        key={brand.id}
                        onClick={() => router.push(`/search?brand=${encodeURIComponent(brand.name)}`)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:border-accent/30 hover:bg-accent/5 transition-all"
                      >
                        {brand.logo_url ? (
                          <img src={getImageUrl(brand.logo_url, "brand-logos")} alt={brand.name} className="w-7 h-7 rounded-full object-contain border border-border bg-white" />
                        ) : (
                          <div className={`w-7 h-7 rounded-full ${FALLBACK_COLORS[i % FALLBACK_COLORS.length]} flex items-center justify-center text-white font-bold text-[10px] shadow-sm`}>
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

            {/* Right: Decorative */}
            <div className="hidden lg:flex flex-col items-center justify-center w-80 h-96 rounded-3xl bg-gradient-to-br from-accent/10 via-accent/5 to-background border border-accent/10 relative overflow-hidden shrink-0">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative flex flex-col items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Car className="w-12 h-12 text-accent" />
                </div>
                <div className="space-y-3 text-center">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Shield className="w-4 h-4 text-accent" />
                    تواصل آمن ومباشر
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Sparkles className="w-4 h-4 text-accent" />
                    آلاف الإعلانات الموثوقة
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
