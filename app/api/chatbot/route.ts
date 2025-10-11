import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Mock user data for context
    const wallet = { total_earned: "125000" }
    const creditScore = { score: 725, gig_consistency: "85" }
    const workerProfile = { title: "Web Developer" }

    // Generate contextual response based on message
    let response = ""
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("credit score") || lowerMessage.includes("improve")) {
      const score = creditScore?.score || 650
      response = `Your current credit score is ${score}. To improve it:

1. Complete more gigs consistently - This improves your gig consistency score (currently ${creditScore?.gig_consistency || 50}%)
2. Maintain a healthy wallet balance - Keep at least KES 5,000 in your account
3. Get paid on time - Timely payments boost your payment history score

Based on your current progress, you could reach ${score + 50} points in 2-3 months by completing 5 more gigs and maintaining a balance of KES 10,000.`
    } else if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
      const income = wallet ? Number.parseFloat(wallet.total_earned) : 0
      const recommendedSavings = Math.round(income * 0.2)
      response = `Based on your income pattern (KES ${income.toLocaleString()} total earnings), I recommend saving KES ${recommendedSavings.toLocaleString()} (20% of your income).

Here's a breakdown:
- Emergency fund: KES ${Math.round(recommendedSavings * 0.5).toLocaleString()}
- SACCO contributions: KES ${Math.round(recommendedSavings * 0.3).toLocaleString()}
- Investment/growth: KES ${Math.round(recommendedSavings * 0.2).toLocaleString()}

This will help you reach your financial goals in 3-4 months!`
    } else if (lowerMessage.includes("gig") || lowerMessage.includes("job") || lowerMessage.includes("work")) {
      const title = workerProfile?.title || "your field"
      response = `Based on your profile in ${title}, here are some tips:

1. High-demand gigs: Tech companies are hiring 40% more this season
2. Optimize your rates: Workers in your category earn KES 15,000-25,000 per project on average
3. Build your portfolio: Complete 3 more gigs to unlock premium opportunities
4. Best time to apply: Mornings (8-10 AM) have 60% higher response rates

I found 8 matching gigs for you. Check the Gigs page to apply!`
    } else if (lowerMessage.includes("earn") || lowerMessage.includes("income") || lowerMessage.includes("money")) {
      const avgEarnings = wallet ? Math.round(Number.parseFloat(wallet.total_earned) * 0.15) : 5000
      response = `To increase your earnings:

1. Take on 2 more projects this week - Potential: +KES ${avgEarnings.toLocaleString()}
2. Increase your rates by 15% - You're currently underpriced compared to market rates
3. Upsell existing clients - Offer package deals for 20% more value
4. Work during peak hours - Weekdays 9 AM - 5 PM have highest demand

Prediction: Following these steps could increase your monthly income by 30-40%!`
    } else if (lowerMessage.includes("budget") || lowerMessage.includes("expense")) {
      response = `Let me help you with budgeting:

Recommended monthly budget breakdown:
- Essentials (50%): Rent, food, utilities
- Savings (20%): Emergency fund, SACCO
- Investments (15%): Skills, equipment, insurance
- Flexible (15%): Entertainment, personal

Track your expenses in the Wallet section to see where you can optimize. Most gig workers save 10-15% by cutting unnecessary subscriptions.`
    } else if (lowerMessage.includes("loan") || lowerMessage.includes("borrow")) {
      const score = creditScore?.score || 0
      const loanEligible = score >= 600 ? score * 100 : 0
      response = `Based on your credit score, you're eligible for:

${
  loanEligible > 0
    ? `- M-Shwari: Up to KES ${loanEligible.toLocaleString()} at 9% interest
- SACCO loan: Up to 2-3x your savings
- Tala: Up to KES ${Math.round(loanEligible * 0.8).toLocaleString()} at 12% interest`
    : "Complete more gigs to unlock loan eligibility. You need a credit score of at least 600."
}

Tip: SACCO loans have the lowest interest rates. Consider contributing more to your SACCO account!`
    } else if (lowerMessage.includes("insurance") || lowerMessage.includes("protect")) {
      response = `Your insurance coverage protects you from:

1. Income loss during dry months (60% coverage)
2. Equipment damage up to KES 300,000
3. Health emergencies
4. Accidents

To file a claim, go to the Insurance page and upload geotagged images for verification. This prevents fraud and ensures quick processing.

Premium: KES 800/month for full coverage`
    } else {
      response = `I can help you with:

- Budget recommendations and expense tracking
- Income predictions and earning strategies
- Job matching based on your skills
- Credit score improvement tips
- Financial planning and savings goals
- SACCO and insurance guidance

What would you like to know more about?`
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("[v0] Chatbot error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
