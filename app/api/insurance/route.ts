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
      covers: [
        {
          id: "basic",
          name: "Basic Protection",
          description: "Essential coverage for new gig workers",
          coverage: 100000,
          premium: 500,
          features: ["Income protection up to KES 100,000", "Equipment coverage KES 50,000", "Basic health coverage", "24/7 support"]
        },
        {
          id: "premium",
          name: "Premium Shield",
          description: "Comprehensive coverage for established workers",
          coverage: 300000,
          premium: 1200,
          features: ["Income protection up to KES 300,000", "Equipment coverage KES 150,000", "Full health & accident coverage", "Priority claim processing", "Legal assistance"]
        },
        {
          id: "elite",
          name: "Elite Guardian",
          description: "Maximum protection for high-earning professionals",
          coverage: 500000,
          premium: 2000,
          features: ["Income protection up to KES 500,000", "Equipment coverage KES 250,000", "Comprehensive health coverage", "Instant claim processing", "Personal insurance advisor", "Global coverage"]
        }
      ]
    })
  } catch (error) {
    console.error("[v0] Insurance fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
