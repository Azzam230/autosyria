import type { Metadata } from "next"
import { Suspense } from "react"
import CarGrid from "@/components/home/CarGrid"
import ErrorBoundary from "@/components/ui/ErrorBoundary"
import SearchFilters from "./SearchFilters"
import SearchInput from "./SearchInput"

export const metadata: Metadata = {
  title: "بحث متقدم",
  description: "ابحث عن سيارتك المفضلة باستخدام فلاتر متعددة",
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams
  const q = (params.q as string) || ""

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center md:text-right">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">بحث متقدم</h1>
        <p className="text-muted text-sm mt-1">ابحث عن سيارتك المثالية باستخدام الفلاتر المتنوعة</p>
      </div>

      <Suspense fallback={<div className="h-12 animate-pulse bg-card rounded-2xl" />}>
        <SearchInput initialQuery={q} />
      </Suspense>

      <Suspense fallback={<div className="h-24 animate-pulse bg-card rounded-2xl" />}>
        <SearchFilters />
      </Suspense>

      <div>
        <ErrorBoundary fallback={
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-muted">تعذر تحميل النتائج. حاول مرة أخرى لاحقاً.</p>
          </div>
        }>
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
                  <div className="aspect-[16/9] bg-muted/20 animate-pulse" />
                  <div className="p-3 space-y-3">
                    <div className="h-5 w-24 bg-muted/20 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-muted/20 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-muted/20 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          }>
            <CarGrid searchParams={Promise.resolve(params)} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}
