import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || key === "your_supabase_anon_key_here") return null
  return createClient(url, key)
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(request: Request) {
  const supabase = getAnonClient()
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 })

  const { searchParams } = new URL(request.url)
  const position = searchParams.get("position")

  let query = supabase.from("ads").select("*").eq("is_active", true)
  if (position) query = query.eq("position", position)
  query = query.order("sort_order", { ascending: false })

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

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
    const authed = await getAuthedClient()
    if (!authed) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    const supabase = getServiceClient() || authed

    let body: Record<string, unknown>
    try { body = await request.json() } catch { return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 }) }

    const image_url = typeof body.image_url === "string" ? body.image_url.trim() : ""
    const link_url = typeof body.link_url === "string" ? body.link_url.trim() : ""
    const position = typeof body.position === "string" ? body.position.trim() : ""
    const alt_text = typeof body.alt_text === "string" ? body.alt_text.trim() : ""
    const sort_order = typeof body.sort_order === "number" ? body.sort_order : 0

    if (!image_url || !position) return NextResponse.json({ error: "الصورة والموقع مطلوبان" }, { status: 400 })

    const { data, error } = await supabase.from("ads").insert([
      { image_url, link_url: link_url || null, position, alt_text: alt_text || null, sort_order },
    ]).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "خطأ" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authed = await getAuthedClient()
    if (!authed) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    const supabase = getServiceClient() || authed

    let body: Record<string, unknown>
    try { body = await request.json() } catch { return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 }) }

    const id = body.id as string
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 })

    const updates: Record<string, unknown> = {}
    if (typeof body.image_url === "string") updates.image_url = body.image_url.trim()
    if (typeof body.link_url === "string") updates.link_url = body.link_url.trim() || null
    if (typeof body.position === "string") updates.position = body.position.trim()
    if (typeof body.alt_text === "string") updates.alt_text = body.alt_text.trim() || null
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active
    if (typeof body.sort_order === "number") updates.sort_order = body.sort_order
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from("ads").update(updates).eq("id", id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "خطأ" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const authed = await getAuthedClient()
    if (!authed) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    const supabase = getServiceClient() || authed

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 })

    const { error } = await supabase.from("ads").delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "خطأ" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    let body: { id: string; action: string }
    try { body = await request.json() } catch { return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 }) }

    const supabase = getServiceClient() || getAnonClient()
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 })

    if (body.action === "view") {
      const { error } = await supabase.rpc("increment_ad_views", { ad_id: body.id })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    } else if (body.action === "click") {
      const { error } = await supabase.rpc("increment_ad_clicks", { ad_id: body.id })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: "action must be 'view' or 'click'" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "خطأ" }, { status: 500 })
  }
}
