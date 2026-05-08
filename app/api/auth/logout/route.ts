// JWT logout is stateless — the client drops the token.
// This endpoint exists for compatibility and returns success immediately.
export async function POST() {
  return Response.json({ message: 'Logged out successfully' })
}
