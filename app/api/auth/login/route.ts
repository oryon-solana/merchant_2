import bcrypt from 'bcryptjs'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { signToken } from '@/lib/auth'

export async function POST(request: Request) {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, password } = body

  if (!email || !password) {
    return Response.json({ error: 'email and password are required' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  const { data: user } = await supabase
    .from('users')
    .select('id, email, name, password_hash')
    .eq('email', email)
    .single()

  // Users created via Google OAuth have no password
  if (!user || !user.password_hash) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
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
