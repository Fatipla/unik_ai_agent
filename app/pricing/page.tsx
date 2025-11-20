"use client"

// Last updated: 2025-01-20

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type ProductType = "chatbot" | "voice" | "both"
type BillingPeriod = "M" | "Y"

const pricingData = {
  chatbot: {
    standard: { monthly: 19.99, yearly: 15.99 },
    pro: { monthly: 29.99, yearly: 23.99 },
    enterprise: { monthly: 39.99, yearly: 31.99 },
  },
  voice: {
    standard: { monthly: 24.99, yearly: 19.99 },
    pro: { monthly: 34.99, yearly: 27.99 },
    enterprise: { monthly: 49.99, yearly: 39.99 },
  },
  both: {
    standard: { monthly: 39.99, yearly: 31.99 },
    pro: { monthly: 59.99, yearly: 47.99 },
    enterprise: { monthly: 79.99, yearly: 63.99 },
  },
}

const features = {
  chatbot: {
    standard: [
      "500 conversations/month",
      "Chatbot Widget & API",
      "Knowledge Base Training",
      "Basic Analytics",
      "Email Support",
      "7-Day Free Trial",
    ],
    pro: [
      "2,000 conversations/month",
      "Everything in Standard",
      "Advanced Analytics",
      "Priority Support",
      "Custom Branding",
      "API Access",
    ],
    enterprise: [
      "Unlimited conversations",
      "Everything in Pro",
      "Dedicated Support",
      "Custom Integrations",
      "SLA Guarantee",
      "Full Audit Logs",
    ],
  },
  voice: {
    standard: [
      "300 voice calls/month",
      "Voice Agent (TTS/Whisper)",
      "n8n Integration",
      "Call Analytics",
      "Email Support",
      "7-Day Free Trial",
    ],
    pro: [
      "1,000 voice calls/month",
      "Everything in Standard",
      "Advanced Voice Workflows",
      "Priority Support",
      "Custom Voice Models",
      "Real-time Transcription",
    ],
    enterprise: [
      "Unlimited voice calls",
      "Everything in Pro",
      "Dedicated Support",
      "Custom Integrations",
      "SLA Guarantee",
      "Multi-language Support",
    ],
  },
  both: {
    standard: [
      "500 conversations/month",
      "Chatbot Widget & API",
      "Voice Agent (TTS/Whisper)",
      "Knowledge Base Training",
      "Basic Analytics",
      "7-Day Free Trial",
    ],
    pro: [
      "2,000 conversations/month",
      "Everything in Standard",
      "n8n Integration",
      "Advanced Analytics",
      "Priority Support",
      "Custom Branding",
    ],
    enterprise: [
      "Unlimited conversations",
      "Everything in Pro",
      "Dedicated Support",
      "Custom Integrations",
      "SLA Guarantee",
      "Full Audit Logs",
    ],
  },
}

export default function PricingPage() {
  const [productType, setProductType] = useState<ProductType>("both")
  const [period, setPeriod] = useState<BillingPeriod>("M")

  console.log("[v0] Pricing page rendered:", { productType, period })

  const getPrice = (tier: "standard" | "pro" | "enterprise") => {
    return period === "Y" ? pricingData[productType][tier].yearly : pricingData[productType][tier].monthly
  }

  const getMonthlyEquivalent = (tier: "standard" | "pro" | "enterprise") => {
    return pricingData[productType][tier].monthly
  }

  const plans = [
    {
      tier: "standard" as const,
      name: "Standard",
      description: "Perfect for small businesses",
      cta: "Start 7-Day Trial",
      popular: false,
    },
    {
      tier: "pro" as const,
      name: "Pro",
      description: "For growing companies",
      cta: "Get Started",
      popular: true,
    },
    {
      tier: "enterprise" as const,
      name: "Enterprise",
      description: "For large organizations",
      cta: "Contact Sales",
      popular: false,
    },
  ]

  const handleCheckout = async (tier: "standard" | "pro" | "enterprise") => {
    console.log("[v0] Checkout:", { productType, tier, period })
    // TODO: Implement Paddle checkout
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, predictable pricing</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the perfect plan for your business. Save 20% with yearly billing.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <div className="inline-flex rounded-lg border p-1 bg-muted/50">
              <button
                onClick={() => setProductType("chatbot")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  productType === "chatbot"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Chatbot
              </button>
              <button
                onClick={() => setProductType("voice")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  productType === "voice"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Voice Agent
              </button>
              <button
                onClick={() => setProductType("both")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  productType === "both"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Both
              </button>
            </div>

            <div className="inline-flex rounded-lg border p-1 bg-muted/50">
              <button
                onClick={() => setPeriod("M")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  period === "M"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPeriod("Y")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  period === "Y"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                {period === "Y" && <span className="ml-1 text-xs font-semibold text-green-600">-20%</span>}
              </button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{period === "M" ? "Billed monthly" : "Save 20% on yearly"}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.tier}
              className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€{getPrice(plan.tier)}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                {period === "Y" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    €{getMonthlyEquivalent(plan.tier)}/month billed yearly
                  </p>
                )}
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {features[productType][plan.tier].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleCheckout(plan.tier)}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your customer experience?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your 7-day free trial today. No credit card required.
          </p>
          <Button size="lg" asChild>
            <a href="/signup">Start Free Trial</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
