import Link from "next/link"
import { Car, MapPin } from "lucide-react"
import Badge from "@/components/ui/Badge"
import { formatPrice, generateWhatsAppLink, getImageUrl } from "@/lib/utils"
import { WHATSAPP_NUMBER } from "@/lib/constants"
import type { Car as CarType } from "@/lib/types"

interface CarCardProps {
  car: CarType
}

export default function CarCard({ car }: CarCardProps) {
  const imageUrl = car.images?.[0] ? getImageUrl(car.images[0]) : null

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:bg-card-hover hover:border-border/80 group">
      <Link href={`/car/${car.id}`}>
        <div className="aspect-[16/10] bg-card-hover relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car className="w-12 h-12 text-muted/30" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="success">متوفرة</Badge>
          </div>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link href={`/car/${car.id}`}>
          <h3 className="font-semibold text-foreground text-base leading-tight group-hover:text-accent transition-colors">
            {car.brand} {car.model} {car.year}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="w-4 h-4" />
          <span>{car.governorate}</span>
          {car.mileage && (
            <>
              <span className="text-border">•</span>
              <span>{car.mileage.toLocaleString()} كم</span>
            </>
          )}
        </div>

        <div className="text-xl font-bold text-accent">
          {formatPrice(car.price)}
        </div>

        <a
          href={generateWhatsAppLink(WHATSAPP_NUMBER, car.brand, car.model, car.year, car.price)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          تواصل عبر واتساب
        </a>
      </div>
    </div>
  )
}
