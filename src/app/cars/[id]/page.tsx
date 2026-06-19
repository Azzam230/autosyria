import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { formatPrice, getImageUrl, generateWhatsAppLink } from "@/lib/utils"
import { WHATSAPP_NUMBER } from "@/lib/constants"
import type { Metadata } from "next"
import type { Car, Ad } from "@/lib/types"
import CarDetailClient from "./CarDetailClient"
import SimilarCars from "@/components/cars/SimilarCars"
import AdDisplay from "@/components/ads/AdDisplay"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  if (!supabase) return { title: "SiwdaCars" }

  const { data } = await supabase.from("cars").select("brand, model, year, price, governorate, images").eq("id", id).single()
  if (!data) return { title: "السيارة غير موجودة" }

  const title = `سيارة ${data.brand}, ${data.model}, ${data.year} في ${data.governorate}`
  const description = `${data.brand} ${data.model} ${data.year} - ${formatPrice(data.price)}. سيارة متوفرة للبيع في ${data.governorate}، السويداء. تصفح التفاصيل وتواصل مع البائع.`
  const imageUrl = data.images?.[0] ? getImageUrl(data.images[0]) : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "ar_SY",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 900 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  if (!supabase) notFound()

  let car: Car | null = null
  try {
    const { data } = await supabase.from("cars").select("*").eq("id", id).single()
    car = data as Car | null
  } catch {
    notFound()
  }

  if (!car || car.status !== "available") notFound()

  const c = car as Car
  const imageUrls = (c.images || []).map(img => getImageUrl(img))
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://siwdacars.com"
  const carUrl = `${baseUrl}/cars/${id}`
  const shareText = `سيارة ${c.brand} ${c.model} ${c.year} - ${formatPrice(c.price)} في ${c.governorate}، السويداء`
  const whatsappLink = generateWhatsAppLink(WHATSAPP_NUMBER, c.brand, c.model, c.year, c.price, c.ref_number, carUrl)

  let detailAd: Ad | null = null
  try {
    const { data } = await supabase.from("ads").select("*").eq("is_active", true).eq("position", "car_detail_sidebar")
    const ads = data as Ad[] | null
    if (ads && ads.length > 0) {
      if (ads.length === 1) { detailAd = ads[0] }
      else {
        const maxOrder = Math.max(...ads.map(a => a.sort_order))
        const minOrder = Math.min(...ads.map(a => a.sort_order))
        const range = maxOrder - minOrder + 1
        const weights = ads.map(a => range - (a.sort_order - minOrder))
        const totalWeight = weights.reduce((a, b) => a + b, 0)
        let random = Math.random() * totalWeight
        detailAd = ads[0]
        for (let i = 0; i < ads.length; i++) {
          random -= weights[i]
          if (random <= 0) { detailAd = ads[i]; break }
        }
      }
    }
  } catch {}

  return (
    <div className="flex gap-6 max-w-7xl mx-auto">
      <div className="flex-1 min-w-0">
        <CarDetailClient car={c} imageUrls={imageUrls} whatsappLink={whatsappLink} carUrl={carUrl} shareText={shareText} />
        <SimilarCars currentCar={c} />
      </div>
      {detailAd && (
        <aside className="w-72 hidden lg:block shrink-0 pt-4">
          <div className="sticky top-24 space-y-4">
            <div className="text-xs text-muted font-medium">إعلان</div>
            <AdDisplay ad={detailAd} className="w-full aspect-[6/5]" />
          </div>
        </aside>
      )}
    </div>
  )
}
