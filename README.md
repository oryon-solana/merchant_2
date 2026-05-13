# Sizzle — Merchant Dummy for Oryon Solana Points Exchange

Sizzle is a dummy merchant application built with Next.js that simulates a loyalty points ecosystem integrated with **Oryon** on the Solana blockchain. Customers shop, earn points, and can exchange those points — while behind the scenes, points are minted as SPL Tokens on-chain via the Oryon smart contract.

---

## System Architecture

```
Customer (Browser)
       │
       ▼
Next.js App (Sizzle)
  ├── Frontend (App Router, React 19)
  ├── API Routes (auth, products, cart, orders, points)
  └── Backend Libs
        ├── Supabase (database & session)
        ├── JWT (auth token)
        └── lib/solana.ts ──► Oryon Smart Contract (Solana Devnet/Mainnet)
                                     │
                                     ▼
                              SPL Token Mint (Points)
```

### Points Flow (End-to-End)

1. Customer logs in → connects Phantom Wallet on the **Profile** page
2. Customer browses the menu → adds to cart → **Checkout**
3. Server calculates points: `total_spend_IDR ÷ 12,000 = points_earned`
4. Points are saved in Supabase (`user_points`, `point_transactions`)
5. Server calls the **`earn_points`** instruction on the Oryon smart contract → SPL Tokens are minted to the customer's wallet (best-effort, non-fatal)
6. Customer can view their balance on the **Rewards** page and exchange points

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Framer Motion, AOS |
| Auth | JWT (jsonwebtoken) + Google OAuth |
| Database | Supabase (PostgreSQL) |
| Blockchain | Solana Web3.js, SPL Token, Anchor (Oryon program) |
| Wallet | Phantom Wallet (browser extension) |

---

## Page Structure

| Route | Description | Auth? |
|---|---|---|
| `/` | Landing page (hero, menu tiles, redeem section) | No |
| `/menu` | Browse & select menu (fetched from `/api/shop`) | No |
| `/cart` | View cart, change quantity, checkout | Yes |
| `/orders` | Order history and points earned | Yes |
| `/orders/[id]` | Single order detail | Yes |
| `/rewards` | Exchange points for special menu items | Yes |
| `/profile` | View points balance, connect Phantom Wallet, simulate points-to-e-wallet conversion | Yes |
| `/signin` | Login with email/password | — |
| `/signup` | Register a new account | — |
| `/login` | Login alias | — |
| `/register` | Register alias | — |
| `/auth/callback` | Google OAuth callback | — |

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new account (email, password, name) |
| POST | `/api/auth/login` | Login → receive JWT access_token (7 days) |
| POST | `/api/auth/logout` | Logout (client deletes token) |
| GET | `/api/auth/me` | Fetch user profile from token |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/google` | Redirect to Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |

All endpoints requiring auth use the header:
```
Authorization: Bearer <access_token>
```

---

### Products & Shop

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/shop` | Public product list (no auth required), used by `/menu` page |
| GET | `/api/products` | Product list owned by the logged-in merchant |
| POST | `/api/products` | Add a new product |
| GET | `/api/products/[id]` | Single product detail |
| PATCH/DELETE | `/api/products/[id]` | Update / delete product |

---

### Cart

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/cart` | — | View cart contents + total price |
| POST | `/api/cart` | `{ product_id, quantity }` | Add item (upsert if already exists) |
| PATCH | `/api/cart/[id]` | `{ quantity }` | Update item quantity |
| DELETE | `/api/cart/[id]` | — | Remove item from cart |

---

### Orders (Checkout)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | User order history |
| POST | `/api/orders` | **Checkout** — pay from cart, calculate & mint points, clear cart |
| GET | `/api/orders/[id]` | Specific order detail |

**Checkout response (`POST /api/orders`):**
```json
{
  "order": {
    "id": "uuid",
    "total_amount": 75000,
    "points_earned": 6,
    "status": "pending",
    "items": [...]
  },
  "points_summary": {
    "earned": 6,
    "total": 46,
    "message": "You earned 6 points!",
    "onchain_tx": "5xKj...abc"
  }
}
```

`onchain_tx` is the Solana transaction signature. It is `null` if the user has not connected a wallet or if the on-chain mint failed (the order still succeeds).

---

### Points & Wallet

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/points` | — | Points balance, wallet address, transaction history |
| PATCH | `/api/points` | `{ wallet_address }` | Save / update Solana wallet address |
| GET | `/api/wallet/[address]` | — | Look up points by wallet address |
| PATCH | `/api/wallet/[address]` | `{ points }` | Reset points balance (for testing/Oryon integration) |

