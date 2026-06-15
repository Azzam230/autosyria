import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { formatPrice, getImageUrl } from "@/lib/utils"
import type { Metadata } from "next"
import CarDetail from "@/components/car/CarDetail"

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

export default async function CarPage({ params }: PageProps) {
  const { id } = await params
  return <CarDetail id={id} />
}
