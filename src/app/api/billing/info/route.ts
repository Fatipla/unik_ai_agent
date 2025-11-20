import { type NextRequest, NextResponse } from "next/server"
import { db, usersProfile, paddleSubscriptions } from "@/lib/db"
import { getUserFromHeaders } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  const user = getUserFromHeaders(request.headers)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get user profile
    const [profile] = await db.select().from(usersProfile).where(eq(usersProfile.userId, user.userId)).limit(1)

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Get active subscription
    const [subscription] = await db
      .select()
      .from(paddleSubscriptions)
      .where(eq(paddleSubscriptions.userId, user.userId))
      .limit(1)

    return NextResponse.json({
      plan: profile.plan,
      interval: subscription?.billingCycle || "month",
      status: subscription?.status || "active",
      nextBillingDate: subscription?.nextBilledAt,
      subscriptionId: subscription?.paddleSubscriptionId,
    })
  } catch (error: any) {
    console.error("Billing info error:", error)
    return NextResponse.json({ error: "Failed to fetch billing info" }, { status: 500 })
  }
}
