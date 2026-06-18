import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url?.startsWith('http') || !key || key === 'your_supabase_anon_key_here') {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }

  client = createBrowserClient(url, key)
  return client
}
