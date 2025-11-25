'use client';

import { useState } from 'react';
import Link from "next/link";
import { Check, MessageSquare, Mic, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProductType = 'chatbot' | 'voice' | 'bundle';

const productConfig = {
  chatbot: {
    name: 'Chatbot',
    icon: MessageSquare,
    plans: [
      {
        title: 'Standard',
        price: 19.99,
        features: [
          '500 conversations/month',
          'Widget & API access',
          'Knowledge Base training',
          'Basic Analytics',
          '7-Day Free Trial',
        ],
        popular: false,
      },
      {
        title: 'Pro',
        price: 29.99,
        features: [
          '1,500 conversations/month',
          'Everything in Standard',
          'n8n Integration',
          'Advanced Analytics',
          'Priority Support',
        ],
        popular: true,
      },
      {
        title: 'Enterprise',
        price: 39.99,
        features: [
          'Unlimited conversations',
          'Everything in Pro',
          'Dedicated Support',
          'Custom Integrations',
          'Full Audit Logs',
        ],
        popular: false,
      },
    ],
  },
  voice: {
    name: 'Voice Agent',
    icon: Mic,
    plans: [
      {
        title: 'Standard',
        price: 19.99,
        features: [
          '500 voice calls/month',
          'Text-to-Speech (TTS)',
          'Speech-to-Text (Whisper)',
          'Call Recording',
          '7-Day Free Trial',
        ],
        popular: false,
      },
      {
        title: 'Pro',
        price: 29.99,
        features: [
          '1,500 voice calls/month',
          'Everything in Standard',
          'Custom Voice Training',
          'Call Analytics',
          'Priority Support',
        ],
        popular: true,
      },
      {
        title: 'Enterprise',
        price: 39.99,
        features: [
          'Unlimited voice calls',
          'Everything in Pro',
          'Dedicated Support',
          'Custom Integrations',
          'Full Call Audit Logs',
        ],
        popular: false,
      },
    ],
  },
  bundle: {
    name: 'Bundle',
    icon: Package,
    plans: [
      {
        title: 'Standard',
        price: 34.99,
        features: [
          '500 conversations + 500 calls/month',
          'Chatbot Widget & API',
          'Voice Agent (TTS/Whisper)',
          'Knowledge Base Training',
          'Basic Analytics',
          '7-Day Free Trial',
          '💰 Kurseni 12%',
        ],
        popular: false,
      },
      {
        title: 'Pro',
        price: 49.99,
        features: [
          '1,500 conversations + 1,500 calls/month',
          'Everything in Standard',
          'n8n Integration',
          'Custom Voice Training',
          'Advanced Analytics',
          'Priority Support',
          '💰 Kurseni 17%',
        ],
        popular: true,
      },
      {
        title: 'Enterprise',
        price: 69.99,
        features: [
          'Unlimited conversations + calls',
          'Everything in Pro',
          'Dedicated Support',
          'Custom Integrations',
          'Full Audit Logs',
          'White-label Solution',
          '💰 Kurseni 12%',
        ],
        popular: false,
      },
    ],
  },
};

export function Pricing() {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>('bundle');
  const currentProduct = productConfig[selectedProduct];
  const plans = currentProduct.plans;

  return (
    <section id="pricing" className="py-20 sm:py-32 bg-background">
      <div className="mx-auto max-w-6xl w-full px-4">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Çmime të thjeshta dhe transparente
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Zgjidhni produktin dhe planin që përshtaten më mirë me nevojat tuaja
          </p>
        </div>

        {/* Product Selector */}
        <div className="mt-12 max-w-2xl mx-auto">
          <Tabs value={selectedProduct} onValueChange={(v) => setSelectedProduct(v as ProductType)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="chatbot" className="flex flex-col items-center gap-2 py-3">
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm font-medium">Chatbot</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex flex-col items-center gap-2 py-3">
                <Mic className="h-5 w-5" />
                <span className="text-sm font-medium">Voice Agent</span>
              </TabsTrigger>
              <TabsTrigger value="bundle" className="flex flex-col items-center gap-2 py-3 relative">
                <Package className="h-5 w-5" />
                <span className="text-sm font-medium">Bundle</span>
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full">
                  SAVE
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-12 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.title}
              className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold rounded-t-lg">
                  Më i Popullarizuar
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
                <CardDescription className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    €{plan.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground text-base">/muaj</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 min-h-[280px]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-6">
                <Button
                  asChild
                  className="w-full h-11"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link href="/pricing">Zgjidhni Planin</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Të gjitha planet përfshijnë mbështetje email. Kurseni 20% me pagim vjetor.{' '}
            <Link href="/pricing" className="text-primary hover:underline font-medium">
              Shiko detaje →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
