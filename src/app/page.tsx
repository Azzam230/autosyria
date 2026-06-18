import type { Metadata } from "next"
import { Suspense } from "react"
import HeroSection from "@/components/home/HeroSection"
import CarGrid from "@/components/home/CarGrid"
import ErrorBoundary from "@/components/ui/ErrorBoundary"
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    openGraph: {
      title: `${SITE_NAME} | سوق السيارات في السويداء`,
      description: SITE_DESCRIPTION,
    },
}

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div className="h-52 animate-pulse bg-card" />}>
        <HeroSection />
      </Suspense>
      <section className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">آخر الإعلانات</h2>
          <a href="/search" className="text-sm text-accent hover:text-accent-hover font-medium transition-colors">
            عرض الكل
          </a>
        </div>
        <ErrorBoundary fallback={
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-muted">تعذر تحميل الإعلانات. حاول مرة أخرى لاحقاً.</p>
          </div>
        }>
          <CarGrid />
        </ErrorBoundary>
      </section>
    </div>
  )
}
