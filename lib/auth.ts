import jwt from 'jsonwebtoken'
import { createSupabaseAdminClient, getBearerToken } from './supabase'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '7d'

export interface TokenPayload {
  sub: string   // user id
  email: string
  name?: string
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export async function getAuthUser(request: Request) {
  const token = getBearerToken(request)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const supabase = createSupabaseAdminClient()
  const { data: user } = await supabase
    .from('users')
    .select('id, email, name, created_at')
    .eq('id', payload.sub)
    .single()

  return user ?? null
}

export function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
