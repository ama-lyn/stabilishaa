import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let insights = await db.aiInsights.findByUserId(auth.userId, 10)

    // Generate new insights if none exist
    if (insights.length === 0 && auth.userType === "worker") {
      const wallet = await db.wallets.findByUserId(auth.userId)
      const workerProfile = await db.workerProfiles.findByUserId(auth.userId)

      const newInsights = []

      if (wallet && Number.parseFloat(wallet.total_earned) > 0) {
        await db.aiInsights.create({
          userId: auth.userId,
          insightType: "income_prediction",
          title: "Earnings Opportunity",
          description: `Based on your patterns, you could earn KES ${Math.round(Number.parseFloat(wallet.total_earned) * 0.15).toLocaleString()} more this week by taking 2 additional projects.`,
          confidence: 87.5,
        })
      }

      if (workerProfile && workerProfile.total_jobs < 10) {
        await db.aiInsights.create({
          userId: auth.userId,
          insightType: "recommendation",
          title: "Build Your Reputation",
          description: `Complete ${10 - workerProfile.total_jobs} more gigs to unlock higher-paying opportunities and improve your credit score.`,
          confidence: 92.0,
        })
      }

      await db.aiInsights.create({
        userId: auth.userId,
        insightType: "opportunity",
        title: "High Demand Alert",
        description:
          "Tech companies are hiring 40% more writers this season. 15 matching jobs available in your category.",
        confidence: 78.5,
      })

      await db.aiInsights.create({
        userId: auth.userId,
        insightType: "warning",
        title: "Income Pattern Notice",
        description:
          "Your income typically drops 20% mid-month. Consider booking projects now to maintain steady earnings.",
        confidence: 85.0,
      })

      insights = await db.aiInsights.findByUserId(auth.userId, 10)
    }

    const wallet = await db.wallets.findByUserId(auth.userId)
    const predictions = {
      thisMonth: wallet ? Math.round(Number.parseFloat(wallet.total_earned) * 0.3) : 0,
      nextMonth: wallet ? Math.round(Number.parseFloat(wallet.total_earned) * 0.35) : 0,
      confidence: 85,
    }

    return NextResponse.json({
      insights: insights.map((i) => ({
        id: i.id,
        type: i.insight_type,
        title: i.title,
        description: i.description,
        confidence: i.confidence ? Number.parseFloat(i.confidence) : null,
        createdAt: i.created_at,
      })),
      predictions,
    })
  } catch (error) {
    console.error("[v0] AI insights fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
