"use client"

import { useState, useCallback, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"

export default function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState("")

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
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-3">
            اكتشف أفضل صفقات السيارات في سوريا
          </h1>
          <p className="text-muted text-sm md:text-base mb-8 max-w-lg mx-auto">
            تصفح آلاف الإعلانات من جميع المحافظات وتواصل مباشرة مع البائع
          </p>

          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="ابحث عن ماركة, موديل..."
                className="w-full rounded-xl border border-border bg-card pr-12 pl-4 py-3.5 text-base text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm transition-all"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-accent hover:bg-accent-hover text-white px-6 py-3.5 text-base font-semibold transition-colors shadow-sm"
            >
              بحث
            </button>
          </form>

          <button
            onClick={() => router.push("/search")}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            بحث متقدم
          </button>
        </div>
      </div>
    </section>
  )
}
