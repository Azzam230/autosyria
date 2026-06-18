import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://siwdacars.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/sell`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ]

  if (!supabase) return staticRoutes

  const { data: cars } = await supabase
    .from("cars")
    .select("id, updated_at")
    .eq("status", "available")
    .order("updated_at", { ascending: false })

  if (!cars) return staticRoutes

  const carRoutes: MetadataRoute.Sitemap = cars.map((car: { id: string; updated_at: string | null }) => ({
    url: `${BASE_URL}/cars/${car.id}`,
    lastModified: new Date(car.updated_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...carRoutes]
}
