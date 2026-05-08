import { getAuthUser, unauthorized } from '@/lib/auth'

export async function GET(request: Request) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  return Response.json({
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
  })
}
