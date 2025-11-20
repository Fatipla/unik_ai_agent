import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { paddle } from "@/lib/paddle"
import { env } from "@/lib/env"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!env.PADDLE_ENABLED || !paddle) {
    return NextResponse.json({
      portalUrl: "https://billing.paddle.com/demo",
      stubbed: true,
      message: "Paddle not enabled.",
    })
  }

  try {
    const { data: customer } = await supabase
      .from("customers")
      .select("paddle_customer_id")
      .eq("user_id", user.id)
      .single()

    if (!customer || !customer.paddle_customer_id) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 })
    }

    // Generate customer portal session
    const portalSession = await paddle.customers.getPortalSession(customer.paddle_customer_id, {
      returnUrl: `${env.SITE_URL}/dashboard/billing`,
    })

    return NextResponse.json({
      portalUrl: portalSession.urls.overview,
    })
  } catch (error: any) {
    console.error("[v0] Paddle Portal Error:", error)
    return NextResponse.json({ error: "Failed to create portal session", details: error.message }, { status: 500 })
  }
}
