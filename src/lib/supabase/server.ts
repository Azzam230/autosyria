import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const supabaseUrlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseUrl = supabaseUrlRaw?.replace(/\/rest\/v1\/?$/, '')

  console.log("[supabase/server] URL:", supabaseUrl?.substring(0, 30) + "...")
  console.log("[supabase/server] KEY exists:", !!supabaseKey)
  console.log("[supabase/server] KEY is placeholder:", supabaseKey === "your_supabase_anon_key_here")

  if (!supabaseUrl?.startsWith('http') || !supabaseKey || supabaseKey === 'your_supabase_anon_key_here') {
    console.log("[supabase/server] RETURNING NULL - config not valid")
    return null as any
  }

  console.log("[supabase/server] Creating Supabase client...")
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll() {
        // no-op: cannot modify cookies in Server Components
      },
    },
  })
}
