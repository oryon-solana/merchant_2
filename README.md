# Gourou — Merchant Dummy for Oryon Solana Points Exchange

Gourou adalah aplikasi merchant dummy berbasis Next.js yang mensimulasikan ekosistem loyalty points terintegrasi dengan **Oryon** di Solana blockchain. Pelanggan berbelanja, mendapatkan points, dan dapat menukar points tersebut — sementara di balik layar, points dicetak sebagai SPL Token on-chain melalui smart contract Oryon.

---

## Arsitektur Sistem

```
Pelanggan (Browser)
       │
       ▼
Next.js App (Gourou)
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

### Alur Points (End-to-End)

1. Pelanggan login → menghubungkan Phantom Wallet di halaman **Profile**
2. Pelanggan browsing menu → tambah ke cart → **Checkout**
3. Server menghitung points: `total_belanja_IDR ÷ 12.000 = points_earned`
4. Points disimpan di Supabase (`user_points`, `point_transactions`)
5. Server memanggil instruksi **`earn_points`** pada Oryon smart contract → SPL Token dicetak ke wallet pelanggan (best-effort, non-fatal)
6. Pelanggan bisa melihat saldo di halaman **Rewards** dan menukar points

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Framer Motion, AOS |
| Auth | JWT (jsonwebtoken) + Google OAuth |
| Database | Supabase (PostgreSQL) |
| Blockchain | Solana Web3.js, SPL Token, Anchor (Oryon program) |
| Wallet | Phantom Wallet (browser extension) |

---

## Struktur Halaman

| Route | Deskripsi | Auth? |
|---|---|---|
| `/` | Landing page (hero, menu tiles, redeem section) | Tidak |
| `/menu` | Browse & pilih menu (ambil dari `/api/shop`) | Tidak |
| `/cart` | Lihat keranjang, ubah quantity, checkout | Ya |
| `/orders` | Riwayat pesanan dan points yang diperoleh | Ya |
| `/orders/[id]` | Detail satu pesanan | Ya |
| `/rewards` | Tukar points dengan menu spesial | Ya |
| `/profile` | Lihat saldo points, hubungkan Phantom Wallet, simulasi konversi points ke e-wallet | Ya |
| `/signin` | Login dengan email/password | — |
| `/signup` | Register akun baru | — |
| `/login` | Alias login | — |
| `/register` | Alias register | — |
| `/auth/callback` | Google OAuth callback | — |

---

## API Endpoints

### Auth

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/register` | Daftar akun baru (email, password, name) |
| POST | `/api/auth/login` | Login → mendapat JWT access_token (7 hari) |
| POST | `/api/auth/logout` | Logout (client hapus token) |
| GET | `/api/auth/me` | Ambil profil user dari token |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/google` | Redirect ke Google OAuth |
| GET | `/api/auth/google/callback` | Callback Google OAuth |

Semua endpoint yang membutuhkan auth menggunakan header:
```
Authorization: Bearer <access_token>
```

---

### Products & Shop

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/shop` | Daftar produk publik (tanpa auth), dipakai halaman `/menu` |
| GET | `/api/products` | Daftar produk milik merchant yang login |
| POST | `/api/products` | Tambah produk baru |
| GET | `/api/products/[id]` | Detail satu produk |
| PATCH/DELETE | `/api/products/[id]` | Update / hapus produk |

---

### Cart

| Method | Endpoint | Body | Deskripsi |
|---|---|---|---|
| GET | `/api/cart` | — | Lihat isi keranjang + total harga |
| POST | `/api/cart` | `{ product_id, quantity }` | Tambah item (upsert jika sudah ada) |
| PATCH | `/api/cart/[id]` | `{ quantity }` | Update quantity item |
| DELETE | `/api/cart/[id]` | — | Hapus item dari keranjang |

---

### Orders (Checkout)

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/orders` | Riwayat pesanan user |
| POST | `/api/orders` | **Checkout** — bayar dari cart, hitung & mint points, kosongkan cart |
| GET | `/api/orders/[id]` | Detail pesanan tertentu |

**Response checkout (`POST /api/orders`):**
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

`onchain_tx` adalah signature transaksi Solana. Bernilai `null` jika user belum menghubungkan wallet atau on-chain mint gagal (pesanan tetap berhasil).

---

### Points & Wallet

| Method | Endpoint | Body | Deskripsi |
|---|---|---|---|
| GET | `/api/points` | — | Saldo points, wallet address, riwayat transaksi |
| PATCH | `/api/points` | `{ wallet_address }` | Simpan / update Solana wallet address |
| GET | `/api/wallet/[address]` | — | Lookup points berdasarkan wallet address |
| PATCH | `/api/wallet/[address]` | `{ points }` | Set ulang saldo points (untuk testing/integrasi Oryon) |

---

## Integrasi Oryon Solana

File: [lib/solana.ts](lib/solana.ts)

### Cara Kerja

Setiap checkout, server memanggil instruksi **`earn_points`** pada Oryon Anchor program:

```
Merchant Keypair (server-side)
        │
        ▼
