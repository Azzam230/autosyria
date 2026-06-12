import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { formatPrice, getImageUrl } from "@/lib/utils"
import Badge from "@/components/ui/Badge"
import WhatsAppButton from "./WhatsAppButton"
import { MapPin, Gauge, Calendar, Database } from "lucide-react"
import type { Car } from "@/lib/types"

interface CarDetailProps {
  id: string
}

export default async function CarDetail({ id }: CarDetailProps) {
  const supabase = await createClient()

  if (!supabase) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Database className="w-16 h-16 text-muted/30 mx-auto mb-4" />
        <p className="text-muted text-lg">في انتظار الاتصال بقاعدة البيانات</p>
      </div>
    )
  }

  const { data: car } = await supabase.from("cars").select("*").eq("id", id).single()

  if (!car || car.status !== "available") notFound()

  const c = car as Car

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {c.images?.[0] ? (
            <img
              src={getImageUrl(c.images[0])}
              alt={`${c.brand} ${c.model}`}
              className="w-full aspect-[4/3] object-cover"
            />
          ) : (
            <div className="w-full aspect-[4/3] flex items-center justify-center bg-card-hover">
              <span className="text-muted/30">لا توجد صورة</span>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {c.brand} {c.model} {c.year}
            </h1>
            <Badge variant="success" className="mt-2">متوفرة</Badge>
          </div>

          <div className="text-3xl font-bold text-accent">{formatPrice(c.price)}</div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
              <Calendar className="w-5 h-5 text-muted" />
              <div>
                <p className="text-xs text-muted">سنة الصنع</p>
                <p className="font-medium">{c.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
              <MapPin className="w-5 h-5 text-muted" />
              <div>
                <p className="text-xs text-muted">المحافظة</p>
                <p className="font-medium">{c.governorate}</p>
              </div>
            </div>
            {c.mileage && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
                <Gauge className="w-5 h-5 text-muted" />
                <div>
                  <p className="text-xs text-muted">عدد الكيلومترات</p>
                  <p className="font-medium">{c.mileage.toLocaleString()} كم</p>
                </div>
              </div>
            )}
          </div>

          <WhatsAppButton brand={c.brand} model={c.model} year={c.year} price={c.price} />
        </div>
      </div>
    </div>
  )
}
