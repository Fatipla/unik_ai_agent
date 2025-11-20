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
      checkoutUrl: "https://paddle.com/checkout/demo",
      stubbed: true,
      message: "Paddle not enabled. Set PADDLE_ENABLED=true and add API keys.",
    })
  }

  try {
    const { planKey, period, couponCode } = await request.json()

    if (!planKey || !period) {
      return NextResponse.json({ error: "planKey and period required" }, { status: 400 })
    }

    const priceIdMap: Record<string, string> = {
      CHATBOT_STANDARD_M: env.PRICE_CHATBOT_STANDARD_M,
      CHATBOT_STANDARD_Y: env.PRICE_CHATBOT_STANDARD_Y,
      CHATBOT_PRO_M: env.PRICE_CHATBOT_PRO_M,
      CHATBOT_PRO_Y: env.PRICE_CHATBOT_PRO_Y,
      CHATBOT_ENTERPRISE_M: env.PRICE_CHATBOT_ENTERPRISE_M,
      CHATBOT_ENTERPRISE_Y: env.PRICE_CHATBOT_ENTERPRISE_Y,
      VOICE_STANDARD_M: env.PRICE_VOICE_STANDARD_M,
      VOICE_STANDARD_Y: env.PRICE_VOICE_STANDARD_Y,
      VOICE_PRO_M: env.PRICE_VOICE_PRO_M,
      VOICE_PRO_Y: env.PRICE_VOICE_PRO_Y,
      VOICE_ENTERPRISE_M: env.PRICE_VOICE_ENTERPRISE_M,
      VOICE_ENTERPRISE_Y: env.PRICE_VOICE_ENTERPRISE_Y,
      BUNDLE_STANDARD_M: env.PRICE_BUNDLE_STANDARD_M,
      BUNDLE_STANDARD_Y: env.PRICE_BUNDLE_STANDARD_Y,
      BUNDLE_PRO_M: env.PRICE_BUNDLE_PRO_M,
      BUNDLE_PRO_Y: env.PRICE_BUNDLE_PRO_Y,
      BUNDLE_ENTERPRISE_M: env.PRICE_BUNDLE_ENTERPRISE_M,
      BUNDLE_ENTERPRISE_Y: env.PRICE_BUNDLE_ENTERPRISE_Y,
    }

    const priceKey = `${planKey}_${period}`
    const priceId = priceIdMap[priceKey]

    if (!priceId) {
      return NextResponse.json({ error: `Invalid plan: ${priceKey}` }, { status: 400 })
    }

    let { data: customer } = await supabase.from("customers").select("*").eq("user_id", user.id).single()

    let paddleCustomerId = customer?.paddle_customer_id

    if (!paddleCustomerId) {
      // Create new Paddle customer
      const paddleCustomer = await paddle.customers.create({
        email: user.email!,
        name: user.user_metadata?.full_name || undefined,
      })

      paddleCustomerId = paddleCustomer.id

      // Store in Supabase
      const { data: newCustomer } = await supabase
        .from("customers")
        .insert({
          user_id: user.id,
          paddle_customer_id: paddleCustomerId,
          email: user.email!,
        })
        .select()
        .single()

      customer = newCustomer
    }

    // Create checkout transaction
    const transaction = await paddle.transactions.create({
      items: [
        {
          priceId: priceId,
          quantity: 1,
        },
      ],
      customerId: paddleCustomerId,
      customData: {
        userId: user.id,
      },
      ...(couponCode && { discountCode: couponCode }),
    })

    return NextResponse.json({
      checkoutUrl: transaction.checkoutUrl,
      transactionId: transaction.id,
    })
  } catch (error: any) {
    console.error("[v0] Paddle Checkout Error:", error)
    return NextResponse.json({ error: "Failed to create checkout session", details: error.message }, { status: 500 })
  }
}
