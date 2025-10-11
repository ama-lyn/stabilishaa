import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workers = await db.workerProfiles.findAll(50)

    return NextResponse.json({
      workers: workers.map((w) => ({
        id: w.id,
        userId: w.user_id,
        name: w.full_name,
        title: w.title,
        bio: w.bio,
        skills: w.skills,
        hourlyRate: w.hourly_rate ? Number.parseFloat(w.hourly_rate) : null,
        location: w.location,
        rating: w.rating ? Number.parseFloat(w.rating) : 0,
        totalJobs: w.total_jobs,
        successRate: w.success_rate ? Number.parseFloat(w.success_rate) : 0,
        profileImage: w.profile_image,
      })),
    })
  } catch (error) {
    console.error("[v0] Workers fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
