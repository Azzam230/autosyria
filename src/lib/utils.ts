export function formatPrice(price: number): string {
  return price.toLocaleString('en-US') + ' $'
}

export function generateWhatsAppLink(
  phone: string,
  brand: string,
  model: string,
  year: number,
  price: number,
  ref_number?: number,
  carUrl?: string
): string {
  const ref = ref_number ? ` (رقم ${ref_number})` : ''
  const url = carUrl ? `\n\n${carUrl}` : ''
  const text = encodeURIComponent(
    `مرحباً SiwdaCars، أنا مهتم بالسيارة ${brand} ${model} ${year}${ref} المعروضة بسعر ${formatPrice(price)}.${url}`
  )
  return `https://wa.me/${phone}?text=${text}`
}

export function getImageUrl(imagePath: string, bucket: string = "car-images"): string {
  if (imagePath.startsWith('http')) return imagePath
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${imagePath}`
}
