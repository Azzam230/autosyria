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

function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || key === "your_supabase_anon_key_here") return null
  return createClient(url.replace(/\/rest\/v1\/?$/, ''), key)
}

export async function GET() {
  const supabase = getPublicSupabase()
  if (!supabase) return NextResponse.json([])

  const { data, error } = await supabase.from("brands").select("*").order("name")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const supabase = await getAuthedClient()
    if (!supabase) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

    let body: Record<string, unknown>
    try { body = await request.json() } catch { return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 }) }

    const name = typeof body.name === "string" ? body.name.trim() : ""
    const logo_url = typeof body.logo_url === "string" ? body.logo_url.trim() : ""

    if (!name) return NextResponse.json({ error: "اسم الماركة مطلوب" }, { status: 400 })

    const { data, error } = await supabase.from("brands").insert([{ name, logo_url: logo_url || null }]).select().single()
    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "الماركة موجودة مسبقاً" }, { status: 409 })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "خطأ" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await getAuthedClient()
    if (!supabase) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

    let body: Record<string, unknown>
    try { body = await request.json() } catch { return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 }) }

    const id = body.id as string
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const logo_url = typeof body.logo_url === "string" ? body.logo_url.trim() : ""

    if (!id || !name) return NextResponse.json({ error: "المعرف والاسم مطلوبان" }, { status: 400 })

    const { data, error } = await supabase.from("brands").update({ name, logo_url: logo_url || null }).eq("id", id).select().single()
    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "الماركة موجودة مسبقاً" }, { status: 409 })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "خطأ" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await getAuthedClient()
    if (!supabase) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 })

    const { error } = await supabase.from("brands").delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "خطأ" }, { status: 500 })
  }
}
