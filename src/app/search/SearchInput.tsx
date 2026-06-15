"use client"

import { useState, useCallback, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

interface SearchInputProps {
  initialQuery: string
}

export default function SearchInput({ initialQuery }: SearchInputProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      const params = new URLSearchParams(window.location.search)
      if (query.trim()) params.set("q", query.trim())
      else params.delete("q")
      params.set("page", "1")
      router.push(`/search?${params.toString()}`)
    },
    [query, router]
  )

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-2xl mx-auto md:mx-0">
      <div className="relative flex-1">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث عن ماركة, موديل..."
          className="w-full rounded-xl border border-border bg-card pr-10 pl-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-accent hover:bg-accent-hover text-white px-5 py-3 text-sm font-semibold transition-colors"
      >
        بحث
      </button>
    </form>
  )
}
