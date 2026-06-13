import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { formatPrice, getImageUrl, generateWhatsAppLink } from "@/lib/utils"
import { WHATSAPP_NUMBER } from "@/lib/constants"
import type { Metadata } from "next"
import type { Car } from "@/lib/types"
import CarDetailClient from "./CarDetailClient"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  if (!supabase) return { title: "Auto Syria" }

  const { data } = await supabase.from("cars").select("brand, model, year, price").eq("id", id).single()
  if (!data) return { title: "السيارة غير موجودة | Auto Syria" }

  return {
    title: `${data.brand} ${data.model} ${data.year} | Auto Syria`,
    description: `${data.brand} ${data.model} ${data.year} - ${formatPrice(data.price)}. تصفح تفاصيل السيارة وتواصل مع البائع.`,
  }
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  if (!supabase) notFound()

  const { data: car } = await supabase.from("cars").select("*").eq("id", id).single()

  if (!car || car.status !== "available") notFound()

  const c = car as Car
  const imageUrls = (c.images || []).map(getImageUrl)
  const whatsappLink = generateWhatsAppLink(WHATSAPP_NUMBER, c.brand, c.model, c.year, c.price, c.ref_number)

  return <CarDetailClient car={c} imageUrls={imageUrls} whatsappLink={whatsappLink} />
}
