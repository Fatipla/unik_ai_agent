'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleCheckBig } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const plans = [
    {
      name: "Standard",
      price: { monthly: "19.99", yearly: "13.99" },
      features: [
        "Chatbot Widget & API",
        "Knowledge Base Training",
        "OpenAI Cost Cap: €9.99",
      ],
      current: false,
    },
    {
      name: "Pro",
      price: { monthly: "29.99", yearly: "20.99" },
      features: [
        "Everything in Standard",
        "Voice Agent (TTS/Whisper)",
        "n8n Integration",
        "OpenAI Cost Cap: €14.99",
      ],
      current: true,
    },
    {
      name: "Enterprise",
      price: { monthly: "39.99", yearly: "27.99" },
      features: [
        "Everything in Pro",
        "Dedicated Support",
        "Custom Integrations",
        "OpenAI Cost Cap: €19.99",
      ],
      current: false,
    },
  ];

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const handleManageBilling = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.portalUrl) {
        window.location.href = data.portalUrl;
      } else if (data.stubbed) {
        alert('Paddle is not configured. Please add your Paddle credentials to enable billing.');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Failed to open billing portal');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planName: string, priceId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await response.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.stubbed) {
        alert('Paddle is not configured. Please add your Paddle credentials to enable billing.');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to create checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing details with Paddle.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the Pro plan (Monthly).</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Your subscription will renew on July 30, 2024.</p>
        </CardContent>
        <CardFooter>
            <Button onClick={handleManageBilling} disabled={loading}>
              {loading ? 'Loading...' : 'Manage in Paddle Portal'}
            </Button>
        </CardFooter>
      </Card>
      
      <Separator />

      <div>
        <h2 className="text-2xl font-headline font-bold">Manage Plan</h2>
        <p className="text-muted-foreground">Need more features? Upgrade your plan below.</p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map(plan => (
             <Card key={plan.name} className={`flex flex-col ${plan.current ? 'border-primary ring-2 ring-primary' : ''}`}>
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
               <Button className="w-full" disabled={plan.current}>
                {plan.current ? 'Your Current Plan' : 'Upgrade to ' + plan.name}
               </Button>
             </CardFooter>
           </Card>
        ))}
      </div>
    </div>
  );
}
