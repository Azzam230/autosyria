import Link from "next/link"
import Image from "next/image"
import { MapPin, Gauge, Calendar } from "lucide-react"
import { formatPrice, getImageUrl } from "@/lib/utils"
import type { Car as CarType } from "@/lib/types"

interface CarCardProps {
  car: CarType
  priority?: boolean
}

export default function CarCard({ car, priority = false }: CarCardProps) {
  const imageUrl = car.images?.[0] ? getImageUrl(car.images[0]) : null

  return (
    <Link href={`/cars/${car.id}`} className="block">
      <div className="rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:shadow-md hover:border-accent/30 group">
        <div className="relative aspect-[16/9] bg-card-hover overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${car.brand} ${car.model} ${car.year}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted/20 text-sm">لا توجد صورة</span>
            </div>
          )}
          {car.status === "sold" && (
            <div className="absolute top-2 right-2 bg-accent text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              مباعة
            </div>
          )}
        </div>

        <div className="p-3 space-y-2">
          <div className="text-base md:text-lg font-bold text-foreground leading-tight">
            {formatPrice(car.price)}
          </div>

          <h3 className="text-sm font-medium text-foreground/80 leading-snug line-clamp-1">
            {car.brand} {car.model} {car.year}
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] text-muted flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {car.governorate}
            </span>
            {car.mileage && (
              <>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  {car.mileage.toLocaleString()} كم
                </span>
              </>
            )}
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {car.year}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
