import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const mockGigs = [
      {
        id: "1",
        client_id: "client1",
        client_name: "Tech Solutions Ltd",
        client_location: "Nairobi, Kenya",
        title: "Website Development for E-commerce",
        description: "Need a modern e-commerce website with payment integration",
        category: "web_development",
        budget_min: "50000",
        budget_max: "100000",
        currency: "KES",
        duration: "2-3 weeks",
        location: "Remote",
        location_type: "remote",
        required_skills: ["React", "Node.js", "MongoDB"],
        experience_level: "intermediate",
        status: "open",
        applicants_count: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        client_id: "client2",
        client_name: "Creative Agency",
        client_location: "Mombasa, Kenya",
        title: "Logo Design for Startup",
        description: "Looking for a creative logo design for our new startup",
        category: "graphic_design",
        budget_min: "15000",
        budget_max: "30000",
        currency: "KES",
        duration: "1 week",
        location: "Remote",
        location_type: "remote",
        required_skills: ["Adobe Illustrator", "Photoshop"],
        experience_level: "beginner",
        status: "open",
        applicants_count: 12,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    let gigs = mockGigs

    return NextResponse.json({
      gigs: gigs?.map((g) => ({
        id: g.id,
        clientId: g.client_id,
        clientName: g.client_name,
        clientLocation: g.client_location,
        title: g.title,
        description: g.description,
        category: g.category,
        budgetMin: g.budget_min ? Number.parseFloat(g.budget_min) : null,
        budgetMax: g.budget_max ? Number.parseFloat(g.budget_max) : null,
        currency: g.currency,
        duration: g.duration,
        location: g.location,
        locationType: g.location_type,
        requiredSkills: g.required_skills,
        experienceLevel: g.experience_level,
        status: g.status,
        applicantsCount: g.applicants_count,
        createdAt: g.created_at,
      })),
    })
  } catch (error) {
    console.error("[v0] Gigs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (auth.userType !== "client") {
      return NextResponse.json({ error: "Only clients can post gigs" }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      budgetMin,
      budgetMax,
      currency,
      duration,
      location,
      locationType,
      requiredSkills,
      experienceLevel,
    } = body

    if (!title || !description || !category || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newGig = { id: "new-gig-" + Date.now() }

    return NextResponse.json(
      {
        message: "Gig created successfully",
        gigId: newGig.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Gig creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
