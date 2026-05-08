import { verifyToken, signToken } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function POST(request: Request) {
  let body: { refresh_token?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { refresh_token } = body
  if (!refresh_token) {
    return Response.json({ error: 'refresh_token is required' }, { status: 400 })
  }

  const payload = verifyToken(refresh_token)
  if (!payload) {
    return Response.json({ error: 'Invalid or expired refresh token' }, { status: 401 })
  }

  // Confirm user still exists
  const supabase = createSupabaseAdminClient()
  const { data: user } = await supabase
    .from('users')
    .select('id, email, name')
    .eq('id', payload.sub)
    .single()

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 401 })
  }

  const token = signToken({ sub: user.id, email: user.email, name: user.name ?? undefined })

  return Response.json({
    access_token: token,
    refresh_token: token,
    token_type: 'Bearer',
    expires_in: 604800,
    user: { id: user.id, email: user.email, name: user.name },
  })
}
