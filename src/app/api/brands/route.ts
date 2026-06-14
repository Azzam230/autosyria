import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabase(useServiceRole = false) {
  const key = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY!
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function GET() {
  const { data, error } = await getSupabase().from("brands").select("*").order("name")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 }) }

  const name = typeof body.name === "string" ? body.name.trim() : ""
  const logo_url = typeof body.logo_url === "string" ? body.logo_url.trim() : ""

  if (!name) return NextResponse.json({ error: "اسم الماركة مطلوب" }, { status: 400 })

  const { data, error } = await getSupabase(true).from("brands").insert([{ name, logo_url: logo_url || null }]).select().single()
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "الماركة موجودة مسبقاً" }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(request: Request) {
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 }) }

  const id = body.id as string
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const logo_url = typeof body.logo_url === "string" ? body.logo_url.trim() : ""

  if (!id || !name) return NextResponse.json({ error: "المعرف والاسم مطلوبان" }, { status: 400 })

  const { data, error } = await getSupabase(true).from("brands").update({ name, logo_url: logo_url || null }).eq("id", id).select().single()
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "الماركة موجودة مسبقاً" }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 })

  const { error } = await getSupabase(true).from("brands").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