Instruction: earn_points(spend_amount_idr: u64)
        │
Accounts yang diperlukan:
  ├── merchantPDA        (derived: ["merchant", merchantAuthority])
  ├── pointsMint         (SPL Token mint milik Oryon)
  ├── userTokenAccount   (ATA milik pelanggan)
  ├── user               (pubkey pelanggan)
  ├── merchantAuthority  (signer = server keypair)
  ├── TOKEN_PROGRAM_ID
  ├── ASSOCIATED_TOKEN_PROGRAM_ID
  └── SystemProgram
```

Instruksi ini mencetak SPL Token loyalty points langsung ke **Associated Token Account** milik pelanggan.

### Environment Variables

Buat file `.env.local` di root project:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# JWT
JWT_SECRET=ganti-dengan-secret-yang-kuat

# Google OAuth (opsional)
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Solana / Oryon
NEXT_PUBLIC_PROGRAM_ID=<Oryon_Program_PublicKey>
MERCHANT_POINTS_MINT=<SPL_Token_Mint_PublicKey>
MERCHANT_PRIVATE_KEY=<bs58_encoded_64byte_secret_key>
SOLANA_RPC_URL=https://api.devnet.solana.com
```

> **Catatan keamanan:** `MERCHANT_PRIVATE_KEY` adalah private key merchant yang menandatangani transaksi on-chain. Jangan pernah expose ke client-side. Variabel ini hanya diakses di server (tidak ada prefix `NEXT_PUBLIC_`).

---

## Database Schema (Supabase)

```sql
-- Tabel utama
users           (id, email, name, password_hash, created_at)
products        (id, user_id, name, description, price, stock, image_url, created_at)
cart_items      (id, user_id, product_id, quantity, created_at)
orders          (id, user_id, total_amount, points_earned, status, created_at)
order_items     (id, order_id, product_id, product_name, product_price, quantity, subtotal)
user_points     (user_id, total_points, wallet_address, updated_at)
point_transactions (id, user_id, order_id, points, type, note, created_at)
```

**Kolom penting:**
- `user_points.wallet_address` — Solana wallet pubkey pelanggan (base58). Diisi via halaman Profile menggunakan Phantom Wallet.
- `point_transactions.type` — `'earned'` | `'redeemed'`
- `orders.status` — default `'pending'`

---

## Kalkulasi Points

```
1 point = setiap Rp 12.000 yang dibelanjakan
points_earned = floor(total_IDR / 12.000)
```

Contoh: belanja Rp 75.000 → dapat **6 points**.

---

## Halaman Profile — Fitur Utama

- **Lihat saldo points** (dari `/api/points`)
- **Hubungkan Phantom Wallet** → menyimpan wallet address ke Supabase → points berikutnya akan di-mint on-chain
- **Simulasi konversi points ke e-wallet** (GoPay, OVO, ShopeePay, DANA) — hanya tampilan, tidak ada transaksi nyata

Rate konversi points ke IDR (simulasi):

| E-Wallet | Rate per point |
|---|---|
| GoPay | Rp 12 |
| OVO | Rp 11 |
| ShopeePay | Rp 13 |
| DANA | Rp 10.5 |

---

## Menjalankan Secara Lokal

```bash
# 1. Install dependencies
npm install

# 2. Salin dan isi environment variables
cp .env.example .env.local
# edit .env.local sesuai konfigurasi Supabase & Solana

# 3. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

```bash
# Build production
npm run build
npm start
```

---

## Alur Penggunaan (Demo Flow)

```
1. Buka /signup → buat akun
2. Login di /signin
3. Buka /profile → klik "Connect Phantom" → izinkan Phantom → wallet tersimpan
4. Buka /menu → pilih menu → tambah ke cart
5. Buka /cart → klik Checkout
   └── Server mencetak points ke Phantom Wallet via Oryon smart contract
6. Buka /orders → lihat pesanan + points yang diperoleh + onchain_tx signature
7. Buka /rewards → tukar points dengan menu spesial
```

---

## Catatan Integrasi Oryon

- On-chain mint bersifat **best-effort**: jika transaksi Solana gagal (RPC error, saldo SOL merchant habis, dsb.), pesanan tetap berhasil dan points tetap tersimpan di Supabase.
- Discriminator instruksi `earn_points` menggunakan standar Anchor: `sha256("global:earn_points")[0:8]` = `[75, 160, 182, 236, 70, 39, 168, 6]`.
- Merchant keypair perlu memiliki cukup SOL untuk membayar fee transaksi.
- Endpoint `PATCH /api/wallet/[address]` dapat digunakan oleh Oryon untuk sinkronisasi saldo on-chain kembali ke database.
