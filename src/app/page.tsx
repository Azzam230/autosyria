import type { Metadata } from "next"
import { Suspense } from "react"
import HeroSection from "@/components/home/HeroSection"
import CarGrid from "@/components/home/CarGrid"
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants"

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} | سوق السيارات في سوريا`,
    description: SITE_DESCRIPTION,
  },
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function Home({ searchParams }: PageProps) {
  return (
    <div>
      <Suspense fallback={<div className="h-52 animate-pulse bg-card" />}>
        <HeroSection />
      </Suspense>
      <section className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <CarGrid searchParams={searchParams} />
      </section>
    </div>
  )
}
