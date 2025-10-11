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
      insurance: {
        totalCoverage: 450000,
        policies: [
          {
            type: "income_protection",
            coverage: "KES 300,000",
            premium: 800,
            status: "active",
          },
          {
            type: "equipment_coverage",
            coverage: "KES 150,000",
            premium: 500,
            status: "active",
          },
        ],
        claims: [
          {
            _id: "1",
            type: "equipment_damage",
            amount: 25000,
            status: "approved",
            submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
    })
  } catch (error) {
    console.error("[v0] Insurance fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
