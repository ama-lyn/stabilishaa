import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "stabilisha-prototype-secret-2024-do-not-use-in-production"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, userType, phone } = body

    // Validation
    if (!email || !password || !name || !userType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["worker", "client"].includes(userType)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 })
    }

    const existingUser = await db.users.findByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await db.users.create({
      email,
      passwordHash: hashedPassword,
      fullName: name,
      userType: userType as "worker" | "client",
      phone,
    })

    await db.wallets.create(newUser.id)

    if (userType === "worker") {
      await db.workerProfiles.create(newUser.id)
      await db.creditScores.create(newUser.id)
      await db.saccoAccounts.create(newUser.id)
    }

    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        userType: newUser.user_type,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    const response = NextResponse.json(
      {
        message: "User created successfully",
        userId: newUser.id,
        userType,
      },
      { status: 201 },
    )

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
