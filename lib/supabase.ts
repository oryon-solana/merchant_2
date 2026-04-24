import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

export function createSupabaseAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

export function getBearerToken(request: Request): string | null {
  const auth = request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return null
  return auth.slice(7)
}
