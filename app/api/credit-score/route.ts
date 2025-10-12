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

    // Mock user data - in production, fetch from database
    const userData = {
      totalEarnings: 75000,
      walletBalance: 15000,
      completedGigs: 20,
      avgRating: 4.5,
      daysActive: 180,
      paymentDelays: 1,
      saccoContributions: 8000,
      loanRepayments: 3
    }

    try {
      // Call AI model API
      const aiResponse = await fetch('http://localhost:5001/api/calculate-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (aiResponse.ok) {
        const aiResult = await aiResponse.json()
        const score = aiResult.creditScore
        
        let rating = "Poor"
        if (score >= 750) rating = "Excellent"
        else if (score >= 700) rating = "Very Good"
        else if (score >= 650) rating = "Good"
        else if (score >= 600) rating = "Fair"
        
        const loanEligibility = []
        if (score >= 600) {
          loanEligibility.push({
            lender: "Elimisha Loan",
            maxAmount: Math.round(score * 100),
            interestRate: 9,
          })
        }
        if (score >= 600) {
          loanEligibility.push({
            lender: "Shamba loan",
            maxAmount: Math.round(score * 80),
            interestRate: 12,
          })
        }
        if (score >= 700) {
          loanEligibility.push({
            lender: "Branch",
            maxAmount: Math.round(score * 120),
            interestRate: 8,
          })
        }

        return NextResponse.json({
          creditScore: {
            score,
            rating,
            factors: aiResult.factors,
            loanEligibility,
            lastCalculated: new Date().toISOString(),
            aiPowered: true
          },
        })
      }
    } catch (aiError) {
      console.log("AI model unavailable, using fallback")
    }

    // Fallback to mock data if AI model is unavailable
    const score = 725
    const rating = "Very Good"
    
    const loanEligibility = [
      {
        lender: "Elimisha Loan",
        maxAmount: 72500,
        interestRate: 9,
      },
      {
        lender: "Shamba loan",
        maxAmount: 58000,
        interestRate: 12,
      },
      {
        lender: "Branch",
        maxAmount: 87000,
        interestRate: 8,
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
        aiPowered: false
      },
    })
  } catch (error) {
    console.error("[v0] Credit score fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
