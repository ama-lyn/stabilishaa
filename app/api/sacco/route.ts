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
      sacco: {
        totalContributions: 15000.00,
        availableLoanAmount: 45000.00,
        activeLoanAmount: 0.00,
        loanDueDate: null,
        rotationPosition: 3,
        nextPayoutDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        members: ["user1", "user2", "user3", "user4", "user5"],
        balance: 15000.00,
        loanEligible: 45000.00,
        monthlyContribution: 3000.00,
        nextPayoutPosition: 3,
      },
    })
  } catch (error) {
    console.error("[v0] SACCO fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
