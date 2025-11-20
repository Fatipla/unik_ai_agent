'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    name: 'Free',
    price: 0,
    interval: 'forever',
    description: 'Perfect for trying out Unik AI',
    features: [
      '5 conversations per day',
      '~150 conversations/month',
      'Chatbot widget',
      'Basic analytics',
      'Community support',
    ],
    limitations: [
      'No voice agent',
      'No WhatsApp integration',
      'Limited knowledge base',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Standard',
    price: 19.99,
    interval: 'month',
    description: 'For growing businesses',
    features: [
      '500 conversations/month',
      'Chatbot widget + API',
      'Knowledge base training',
      'WhatsApp integration',
      'Advanced analytics',
      'Email support',
      '€9.995 AI cost cap',
      '7-day free trial',
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Pro',
    price: 29.99,
    interval: 'month',
    description: 'For established companies',
    features: [
      '1,500 conversations/month',
      'Everything in Standard',
      'Voice agent enabled',
      'n8n workflow integration',
      'Priority support',
      'Custom branding',
      '€14.995 AI cost cap',
    ],
    limitations: [],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 39.99,
    interval: 'month',
    description: 'For large organizations',
    features: [
      'Unlimited conversations',
      'Everything in Pro',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Volume discounts',
      '€19.995 AI cost cap',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');

  const calculatePrice = (price: number) => {
    if (price === 0) return 0;
    return interval === 'yearly' ? (price * 12 * 0.7).toFixed(2) : price.toFixed(2);
  };

  const getDisplayInterval = () => {
    return interval === 'yearly' ? '/year' : '/month';
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Simple, predictable pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the perfect plan for your business. All plans include our 50% AI cost cap guarantee.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex rounded-lg border p-1">
            <button
              onClick={() => setInterval('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                interval === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                interval === 'yearly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly <span className="ml-1 text-xs">(Save 30%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular ? 'border-primary shadow-lg scale-105' : ''
              }`}
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
                  <span className="text-4xl font-bold">
                    €{calculatePrice(plan.price)}
                  </span>
                  <span className="text-muted-foreground">
                    {plan.price === 0 ? '' : getDisplayInterval()}
                  </span>
                </div>
                {interval === 'yearly' && plan.price > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    €{plan.price.toFixed(2)}/month billed yearly
                  </p>
                )}
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <a href={plan.name === 'Free' ? '/signup' : '/signup'}>
                    {plan.cta}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What is the 50% AI cost cap?</h3>
              <p className="text-muted-foreground">
                We guarantee that AI processing costs never exceed 50% of your plan's monthly revenue.
                For example, on the Standard plan (€19.99/month), AI costs are capped at €9.995.
                This ensures predictable pricing and protects you from unexpected bills.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can I switch plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                and we'll prorate any unused time on your current plan.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What happens if I exceed my conversation limit?</h3>
              <p className="text-muted-foreground">
                Your widget will display an upgrade prompt to your visitors. You can upgrade at any time
                to continue service without interruption.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Yes! The Standard plan includes a 7-day free trial. No credit card required to start
                the Free plan. You can cancel anytime during the trial period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American Express) and PayPal via Paddle.
                Enterprise customers can request invoice billing.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your customer experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start with our free plan, no credit card required.
          </p>
          <Button size="lg" asChild>
            <a href="/signup">Get Started Free</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
