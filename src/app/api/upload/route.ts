import { NextResponse } from "next/server"

async function getSupabase() {
  const { createClient } = await import("@supabase/supabase-js")
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "الملف مطلوب" }, { status: 400 })

    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 })

    if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "الملف كبير جداً (حد أقصى 2MB)" }, { status: 400 })

    const bytes = await file.bytes()
    const supabase = await getSupabase()

    const ext = file.name.split(".").pop()
    const filePath = `brands/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("brand-logos")
      .upload(filePath, bytes, { contentType: file.type, upsert: true })

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

    return NextResponse.json({ path: filePath })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "خطأ غير متوقع" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")
    if (!path) return NextResponse.json({ error: "المسار مطلوب" }, { status: 400 })

    const supabase = await getSupabase()
    const { error } = await supabase.storage.from("brand-logos").remove([path])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "خطأ غير متوقع" }, { status: 500 })
  }
}
