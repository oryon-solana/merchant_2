import { createSupabaseAdminClient } from '@/lib/supabase'
import { getAuthUser, unauthorized } from '@/lib/auth'

// GET /api/points — balance, wallet address, and transaction history
export async function GET(request: Request) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const supabase = createSupabaseAdminClient()

  const [pointsResult, historyResult] = await Promise.all([
    supabase
      .from('user_points')
      .select('total_points, wallet_address, updated_at')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('point_transactions')
      .select('id, points, type, note, created_at, order_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return Response.json({
    total_points: pointsResult.data?.total_points ?? 0,
    wallet_address: pointsResult.data?.wallet_address ?? null,
    last_updated: pointsResult.data?.updated_at ?? null,
    history: historyResult.data ?? [],
  })
}

// PATCH /api/points — save Solana wallet address
export async function PATCH(request: Request) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  let body: { wallet_address?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { wallet_address } = body
  if (!wallet_address) {
    return Response.json({ error: 'wallet_address is required' }, { status: 400 })
  }

  // Basic Solana address validation: base58, 32–44 chars
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet_address)) {
    return Response.json({ error: 'Invalid Solana wallet address' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  // Upsert: insert row if user has never earned points yet, otherwise just update wallet_address
  const { error } = await supabase
    .from('user_points')
    .upsert(
      { user_id: user.id, wallet_address },
      { onConflict: 'user_id' },
    )

  if (error) {
    const msg = error.code === '23505' ? 'Wallet address already linked to another account' : error.message
    return Response.json({ error: msg }, { status: 400 })
  }

  return Response.json({ wallet_address })
}
