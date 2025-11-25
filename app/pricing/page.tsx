'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Header } from '@/src/components/layout/header';
import { Footer } from '@/src/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, MessageSquare, Mic, Package } from 'lucide-react';

type ProductType = 'chatbot' | 'voice' | 'bundle';

const productConfig = {
  chatbot: {
    name: 'Chatbot',
    icon: MessageSquare,
    description: 'AI Chatbot për website dhe aplikacione',
    plans: [
      {
        id: 'chatbot-standard',
        title: 'Standard',
        monthlyPrice: 19.99,
        yearlyPrice: 19.99 * 12 * 0.8,
        priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_CHATBOT_STANDARD_M || 'pri_chatbot_standard_m',
        priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_CHATBOT_STANDARD_Y || 'pri_chatbot_standard_y',
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
        id: 'chatbot-pro',
        title: 'Pro',
        monthlyPrice: 29.99,
        yearlyPrice: 29.99 * 12 * 0.8,
        priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_CHATBOT_PRO_M || 'pri_chatbot_pro_m',
        priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_CHATBOT_PRO_Y || 'pri_chatbot_pro_y',
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
        id: 'chatbot-enterprise',
        title: 'Enterprise',
        monthlyPrice: 39.99,
        yearlyPrice: 39.99 * 12 * 0.8,
        priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_CHATBOT_ENTERPRISE_M || 'pri_chatbot_enterprise_m',
        priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_CHATBOT_ENTERPRISE_Y || 'pri_chatbot_enterprise_y',
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
    description: 'AI Voice Agent për thirrje automatike',
    plans: [
      {
        id: 'voice-standard',
        title: 'Standard',
        monthlyPrice: 19.99,
        yearlyPrice: 19.99 * 12 * 0.8,
        priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_VOICE_STANDARD_M || 'pri_voice_standard_m',
        priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_VOICE_STANDARD_Y || 'pri_voice_standard_y',
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
        id: 'voice-pro',
        title: 'Pro',
        monthlyPrice: 29.99,
        yearlyPrice: 29.99 * 12 * 0.8,
        priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_VOICE_PRO_M || 'pri_voice_pro_m',
        priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_VOICE_PRO_Y || 'pri_voice_pro_y',
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
        id: 'voice-enterprise',
        title: 'Enterprise',
        monthlyPrice: 39.99,
        yearlyPrice: 39.99 * 12 * 0.8,
        priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_VOICE_ENTERPRISE_M || 'pri_voice_enterprise_m',
        priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_VOICE_ENTERPRISE_Y || 'pri_voice_enterprise_y',
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
    name: 'Bundle (Chatbot + Voice)',
    icon: Package,
    description: 'Zgjidhja e plotë - Chatbot dhe Voice Agent',
    plans: [
      {
        id: 'bundle-standard',
        title: 'Standard',
        monthlyPrice: 34.99,
        yearlyPrice: 34.99 * 12 * 0.8,
        priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_BUNDLE_STANDARD_M || 'pri_bundle_standard_m',
        priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_BUNDLE_STANDARD_Y || 'pri_bundle_standard_y',
        features: [
          '500 conversations + 500 calls/month',
          'Chatbot Widget & API',
          'Voice Agent (TTS/Whisper)',
          'Knowledge Base Training',
          'Basic Analytics',
          '7-Day Free Trial',
          '💰 Kurseni 12% vs. blerja e veçantë',
        ],
        
        popular: false,
      },
      {
        id: 'bundle-pro',
        title: 'Pro',
        monthlyPrice: 49.99,
        yearlyPrice: 49.99 * 12 * 0.8,
        priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_BUNDLE_PRO_M || 'pri_bundle_pro_m',
        priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_BUNDLE_PRO_Y || 'pri_bundle_pro_y',
        features: [
          '1,500 conversations + 1,500 calls/month',
          'Everything in Standard',
          'n8n Integration',
          'Custom Voice Training',
          'Advanced Analytics',
          'Priority Support',
          '💰 Kurseni 17% vs. blerja e veçantë',
        ],
        
        popular: true,
      },
      {
        id: 'bundle-enterprise',
        title: 'Enterprise',
        monthlyPrice: 69.99,
        yearlyPrice: 69.99 * 12 * 0.8,
        priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_BUNDLE_ENTERPRISE_M || 'pri_bundle_enterprise_m',
        priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_BUNDLE_ENTERPRISE_Y || 'pri_bundle_enterprise_y',
        features: [
          'Unlimited conversations + calls',
          'Everything in Pro',
          'Dedicated Support',
          'Custom Integrations',
          'Full Audit Logs',
          'White-label Solution',
          '💰 Kurseni 12% vs. blerja e veçantë',
        ],
        
        popular: false,
      },
    ],
  },
};

export default function PricingPage() {
  const { data: session } = useSession();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>('bundle');

  const handleCheckout = async (priceId: string) => {
    if (!session) {
      window.location.href = '/login?callbackUrl=/pricing';
      return;
    }

    try {
      const response = await fetch('/api/paddle/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const currentProduct = productConfig[selectedProduct];
  const plans = currentProduct.plans;
  const ProductIcon = currentProduct.icon;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Çmime të thjeshta dhe transparente
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Zgjidhni produktin dhe planin që përshtaten më mirë me nevojat tuaja. Anuloni në çdo kohë.
            </p>

            {/* Product Selector */}
            <div className="mt-10">
              <Tabs value={selectedProduct} onValueChange={(v) => setSelectedProduct(v as ProductType)} className="w-full">
                <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-auto p-1">
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
              <p className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
                <ProductIcon className="h-4 w-4" />
                {currentProduct.description}
              </p>
            </div>

            {/* Monthly/Yearly Toggle */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <Label htmlFor="billing-toggle" className={!isYearly ? 'font-semibold' : ''}>
                Mujore
              </Label>
              <Switch
                id="billing-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <Label htmlFor="billing-toggle" className={isYearly ? 'font-semibold' : ''}>
                Vjetore
                <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                  -20%
                </span>
              </Label>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const priceId = isYearly ? plan.priceIdYearly : plan.priceIdMonthly;
              const isEnterprise = plan.id.includes('enterprise');

              return (
                <Card
                  key={plan.id}
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
                        €{price.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground text-base">
                        /{isYearly ? 'vit' : 'muaj'}
                      </span>
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
                    {isEnterprise ? (
                      <Button asChild className="w-full h-11" variant="outline">
                        <Link href="/contact">Zgjidhni Planin</Link>
                      </Button>
                    ) : (
                      <Button
                        className="w-full h-11"
                        variant={plan.popular ? 'default' : 'outline'}
                        onClick={() => handleCheckout(priceId)}
                      >
                        Zgjidhni Planin
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* FAQ or Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              Të gjitha planet përfshijnë mbështetje email. Për pyetje, na kontaktoni në{' '}
              <Link href="/contact" className="text-primary hover:underline">
                faqen e kontaktit
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