---

## Oryon Solana Integration

File: [lib/solana.ts](lib/solana.ts)

### How It Works

On every checkout, the server calls the **`earn_points`** instruction on the Oryon Anchor program:

```
Merchant Keypair (server-side)
        │
        ▼
Instruction: earn_points(spend_amount_idr: u64)
        │
Required accounts:
  ├── merchantPDA        (derived: ["merchant", merchantAuthority])
  ├── pointsMint         (SPL Token mint owned by Oryon)
  ├── userTokenAccount   (customer's ATA)
  ├── user               (customer pubkey)
  ├── merchantAuthority  (signer = server keypair)
  ├── TOKEN_PROGRAM_ID
  ├── ASSOCIATED_TOKEN_PROGRAM_ID
  └── SystemProgram
```

This instruction mints SPL Token loyalty points directly to the customer's **Associated Token Account**.

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# JWT
JWT_SECRET=replace-with-a-strong-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Solana / Oryon
NEXT_PUBLIC_PROGRAM_ID=<Oryon_Program_PublicKey>
MERCHANT_POINTS_MINT=<SPL_Token_Mint_PublicKey>
MERCHANT_PRIVATE_KEY=<bs58_encoded_64byte_secret_key>
SOLANA_RPC_URL=https://api.devnet.solana.com
```

> **Security note:** `MERCHANT_PRIVATE_KEY` is the merchant's private key used to sign on-chain transactions. Never expose it to the client side. This variable is only accessed server-side (no `NEXT_PUBLIC_` prefix).

---

## Database Schema (Supabase)

```sql
-- Main tables
users           (id, email, name, password_hash, created_at)
products        (id, user_id, name, description, price, stock, image_url, created_at)
cart_items      (id, user_id, product_id, quantity, created_at)
orders          (id, user_id, total_amount, points_earned, status, created_at)
order_items     (id, order_id, product_id, product_name, product_price, quantity, subtotal)
user_points     (user_id, total_points, wallet_address, updated_at)
point_transactions (id, user_id, order_id, points, type, note, created_at)
```

**Key columns:**
- `user_points.wallet_address` — customer's Solana wallet pubkey (base58). Set via the Profile page using Phantom Wallet.
- `point_transactions.type` — `'earned'` | `'redeemed'`
- `orders.status` — default `'pending'`

---

## Points Calculation

```
1 point = every Rp 12,000 spent
points_earned = floor(total_IDR / 12,000)
```

Example: spend Rp 75,000 → earn **6 points**.

---

## Profile Page — Key Features

- **View points balance** (from `/api/points`)
- **Connect Phantom Wallet** → saves wallet address to Supabase → future points will be minted on-chain
- **Simulate points-to-e-wallet conversion** (GoPay, OVO, ShopeePay, DANA) — display only, no real transactions

Points-to-IDR conversion rates (simulation):

| E-Wallet | Rate per point |
|---|---|
| GoPay | Rp 12 |
| OVO | Rp 11 |
| ShopeePay | Rp 13 |
| DANA | Rp 10.5 |

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env.local
# edit .env.local with your Supabase & Solana configuration

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build
npm run build
npm start
```

---

## Usage Flow (Demo Flow)

```
1. Open /signup → create an account
2. Login at /signin
3. Open /profile → click "Connect Phantom" → approve Phantom → wallet saved
4. Open /menu → select items → add to cart
5. Open /cart → click Checkout
   └── Server mints points to Phantom Wallet via Oryon smart contract
6. Open /orders → view order + points earned + onchain_tx signature
7. Open /rewards → exchange points for special menu items
```

---

## Oryon Integration Notes

- On-chain minting is **best-effort**: if the Solana transaction fails (RPC error, merchant SOL balance depleted, etc.), the order still succeeds and points are still saved in Supabase.
- The `earn_points` instruction discriminator follows the Anchor standard: `sha256("global:earn_points")[0:8]` = `[75, 160, 182, 236, 70, 39, 168, 6]`.
- The merchant keypair needs sufficient SOL to pay transaction fees.
- The `PATCH /api/wallet/[address]` endpoint can be used by Oryon to sync on-chain balances back to the database.
