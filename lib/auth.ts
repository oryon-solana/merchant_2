import { createSupabaseClient, getBearerToken } from './supabase'

export async function getAuthUser(request: Request) {
  const token = getBearerToken(request)
  if (!token) return null

  const supabase = createSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) return null
  return user
}

export function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
