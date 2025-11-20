import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get customer with subscriptions
    const { data: customer } = await supabase
      .from("customers")
      .select("*, subscriptions(*), invoices(*)")
      .eq("user_id", user.id)
      .single()

    // Mock data for now until database is populated
    return NextResponse.json({
      costEur: 0,
      cap: 19.99,
      conversations: 0,
      conversationsGrowth: 0,
      leads: 0,
      leadsGrowth: 0,
      conversionRate: 0,
      conversionGrowth: 0,
      dailyChart: [],
      recentConversations: [],
      user: {
        email: user.email,
        id: user.id,
      },
      subscription: customer?.subscriptions?.[0] || null,
    })

    // Get user profile
    // const [profile] = await db.select().from(usersProfile).where(eq(usersProfile.userId, user.userId)).limit(1)

    // if (!profile) {
    //   return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    // }

    // // Get current month's conversations
    // const currentMonth = new Date()
    // currentMonth.setDate(1)
    // currentMonth.setHours(0, 0, 0, 0)

    // const [convStats] = await db
    //   .select({
    //     count: sql<number>`count(*)`,
    //   })
    //   .from(conversations)
    //   .where(and(eq(conversations.userId, user.userId), gte(conversations.createdAt, currentMonth)))

    // // Get last 7 days for chart
    // const sevenDaysAgo = new Date()
    // sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // const dailyData = await db
    //   .select({
    //     date: sql<string>`DATE(${conversations.createdAt})`,
    //     count: sql<number>`count(*)`,
    //   })
    //   .from(conversations)
    //   .where(and(eq(conversations.userId, user.userId), gte(conversations.createdAt, sevenDaysAgo)))
    //   .groupBy(sql`DATE(${conversations.createdAt})`)
    //   .orderBy(sql`DATE(${conversations.createdAt})`)

    // // Get recent conversations
    // const recentConvs = await db
    //   .select()
    //   .from(conversations)
    //   .where(eq(conversations.userId, user.userId))
    //   .orderBy(desc(conversations.createdAt))
    //   .limit(5)

    // // Calculate cap based on plan
    // const planLimits = PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS]
    // const cap = planLimits?.costCapEur || 19.99

    // return NextResponse.json({
    //   costEur: Number.parseFloat(profile.usageCostEur || "0"),
    //   cap,
    //   conversations: Number(convStats.count || 0),
    //   conversationsGrowth: 0, // TODO: Calculate from previous month
    //   leads: 0, // TODO: Calculate from emails table
    //   leadsGrowth: 0,
    //   conversionRate: 0, // TODO: Calculate conversion rate
    //   conversionGrowth: 0,
    //   dailyChart: dailyData.map((d) => ({
    //     date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    //     count: Number(d.count),
    //   })),
    //   recentConversations: recentConvs.map((c) => ({
    //     id: c.id,
    //     source: c.source,
    //     createdAt: c.createdAt,
    //     costEur: Number.parseFloat(c.costEur || "0"),
    //     tokensIn: c.tokensIn,
    //     tokensOut: c.tokensOut,
    //   })),
    // })
  } catch (error: any) {
    console.error("[v0] Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
