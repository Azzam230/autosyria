"use client"

import { useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft, MapPin, Gauge } from "lucide-react"
import { formatPrice, getImageUrl } from "@/lib/utils"
import type { Car } from "@/lib/types"

interface SimilarCarsCarouselProps {
  cars: Car[]
}

export default function SimilarCarsCarousel({ cars }: SimilarCarsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.75
    el.scrollBy({ left: dir === "right" ? -amount : amount, behavior: "smooth" })
    setTimeout(updateScrollState, 300)
  }, [updateScrollState])

  if (cars.length === 0) return null

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">إعلانات مشابهة</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-muted" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-muted" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory -mx-1 px-1 pb-2"
      >
        {cars.map(car => {
          const imageUrl = car.images?.[0] ? getImageUrl(car.images[0]) : null
          return (
            <Link
              key={car.id}
              href={`/cars/${car.id}`}
              className="snap-start shrink-0 w-[220px] sm:w-[240px] rounded-lg border border-border bg-card overflow-hidden hover:shadow-md hover:border-accent/30 transition-all group"
            >
              <div className="relative aspect-[16/10] bg-card-hover overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${car.brand} ${car.model} ${car.year}`}
                    fill
                    sizes="240px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted/20 text-xs">لا توجد صورة</span>
                  </div>
                )}
              </div>
              <div className="p-2.5 space-y-1.5">
                <div className="text-sm font-bold text-foreground leading-tight">{formatPrice(car.price)}</div>
                <p className="text-xs font-medium text-foreground/80 line-clamp-1">{car.brand} {car.model} {car.year}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-muted">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    {car.governorate}
                  </span>
                  {car.mileage && (
                    <>
                      <span className="text-border">•</span>
                      <span className="flex items-center gap-0.5">
                        <Gauge className="w-2.5 h-2.5" />
                        {car.mileage.toLocaleString()} كم
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
