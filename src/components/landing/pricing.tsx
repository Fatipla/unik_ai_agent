import Link from "next/link";
import { CircleCheckBig } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Standard",
    price: "19.99",
    features: [
      "500 conversations/mo",
      "Chatbot Widget & API",
      "Knowledge Base Training",
      "Basic Analytics",
      "7-Day Free Trial",
    ],
    cta: "Start 7-Day Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "29.99",
    features: [
      "1500 conversations/mo",
      "Everything in Standard",
      "Voice Agent (TTS/Whisper)",
      "n8n Integration",
      "Advanced Analytics",
    ],
    cta: "Choose Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "39.99",
    features: [
      "Unlimited conversations",
      "Everything in Pro",
      "Dedicated Support",
      "Custom Integrations",
      "Full Audit Logs",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-32 bg-background">
      <div className="mx-auto max-w-6xl w-full px-4">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, predictable pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the perfect plan for your business. Save 30% with yearly billing.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary ring-2 ring-primary' : ''}`}>
              {plan.popular && <Badge className="absolute -top-3 self-center">Most Popular</Badge>}
              <CardHeader>
                <CardTitle className="font-headline tracking-normal">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold text-foreground">€{plan.price}</span>
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
                <Button asChild className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  <Link href="/dashboard">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
