'use client';

import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ProductType = 'chatbot' | 'voice' | 'both';
type BillingPeriod = 'monthly' | 'yearly';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  priceMonthly: number;
  priceYearly: number; // monthly equivalent after -20%
  description: string;
  features: PlanFeature[];
  highlighted: boolean;
  ctaText: string;
}

const chatbotPlans: Plan[] = [
  {
    name: 'Standard',
    priceMonthly: 19.99,
    priceYearly: 15.99,
    description: 'Perfect for small businesses',
    features: [
      { text: '10,000 chat messages/month', included: true },
      { text: '1M embedding tokens/month', included: true },
      { text: '1 seat', included: true },
      { text: 'Chatbot widget & API', included: true },
      { text: 'Knowledge base training', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Email support', included: true },
      { text: 'Voice agent', included: false },
      { text: 'Custom branding', included: false },
    ],
    highlighted: false,
    ctaText: 'Start Free Trial',
  },
  {
    name: 'Pro',
    priceMonthly: 29.99,
    priceYearly: 23.99,
    description: 'For growing teams',
    features: [
      { text: '100,000 chat messages/month', included: true },
      { text: '10M embedding tokens/month', included: true },
      { text: '5 seats', included: true },
      { text: 'Everything in Standard', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Priority support', included: true },
      { text: 'Voice agent', included: false },
    ],
    highlighted: true,
    ctaText: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    priceMonthly: 39.99,
    priceYearly: 31.99,
    description: 'For large organizations',
    features: [
      { text: '200,000 chat messages/month', included: true },
      { text: '20M embedding tokens/month', included: true },
      { text: '10 seats', included: true },
      { text: 'Everything in Pro', included: true },
      { text: 'SSO & SAML', included: true },
      { text: 'Priority support', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Voice agent', included: false },
    ],
    highlighted: false,
    ctaText: 'Contact Sales',
  },
];

const voicePlans: Plan[] = [
  {
    name: 'Standard',
    priceMonthly: 24.99,
    priceYearly: 19.99,
    description: 'Perfect for small businesses',
    features: [
      { text: '300 voice minutes/month', included: true },
      { text: '1 seat', included: true },
      { text: 'Voice agent (STT + TTS)', included: true },
      { text: 'Real-time transcription', included: true },
      { text: 'Call recording', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Email support', included: true },
      { text: 'Chatbot widget', included: false },
      { text: 'Custom branding', included: false },
    ],
    highlighted: false,
    ctaText: 'Start Free Trial',
  },
  {
    name: 'Pro',
    priceMonthly: 34.99,
    priceYearly: 27.99,
    description: 'For growing teams',
    features: [
      { text: '3,000 voice minutes/month', included: true },
      { text: '5 seats', included: true },
      { text: 'Everything in Standard', included: true },
      { text: 'Custom voice profiles', included: true },
      { text: 'Barge-in support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Priority support', included: true },
      { text: 'Chatbot widget', included: false },
    ],
    highlighted: true,
    ctaText: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    priceMonthly: 49.99,
    priceYearly: 39.99,
    description: 'For large organizations',
    features: [
      { text: '6,000 voice minutes/month', included: true },
      { text: '10 seats', included: true },
      { text: 'Everything in Pro', included: true },
      { text: 'SSO & SAML', included: true },
      { text: 'Priority support', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'Chatbot widget', included: false },
    ],
    highlighted: false,
    ctaText: 'Contact Sales',
  },
];

const bundlePlans: Plan[] = [
  {
    name: 'Standard',
    priceMonthly: 39.99,
    priceYearly: 31.99,
    description: 'Perfect for small businesses',
    features: [
      { text: '20,000 chat messages/month', included: true },
      { text: '600 voice minutes/month', included: true },
      { text: '2M embedding tokens/month', included: true },
      { text: '3 seats', included: true },
      { text: 'Chatbot + Voice agent', included: true },
      { text: 'Knowledge base training', included: true },
      { text: 'Custom branding', included: true },
      { text: 'API access', included: true },
    ],
    highlighted: false,
    ctaText: 'Start Free Trial',
  },
  {
    name: 'Pro',
    priceMonthly: 59.99,
    priceYearly: 47.99,
    description: 'For growing teams',
    features: [
      { text: '200,000 chat messages/month', included: true },
      { text: '6,000 voice minutes/month', included: true },
      { text: '20M embedding tokens/month', included: true },
      { text: '10 seats', included: true },
      { text: 'Everything in Standard', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Priority support', included: true },
      { text: 'Webhooks & integrations', included: true },
    ],
    highlighted: true,
    ctaText: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    priceMonthly: 79.99,
    priceYearly: 63.99,
    description: 'For large organizations',
    features: [
      { text: 'Unlimited chat messages', included: true },
      { text: 'Unlimited voice minutes', included: true },
      { text: 'Unlimited embedding tokens', included: true },
      { text: 'Unlimited seats', included: true },
      { text: 'Everything in Pro', included: true },
      { text: 'SSO & SAML', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SLA guarantee', included: true },
    ],
    highlighted: false,
    ctaText: 'Contact Sales',
  },
];

const productLabels = {
  chatbot: 'Chatbot',
  voice: 'Voice Agent',
  both: 'Both',
};

export default function PricingPage() {
  const [product, setProduct] = useState<ProductType>('both');
  const [billing, setBilling] = useState<BillingPeriod>('monthly');

  const currentPlans = product === 'chatbot' ? chatbotPlans : product === 'voice' ? voicePlans : bundlePlans;

  const handleCheckout = async (planName: string) => {
    // Map plan to planKey
    const productPrefix = product === 'chatbot' ? 'CHATBOT' : product === 'voice' ? 'VOICE' : 'BUNDLE';
    const planKey = `${productPrefix}_${planName.toUpperCase()}`;
    const period = billing === 'monthly' ? 'M' : 'Y';

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey, period }),
      });

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.error('Checkout error:', data);
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
    }
  };

  return (
    <div className="min-h-screen py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, predictable pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the perfect plan for your business. Save 20% with yearly billing.
          </p>

          {/* Controls Row */}
          <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto gap-4 mb-8">
            {/* Product Switcher (Segmented Control) */}
            <div className="inline-flex rounded-lg border p-1 bg-muted/50">
              {(['chatbot', 'voice', 'both'] as ProductType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setProduct(type)}
                  className={cn(
                    'px-6 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    product === type
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {productLabels[type]}
                </button>
              ))}
            </div>

            {/* Billing Toggle */}
            <div className="inline-flex rounded-lg border p-1 bg-muted/50">
              <button
                onClick={() => setBilling('monthly')}
                className={cn(
                  'px-6 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  billing === 'monthly'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={cn(
                  'px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 relative',
                  billing === 'yearly'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Yearly
                <span className="ml-1.5 text-xs font-semibold">
                  {billing === 'yearly' ? '(-20%)' : ''}
                </span>
              </button>
            </div>
          </div>

          {/* Footnote */}
          <p className="text-sm text-muted-foreground">
            {billing === 'monthly' ? 'Billed monthly' : 'Billed annually • Save 20% on yearly plans'}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {currentPlans.map((plan) => {
            const price = billing === 'monthly' ? plan.priceMonthly : plan.priceYearly;
            const annualTotal = billing === 'yearly' ? (price * 12).toFixed(2) : null;

            return (
              <Card
                key={plan.name}
                className={cn(
                  'relative flex flex-col transition-all duration-200',
                  plan.highlighted
                    ? 'border-primary shadow-xl scale-105 z-10'
                    : 'hover:shadow-lg hover:scale-102'
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold tracking-tight">
                        €{price.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground text-lg">/month</span>
                    </div>
                    {billing === 'yearly' && annualTotal && (
                      <p className="text-sm text-muted-foreground mt-2">
                        €{annualTotal} billed annually
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow pb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check
                          className={cn(
                            'h-5 w-5 flex-shrink-0 mt-0.5',
                            feature.included ? 'text-primary' : 'text-muted-foreground/40'
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm',
                            feature.included ? 'text-foreground' : 'text-muted-foreground line-through'
                          )}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => handleCheckout(plan.name)}
                  >
                    {plan.ctaText}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Save Badge for Yearly */}
        {billing === 'yearly' && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              You're saving 20% with annual billing!
            </div>
          </div>
        )}

        {/* Pricing Disclaimers */}
        <div className="mt-12 max-w-3xl mx-auto bg-muted/30 border border-border rounded-lg p-6 space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Provë falas 7 ditë.</strong> Pas provës, plani rinovohet automatikisht sipas periudhës së zgjedhur (mujor ose vjetor) derisa ta anulosh.
          </p>
          <p>
            Anulo kur të duash nga "Manage billing" (portali i faturimit).
          </p>
          <p>
            Çmimet janë pa TVSH; taksat llogariten nga Paddle në checkout.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">What's included in each plan?</h3>
              <p className="text-muted-foreground">
                Each plan includes different quotas for chat messages, voice minutes, and seats.
                All plans include API access, knowledge base training, and email support.
                Pro and Enterprise plans include custom branding and priority support.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Can I switch plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time through the billing dashboard.
                Changes are prorated automatically by Paddle.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What happens if I exceed my limits?</h3>
              <p className="text-muted-foreground">
                When you reach your monthly quota, you'll receive a notification to upgrade.
                You can purchase add-on packs for extra messages or minutes, or upgrade to a higher plan.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Yes! All Standard and Pro plans include a 14-day free trial. No credit card required.
                Enterprise plans include a 30-day trial with dedicated onboarding.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American Express), PayPal,
                and wire transfer for Enterprise customers. All payments are processed securely through Paddle.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">How does the 20% annual discount work?</h3>
              <p className="text-muted-foreground">
                When you choose yearly billing, you get 20% off the monthly price. For example,
                the Bundle Pro plan costs €59.99/month or €47.99/month when billed annually (€575.88/year).
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center bg-primary/5 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your customer experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your free trial today. No credit card required.
          </p>
          <Button size="lg" className="px-8" asChild>
            <a href="/signup">Get Started Free</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
