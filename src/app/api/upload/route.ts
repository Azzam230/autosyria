import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

async function getAuthedClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const url = rawUrl?.replace(/\/rest\/v1\/?$/, '')
  if (!url || !anonKey || anonKey === "your_supabase_anon_key_here") return null

  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  const authCookie = allCookies.find(c => c.name.startsWith("sb-") && c.name.includes("auth-token") && !c.name.endsWith("-code-verifier"))
  if (!authCookie) return null

  try {
    const raw = authCookie.value
    let sessionStr: string

    if (raw.startsWith("base64-")) {
      sessionStr = Buffer.from(raw.slice(7), "base64url").toString()
    } else {
      sessionStr = raw
    }

    const session = JSON.parse(sessionStr)
    const accessToken = session.access_token
    if (!accessToken) return null

    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    return supabase
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getAuthedClient()
    if (!supabase) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "الملف مطلوب" }, { status: 400 })

    const bucket = (formData.get("bucket") as string) || "brand-logos"
    if (!["brand-logos", "ad-images"].includes(bucket)) return NextResponse.json({ error: "Bucket غير مدعوم" }, { status: 400 })

    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 })
    if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "الملف كبير جداً (حد أقصى 2MB)" }, { status: 400 })

    const ext = file.name.split(".").pop()
    const prefix = bucket === "brand-logos" ? "brands/" : "ads/"
    const filePath = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { contentType: file.type, upsert: true })

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })
    return NextResponse.json({ path: filePath })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "خطأ غير متوقع" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await getAuthedClient()
    if (!supabase) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")
    if (!path) return NextResponse.json({ error: "المسار مطلوب" }, { status: 400 })

    const bucket = path.startsWith("ads/") ? "ad-images" : "brand-logos"
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "خطأ غير متوقع" }, { status: 500 })
  }
}
