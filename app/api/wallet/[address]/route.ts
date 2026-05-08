import { createSupabaseAdminClient } from '@/lib/supabase'

// GET /api/wallet/:address — fetch points for a wallet address
export async function GET(_req: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params
  const supabase = createSupabaseAdminClient()

  const { data, error } = await supabase
    .from('user_points')
    .select('user_id, total_points, wallet_address, updated_at')
    .eq('wallet_address', address)
    .single()

  if (error || !data) {
    return Response.json({ error: 'Wallet address not found' }, { status: 404 })
  }

  return Response.json({
    wallet_address: data.wallet_address,
    total_points: data.total_points,
    updated_at: data.updated_at,
  })
}

// PATCH /api/wallet/:address — set points for a wallet address
// Body: { points: number }
export async function PATCH(request: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params

  let body: { points?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const points = Number(body.points)
  if (!Number.isFinite(points) || points < 0 || !Number.isInteger(points)) {
    return Response.json({ error: 'points must be a non-negative integer' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  const { data, error } = await supabase
    .from('user_points')
    .update({ total_points: points, updated_at: new Date().toISOString() })
    .eq('wallet_address', address)
    .select('wallet_address, total_points, updated_at')
    .single()

  if (error || !data) {
    return Response.json({ error: 'Wallet address not found' }, { status: 404 })
  }

  return Response.json({
    wallet_address: data.wallet_address,
    total_points: data.total_points,
    updated_at: data.updated_at,
  })
}
