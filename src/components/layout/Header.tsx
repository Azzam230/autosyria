"use client"

import { useState, useCallback, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, PlusCircle } from "lucide-react"
import { SITE_NAME } from "@/lib/constants"

export default function Header() {
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
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt={SITE_NAME}
            width={100}
            height={28}
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>

        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ابحث عن ماركة, موديل..."
              className="w-full rounded-xl border border-border bg-card pr-10 pl-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-accent hover:bg-accent-hover text-white px-4 py-2 text-sm font-semibold transition-colors"
          >
            بحث
          </button>
        </form>

        <Link
          href="/sell"
          className="hidden md:flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 text-sm font-semibold transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          بيع سيارتك
        </Link>
      </div>
    </header>
  )
}
