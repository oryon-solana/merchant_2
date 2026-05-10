import { createSupabaseAdminClient } from '@/lib/supabase'
import { getAuthUser, unauthorized } from '@/lib/auth'

const IDR_PER_POINT = 1000   // 1 point redeems Rp1,000
const POINTS_PER_IDR = 12000 // 1 point earned per Rp12,000 spent

// POST /api/orders/redeem — checkout using points instead of money
export async function POST(request: Request) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const supabase = createSupabaseAdminClient()

  // 1. load cart with product details
  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items')
    .select('id, quantity, product:products(id, name, price, stock)')
    .eq('user_id', user.id)

  if (cartError) return Response.json({ error: cartError.message }, { status: 500 })
  if (!cartItems || cartItems.length === 0) {
    return Response.json({ error: 'Cart is empty' }, { status: 400 })
  }

  type CartProduct = { id: string; name: string; price: number; stock: number }

  // 2. validate stock
  for (const item of cartItems) {
    const product = item.product as unknown as CartProduct
    if (product.stock < item.quantity) {
      return Response.json(
        { error: `Not enough stock for "${product.name}" (available: ${product.stock})` },
        { status: 400 }
      )
    }
  }

  // 3. calculate total and points cost
  const total = cartItems.reduce((sum, item) => {
    const product = item.product as unknown as CartProduct
    return sum + product.price * item.quantity
  }, 0)

  const pointsCost = Math.ceil(total / IDR_PER_POINT)
  const pointsEarned = Math.floor(total / POINTS_PER_IDR)

  // 4. check user has enough points
  const { data: pointsRow } = await supabase
    .from('user_points')
    .select('total_points')
    .eq('user_id', user.id)
    .single()

  const currentPoints = pointsRow?.total_points ?? 0
  if (currentPoints < pointsCost) {
    return Response.json(
      { error: `Not enough points. You need ${pointsCost} pts but have ${currentPoints} pts.` },
      { status: 400 }
    )
  }

  // 5. create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: total,
      points_earned: pointsEarned,
      points_spent: pointsCost,
      payment_method: 'points',
    })
    .select()
    .single()

  if (orderError) return Response.json({ error: orderError.message }, { status: 500 })

  // 6. create order items
  const orderItems = cartItems.map((item) => {
    const product = item.product as unknown as CartProduct
    return {
      order_id: order.id,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    }
  })

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) return Response.json({ error: itemsError.message }, { status: 500 })

  // 7. reduce product stock
  for (const item of cartItems) {
    const product = item.product as unknown as CartProduct
    await supabase
      .from('products')
      .update({ stock: product.stock - item.quantity })
      .eq('id', product.id)
  }

  // 8. deduct spent points, add earned points
  const newTotal = currentPoints - pointsCost + pointsEarned
  await supabase
    .from('user_points')
    .update({ total_points: newTotal, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  // 9. record both transactions
  const transactions = [
    {
      user_id: user.id,
      order_id: order.id,
      points: -pointsCost,
      type: 'redeemed',
      note: `Redeemed for order #${order.id.slice(0, 8)}`,
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

  // 10. clear cart
  await supabase.from('cart_items').delete().eq('user_id', user.id)

  return Response.json(
    {
      order: {
        id: order.id,
        total_amount: total,
        points_spent: pointsCost,
        points_earned: pointsEarned,
        status: order.status,
        items: orderItems.map((i) => ({
          product_name: i.product_name,
          quantity: i.quantity,
          subtotal: i.subtotal,
        })),
      },
      points_summary: {
        spent: pointsCost,
        earned: pointsEarned,
        remaining: newTotal,
        message: `Used ${pointsCost} pts to pay${pointsEarned > 0 ? `, earned ${pointsEarned} pts back!` : '!'}`,
      },
    },
    { status: 201 }
  )
}
