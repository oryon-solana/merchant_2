import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import bs58 from 'bs58'

// Anchor discriminator for earn_points = sha256("global:earn_points")[0:8]
const EARN_POINTS_DISCRIMINATOR = Buffer.from([75, 160, 182, 236, 70, 39, 168, 6])

function getMerchantKeypair(): Keypair {
  const raw = process.env.MERCHANT_PRIVATE_KEY!
  // bs58-encoded 64-byte secret key
  const secretKey = bs58.decode(raw)
  return Keypair.fromSecretKey(secretKey)
}

function getMerchantPDA(programId: PublicKey, merchantAuthority: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('merchant'), merchantAuthority.toBuffer()],
    programId
  )
  return pda
}

/**
 * Calls the on-chain earn_points instruction.
 * Returns the tx signature, or null if the user has no wallet set.
 */
export async function callEarnPoints(
  userWalletAddress: string | null,
  spendAmountIdr: number
): Promise<string | null> {
  if (!userWalletAddress) return null

  const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!)
  const pointsMint = new PublicKey(process.env.MERCHANT_POINTS_MINT!)
  const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed')

  const merchantKeypair = getMerchantKeypair()
  const merchantAuthority = merchantKeypair.publicKey
  const merchantPDA = getMerchantPDA(programId, merchantAuthority)

  const user = new PublicKey(userWalletAddress)
  const userTokenAccount = getAssociatedTokenAddressSync(pointsMint, user)

  // Encode u64 as 8-byte little-endian
  const amountBuf = Buffer.alloc(8)
  amountBuf.writeBigUInt64LE(BigInt(spendAmountIdr))

  const data = Buffer.concat([EARN_POINTS_DISCRIMINATOR, amountBuf])

  const keys = [
    { pubkey: merchantPDA, isSigner: false, isWritable: true },
    { pubkey: pointsMint, isSigner: false, isWritable: true },
    { pubkey: userTokenAccount, isSigner: false, isWritable: true },
    { pubkey: user, isSigner: false, isWritable: false },
    { pubkey: merchantAuthority, isSigner: true, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ]

  const ix = new TransactionInstruction({ programId, keys, data })

  const tx = new Transaction().add(ix)
  tx.feePayer = merchantAuthority

  const sig = await sendAndConfirmTransaction(connection, tx, [merchantKeypair], {
    commitment: 'confirmed',
  })

  return sig
}
