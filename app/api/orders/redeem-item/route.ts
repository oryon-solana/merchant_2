import { createSupabaseAdminClient } from '@/lib/supabase'
import { getAuthUser, unauthorized } from '@/lib/auth'

const IDR_PER_POINT  = 1000   // 1 point redeems Rp1,000
const POINTS_PER_IDR = 12000  // 1 point earned per Rp12,000 spent

// POST /api/orders/redeem-item — buy a single product using points
export async function POST(request: Request) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  let body: { product_id?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { product_id } = body
  if (!product_id) {
    return Response.json({ error: 'product_id is required' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  // 1. fetch product
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, price, stock')
    .eq('id', product_id)
    .is('user_id', null)
    .single()

  if (productError || !product) {
    return Response.json({ error: 'Product not found' }, { status: 404 })
  }

  if (product.stock < 1) {
    return Response.json({ error: `"${product.name}" is out of stock` }, { status: 400 })
  }

  // 2. calculate points cost and points earned
  const pointsCost   = Math.ceil(product.price / IDR_PER_POINT)
  const pointsEarned = Math.floor(product.price / POINTS_PER_IDR)

  // 3. check user balance
  const { data: pointsRow } = await supabase
    .from('user_points')
    .select('total_points')
    .eq('user_id', user.id)
    .single()

  const currentPoints = pointsRow?.total_points ?? 0
  if (currentPoints < pointsCost) {
    return Response.json(
      { error: `Not enough points. Need ${pointsCost} pts, you have ${currentPoints} pts.` },
      { status: 400 }
    )
  }

  // 4. create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: product.price,
      points_earned: pointsEarned,
      points_spent: pointsCost,
      payment_method: 'points',
    })
    .select()
    .single()

  if (orderError) return Response.json({ error: orderError.message }, { status: 500 })

  // 5. create order item
  const { error: itemError } = await supabase.from('order_items').insert({
    order_id: order.id,
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    quantity: 1,
    subtotal: product.price,
  })
  if (itemError) return Response.json({ error: itemError.message }, { status: 500 })

  // 6. reduce product stock
  await supabase
    .from('products')
    .update({ stock: product.stock - 1 })
    .eq('id', product.id)

  // 7. deduct spent points, add earned points
  const newTotal = currentPoints - pointsCost + pointsEarned
  await supabase
    .from('user_points')
    .update({ total_points: newTotal, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  // 8. record transactions
  const transactions = [
    {
      user_id: user.id,
      order_id: order.id,
      points: -pointsCost,
      type: 'redeemed',
      note: `Redeemed "${product.name}"`,
    },
  ]
  if (pointsEarned > 0) {
    transactions.push({
      user_id: user.id,
      order_id: order.id,
      points: pointsEarned,
      type: 'earned',
      note: `Earned from order #${order.id.slice(0, 8)}`,
    })
  }
  await supabase.from('point_transactions').insert(transactions)

  return Response.json(
    {
      order: {
        id: order.id,
        product_name: product.name,
        total_amount: product.price,
        points_spent: pointsCost,
        points_earned: pointsEarned,
      },
      points_summary: {
        spent: pointsCost,
        earned: pointsEarned,
        remaining: newTotal,
      },
    },
    { status: 201 }
  )
}
