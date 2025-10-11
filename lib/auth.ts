import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "stabilisha-prototype-secret-2024-do-not-use-in-production"

export interface AuthPayload {
  userId: string
  email: string
  userType: "worker" | "client"
}

export async function verifyAuth(request: NextRequest): Promise<AuthPayload | null> {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload
    return decoded
  } catch (error) {
    console.error("[v0] Auth verification error:", error)
    return null
  }
}
