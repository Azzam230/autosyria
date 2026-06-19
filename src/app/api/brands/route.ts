import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

async function getAuthClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const url = rawUrl?.replace(/\/rest\/v1\/?$/, '')
  if (!url || !key || key === "your_supabase_anon_key_here") return null
  const cookieStore = await cookies()
  const ssrClient = createServerClient(url, key, {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await ssrClient.auth.getUser()
  if (!user) return null
  const { data: { session } } = await ssrClient.auth.getSession()
  if (!session?.access_token) return null
  const dataClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${session.access_token}` } },
  })
  return dataClient
}

function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  console.log("[api/brands] getPublicSupabase - URL:", url?.substring(0, 30)+"...", "KEY starts with:", key?.substring(0, 20)+"...")
  if (!url || !key || key === "your_supabase_anon_key_here") { console.log("[api/brands] getPublicSupabase: returning null"); return null }
  const baseUrl = url.replace(/\/rest\/v1\/?$/, '')
  return createClient(baseUrl, key)
}

export async function GET() {
  console.log("[api/brands] GET called")
  const supabase = getPublicSupabase()
  if (!supabase) { console.log("[api/brands] supabase null, returning []"); return NextResponse.json([]) }
  console.log("[api/brands] Executing query...")
  const { data, error } = await supabase.from("brands").select("*").order("name")
  if (error) { console.error("[api/brands] QUERY ERROR:", error.message, error.code); return NextResponse.json({ error: error.message }, { status: 500 }) }
  console.log("[api/brands] Success, brands:", data?.length)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const supabase = await getAuthClient()
    if (!supabase) return NextResponse.json({ error: "قاعدة البيانات غير متصلة" }, { status: 500 })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

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
    const supabase = await getAuthClient()
    if (!supabase) return NextResponse.json({ error: "قاعدة البيانات غير متصلة" }, { status: 500 })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

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
    const supabase = await getAuthClient()
    if (!supabase) return NextResponse.json({ error: "قاعدة البيانات غير متصلة" }, { status: 500 })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

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
