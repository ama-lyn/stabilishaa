import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (auth.userType !== "worker") {
      return NextResponse.json({ error: "Only workers have credit scores" }, { status: 403 })
    }

    const score = 725
    const rating = "Very Good"
    
    const loanEligibility = [
      {
        lender: "M-Shwari",
        maxAmount: 72500,
        interestRate: 9,
        approved: true,
      },
      {
        lender: "Tala",
        maxAmount: 58000,
        interestRate: 12,
        approved: true,
      },
      {
        lender: "Branch",
        maxAmount: 87000,
        interestRate: 8,
        approved: true,
      },
    ]

    return NextResponse.json({
      creditScore: {
        score,
        rating,
        factors: {
          gigConsistency: 85,
          paymentHistory: 92,
          financialHealth: 78,
        },
        loanEligibility,
        lastCalculated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Credit score fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
