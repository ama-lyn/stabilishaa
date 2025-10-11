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
    const { policyId, claimType, amount, description, geotaggedImages } = body

    if (!policyId || !claimType || !amount || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newClaim = await db.insuranceClaims.create({
      policyId,
      userId: auth.userId,
      claimType,
      claimAmount: amount,
      description,
      geotaggedImages,
    })

    return NextResponse.json(
      {
        message: "Claim submitted successfully",
        claimId: newClaim.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Insurance claim error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
