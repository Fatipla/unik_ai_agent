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
import { Check } from 'lucide-react';

const plans = [
  {
    id: 'standard',
    title: 'Standard',
    monthlyPrice: 19.99,
    yearlyPrice: 19.99 * 12 * 0.8, // 20% discount
    priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_STANDARD_M || 'pri_standard_m',
    priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_STANDARD_Y || 'pri_standard_y',
    features: [
      '500 conversations/month',
      'Widget & API access',
      'Knowledge Base training',
      'Basic Analytics',
      '7-Day Free Trial',
    ],
    cta: 'Start 7-Day Trial',
    popular: false,
  },
  {
    id: 'pro',
    title: 'Pro',
    monthlyPrice: 29.99,
    yearlyPrice: 29.99 * 12 * 0.8,
    priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_M || 'pri_pro_m',
    priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_Y || 'pri_pro_y',
    features: [
      '1,500 conversations/month',
      'Everything in Standard',
      'Voice AI (TTS/Whisper)',
      'n8n Integration',
      'Advanced Analytics',
    ],
    cta: 'Choose Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    monthlyPrice: 39.99,
    yearlyPrice: 39.99 * 12 * 0.8,
    priceIdMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_ENTERPRISE_M || 'pri_enterprise_m',
    priceIdYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_ENTERPRISE_Y || 'pri_enterprise_y',
    features: [
      'Unlimited conversations',
      'Everything in Pro',
      'Dedicated Support',
      'Custom Integrations',
      'Full Audit Logs',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [isYearly, setIsYearly] = useState(false);

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Çmime të thjeshta dhe transparente
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Zgjidhni planin që përshtatet më mirë me nevojat tuaja. Anuloni në çdo kohë.
            </p>

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
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {plans.map((plan) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const priceId = isYearly ? plan.priceIdYearly : plan.priceIdMonthly;

              return (
                <Card
                  key={plan.id}
                  className={plan.popular ? 'border-primary shadow-lg scale-105' : ''}
                >
                  {plan.popular && (
                    <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold">
                      Më i Popullarizuar
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.title}</CardTitle>
                    <CardDescription>
                      <span className="text-4xl font-bold text-foreground">
                        €{price.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">
                        /{isYearly ? 'vit' : 'muaj'}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {plan.id === 'enterprise' ? (
                      <Button asChild className="w-full" variant="outline">
                        <Link href="/contact">{plan.cta}</Link>
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant={plan.popular ? 'default' : 'outline'}
                        onClick={() => handleCheckout(priceId)}
                      >
                        {plan.cta}
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
    </main>
  );
}
