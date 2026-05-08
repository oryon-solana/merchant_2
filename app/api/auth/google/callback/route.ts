import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { signToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin

  if (error || !code) {
    return Response.redirect(`${baseUrl}/login?error=google_denied`)
  }

  // Verify CSRF state
  const cookieStore = await cookies()
  const storedState = cookieStore.get('oauth_state')?.value
  cookieStore.delete('oauth_state')

  if (!storedState || storedState !== state) {
    return Response.redirect(`${baseUrl}/login?error=invalid_state`)
  }

  // Exchange code for tokens
  const redirectUri = `${baseUrl}/api/auth/google/callback`
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
    }),
  })

  if (!tokenRes.ok) {
    return Response.redirect(`${baseUrl}/login?error=token_exchange_failed`)
  }

  const tokenData = await tokenRes.json()

  // Fetch Google user info
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })

  if (!userRes.ok) {
    return Response.redirect(`${baseUrl}/login?error=userinfo_failed`)
  }

  const googleUser: { id: string; email: string; name: string } = await userRes.json()

  const supabase = createSupabaseAdminClient()

  // Find existing user by google_id or email, or create new one
  let { data: user } = await supabase
    .from('users')
    .select('id, email, name')
    .eq('google_id', googleUser.id)
    .single()

  if (!user) {
    // Try matching by email (link accounts)
    const { data: byEmail } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', googleUser.email)
      .single()

    if (byEmail) {
      // Link Google to existing email account
      await supabase
        .from('users')
        .update({ google_id: googleUser.id })
        .eq('id', byEmail.id)
      user = byEmail
    } else {
      // Create new user
      const { data: created } = await supabase
        .from('users')
        .insert({ email: googleUser.email, name: googleUser.name, google_id: googleUser.id })
        .select('id, email, name')
        .single()
      user = created
    }
  }

  if (!user) {
    return Response.redirect(`${baseUrl}/login?error=user_creation_failed`)
  }

  const token = signToken({ sub: user.id, email: user.email, name: user.name ?? undefined })

  // Redirect to client callback page with token in URL
  const params = new URLSearchParams({
    token,
    user_id: user.id,
    user_email: user.email,
    user_name: user.name ?? '',
  })

  return Response.redirect(`${baseUrl}/auth/callback?${params}`)
}
