import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

async function getAuthSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )
}

function getPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET() {
  const { data, error } = await getPublicSupabase().from("brands").select("*").order("name")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const supabase = await getAuthSupabase()
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
    const supabase = await getAuthSupabase()
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
    const supabase = await getAuthSupabase()
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
