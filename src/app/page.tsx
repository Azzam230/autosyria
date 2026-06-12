import { Suspense } from "react"
import HeroSection from "@/components/home/HeroSection"
import FilterBar from "@/components/home/FilterBar"
import CarGrid from "@/components/home/CarGrid"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function FilterBarWrapper() {
  return (
    <div className="mb-6">
      <Suspense fallback={<div className="h-24 rounded-xl bg-card animate-pulse" />}>
        <FilterBar />
      </Suspense>
    </div>
  )
}

export default function Home({ searchParams }: PageProps) {
  return (
    <div>
      <HeroSection />
      <section id="cars" className="max-w-7xl mx-auto px-4 pb-16">
        <FilterBarWrapper />
        <CarGrid searchParams={searchParams} />
      </section>
    </div>
  )
}
