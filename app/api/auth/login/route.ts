import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "stabilisha-prototype-secret-2024-do-not-use-in-production"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    // Accept any email/password combination
    const mockUser = {
      id: "demo-user-123",
      email: email,
      full_name: "Salome",
      user_type: "worker"
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: mockUser.id,
        email: mockUser.email,
        userType: mockUser.user_type,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.full_name,
          userType: mockUser.user_type,
        },
      },
      { status: 200 },
    )

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
