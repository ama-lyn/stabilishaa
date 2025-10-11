import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Check wallet balance
    const wallet = await db.wallets.findByUserId(auth.userId)

    if (!wallet || Number.parseFloat(wallet.balance_kes) < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Update SACCO balance
    await db.saccoAccounts.updateContribution(auth.userId, amount)

    // Deduct from wallet
    const newBalance = Number.parseFloat(wallet.balance_kes) - amount
    await db.wallets.updateBalance(auth.userId, newBalance, Number.parseFloat(wallet.balance_usd))

    // Create transaction record
    await db.transactions.create({
      walletId: wallet.id,
      userId: auth.userId,
      type: "debit",
      category: "sacco_contribution",
      amount,
      currency: "KES",
      description: "SACCO contribution",
      blockchainHash: `0x${Math.random().toString(36).substring(2, 15)}`,
    })

    return NextResponse.json({ message: "Contribution successful" })
  } catch (error) {
    console.error("[v0] SACCO contribution error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
