export function formatPrice(price: number): string {
  return price.toLocaleString('en-US') + ' $'
}

export function generateWhatsAppLink(
  phone: string,
  brand: string,
  model: string,
  year: number,
  price: number
): string {
  const text = encodeURIComponent(
    `مرحباً Auto Syria، أنا مهتم بالسيارة ${brand} ${model} ${year} المعروضة بسعر ${formatPrice(price)}. أريد معرفة التفاصيل.`
  )
  return `https://wa.me/${phone}?text=${text}`
}

export function getImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http')) return imagePath
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${supabaseUrl}/storage/v1/object/public/car-images/${imagePath}`
}
