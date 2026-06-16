import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { formatPrice, getImageUrl, generateWhatsAppLink } from "@/lib/utils"
import { WHATSAPP_NUMBER } from "@/lib/constants"
import type { Metadata } from "next"
import type { Car } from "@/lib/types"
import CarDetailClient from "./CarDetailClient"
import SimilarCars from "@/components/cars/SimilarCars"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  if (!supabase) return { title: "Auto Syria" }

  const { data } = await supabase.from("cars").select("brand, model, year, price, governorate, images").eq("id", id).single()
  if (!data) return { title: "السيارة غير موجودة" }

  const title = `سيارة ${data.brand}, ${data.model}, ${data.year} في ${data.governorate} في سوريا`
  const description = `${data.brand} ${data.model} ${data.year} - ${formatPrice(data.price)}. سيارة متوفرة للبيع في ${data.governorate}، سوريا. تصفح التفاصيل وتواصل مع البائع.`
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

  const { data: car } = await supabase.from("cars").select("*").eq("id", id).single()

  if (!car || car.status !== "available") notFound()

  const c = car as Car
  const imageUrls = (c.images || []).map(img => getImageUrl(img))
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://autosyria.com"
  const carUrl = `${baseUrl}/cars/${id}`
  const shareText = `سيارة ${c.brand} ${c.model} ${c.year} - ${formatPrice(c.price)} في ${c.governorate}، سوريا`
  const whatsappLink = generateWhatsAppLink(WHATSAPP_NUMBER, c.brand, c.model, c.year, c.price, c.ref_number, carUrl)

  return (
    <>
      <CarDetailClient car={c} imageUrls={imageUrls} whatsappLink={whatsappLink} carUrl={carUrl} shareText={shareText} />
      <SimilarCars currentCar={c} />
    </>
  )
}
