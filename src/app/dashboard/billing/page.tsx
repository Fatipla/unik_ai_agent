"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircleCheckBig } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export const dynamic = "force-dynamic"
export const revalidate = 0

const plans = [
  {
    name: "Standard",
    price: { monthly: "19.99", yearly: "13.99" },
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_IDS?.split(",")[0] || "",
    features: [
      "500 conversations/mo",
      "Chatbot Widget & API",
      "Knowledge Base Training",
      "Basic Analytics",
      "7-Day Free Trial",
    ],
    current: false,
  },
  {
    name: "Pro",
    price: { monthly: "29.99", yearly: "20.99" },
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_IDS?.split(",")[1] || "",
    features: [
      "1500 conversations/mo",
      "Everything in Standard",
      "Voice Agent (TTS/Whisper)",
      "n8n Integration",
      "Advanced Analytics",
    ],
    current: false,
  },
  {
    name: "Enterprise",
    price: { monthly: "39.99", yearly: "27.99" },
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_IDS?.split(",")[2] || "",
    features: [
      "Unlimited conversations",
      "Everything in Pro",
      "Dedicated Support",
      "Custom Integrations",
      "Full Audit Logs",
    ],
    current: false,
  },
]

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBillingInfo = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch("/api/billing/info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setCurrentPlan(data)
        }
      } catch (error) {
        console.error("[v0] Error fetching billing info:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBillingInfo()
  }, [])

  const handleCheckout = async (priceId: string) => {
    const token = localStorage.getItem("token")
    setLoading(true)

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId }),
      })

      if (response.ok) {
        const data = await response.json()
        window.location.href = data.checkoutUrl
      } else {
        alert("Failed to create checkout session")
      }
    } catch (error) {
      alert("Error creating checkout")
    } finally {
      setLoading(false)
    }
  }

  const handlePortal = async () => {
    const token = localStorage.getItem("token")
    setLoading(true)

    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        window.location.href = data.portalUrl
      } else {
        alert("Failed to open customer portal")
      }
    } catch (error) {
      alert("Error opening portal")
    } finally {
      setLoading(false)
    }
  }

  const updatedPlans = plans.map((plan) => ({
    ...plan,
    current: currentPlan?.plan === plan.name.toLowerCase(),
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing details.</p>
      </div>

      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              You are currently on the {currentPlan.plan} plan ({currentPlan.interval}).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {currentPlan.nextBillingDate &&
                `Your subscription will renew on ${new Date(currentPlan.nextBillingDate).toLocaleDateString()}.`}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handlePortal} disabled={loading}>
              Manage in Paddle Portal
            </Button>
          </CardFooter>
        </Card>
      )}

      <Separator />

      <div>
        <h2 className="text-2xl font-headline font-bold">Manage Plan</h2>
        <p className="text-muted-foreground">Need more features? Upgrade your plan below.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {updatedPlans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.current ? "border-primary ring-2 ring-primary" : ""}`}>
            {plan.current && <Badge className="absolute -top-3 self-center">Current Plan</Badge>}
            <CardHeader>
              <CardTitle className="font-headline tracking-normal">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold text-foreground">€{plan.price.monthly}</span>
                /month
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CircleCheckBig className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={plan.current || loading}
                onClick={() => handleCheckout(plan.priceId)}
              >
                {plan.current ? "Your Current Plan" : "Upgrade to " + plan.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
