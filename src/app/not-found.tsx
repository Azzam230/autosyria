import Link from "next/link"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-bold text-accent/20 mb-4">404</div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">الصفحة غير موجودة</h1>
      <p className="text-muted max-w-md mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. تصفح أحدث إعلانات السيارات في سوريا.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors"
        >
          <Home className="w-4 h-4" />
          العودة للرئيسية
        </Link>
        <Link
          href="/?sort=newest"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-card border border-border text-foreground font-semibold text-sm hover:bg-card-hover transition-colors"
        >
          <Search className="w-4 h-4" />
          أحدث الإعلانات
        </Link>
      </div>
    </div>
  )
}
