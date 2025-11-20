import { type NextRequest, NextResponse } from "next/server"
import { verifyPassword, generateToken } from "@/lib/auth"
import { db, usersProfile } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("[v0] Signin attempt for:", email)

    // Find user by email
    const users = await db.select().from(usersProfile).where(eq(usersProfile.email, email.toLowerCase())).limit(1)

    const user = users[0]

    if (!user) {
      console.log("[v0] User not found for email:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      console.log("[v0] Invalid password for user:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = generateToken({
      userId: user.userId,
      email: user.email,
      plan: user.plan,
    })

    console.log("[v0] Signin successful for:", email)

    return NextResponse.json({
      token,
      user: {
        userId: user.userId,
        email: user.email,
        plan: user.plan,
        displayName: user.displayName,
      },
    })
  } catch (error) {
    console.error("[v0] Signin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
