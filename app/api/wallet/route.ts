import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      wallet: {
        kesBalance: 45250.75,
        usdBalance: 312.50,
        pendingBalance: 2500.00,
        totalEarnings: 125000.00,
        totalSpent: 79749.25,
      },
      transactions: [
        {
          id: "1",
          type: "credit",
          category: "gig_payment",
          amount: 5000.00,
          currency: "KES",
          description: "Website design project",
          status: "completed",
          blockchainHash: "0x1234567890abcdef",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          type: "debit",
          category: "withdrawal",
          amount: 2000.00,
          currency: "KES",
          description: "M-Pesa withdrawal",
          status: "completed",
          blockchainHash: "0xabcdef1234567890",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
    })
  } catch (error) {
    console.error("[v0] Wallet fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
