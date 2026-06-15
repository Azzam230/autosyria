"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">حدث خطأ غير متوقع</h1>
      <p className="text-muted max-w-md mb-8">نأسف للإزعاج. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          إعادة المحاولة
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-card border border-border text-foreground font-semibold text-sm hover:bg-card-hover transition-colors"
        >
          <Home className="w-4 h-4" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}
