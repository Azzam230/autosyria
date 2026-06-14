import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const rateLimit = new Map<string, number>()

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const now = Date.now()
  const lastRequest = rateLimit.get(ip)

  if (lastRequest && now - lastRequest < 60000) {
    return NextResponse.json(
      { error: "الرجاء الانتظار دقيقة قبل إرسال طلب آخر" },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 })
  }

  const brand = typeof body.brand === "string" ? body.brand.trim() : ""
  const model = typeof body.model === "string" ? body.model.trim() : ""
  const year = typeof body.year === "number" ? body.year : Number(body.year)
  const expected_price = typeof body.expected_price === "number" ? body.expected_price : Number(body.expected_price)
  const phone_number = typeof body.phone_number === "string" ? body.phone_number.trim() : ""

  const errors: string[] = []
  if (!brand) errors.push("الماركة مطلوبة")
  if (!model || model.length < 2) errors.push("الموديل مطلوب")
  if (!year || year < 1990 || year > 2027) errors.push("سنة الصنع غير صحيحة")
  if (!expected_price || expected_price <= 0) errors.push("السعر غير صحيح")
  if (!phone_number || phone_number.length < 7) errors.push("رقم الهاتف غير صحيح")

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { error } = await supabase.from("sell_requests").insert([
    { brand, model, year, expected_price, phone_number },
  ])

  if (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً." },
      { status: 500 }
    )
  }

  rateLimit.set(ip, now)

  return NextResponse.json({ success: true })
}
