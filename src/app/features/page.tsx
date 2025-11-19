import { CheckCircle2, MessageSquare, Mic, Database, BarChart3, Shield, Zap, Globe } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'AI-Powered Chatbot',
    description: 'Intelligent conversations powered by GPT-4o. Instant responses, 24/7 availability.',
  },
  {
    icon: Mic,
    title: 'Voice Agent',
    description: 'Transcribe calls, classify intents, generate speech. Seamless voice interactions.',
  },
  {
    icon: Database,
    title: 'Knowledge Base Training',
    description: 'Train from URLs or upload documents. Custom knowledge for accurate responses.',
  },
  {
    icon: BarChart3,
    title: 'Usage Analytics',
    description: 'Track conversations, costs, and performance. Real-time insights dashboard.',
  },
  {
    icon: Shield,
    title: '50% Cost Cap Guarantee',
    description: 'AI costs never exceed 50% of plan revenue. Predictable, transparent pricing.',
  },
  {
    icon: Zap,
    title: 'Easy Integration',
    description: '1-line script, NPM package, or API. Works with any website or app.',
  },
  {
    icon: Globe,
    title: 'Multi-language Support',
    description: 'English, German, Albanian. Automatic detection and translation.',
  },
  {
    icon: CheckCircle2,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant, GDPR ready. Row-level security and encryption.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Everything you need to deploy AI agents
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          From chatbots to voice agents, knowledge training to analytics—Unik AI provides
          a complete platform for building intelligent customer experiences.
        </p>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-lg border p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Built for every use case</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-background p-6">
              <h3 className="text-xl font-semibold mb-3">E-commerce</h3>
              <p className="text-muted-foreground mb-4">
                Product recommendations, order tracking, and instant customer support.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>24/7 shopping assistance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>Abandoned cart recovery</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>Size and fit guidance</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-background p-6">
              <h3 className="text-xl font-semibold mb-3">SaaS</h3>
              <p className="text-muted-foreground mb-4">
                Onboarding, feature education, and technical support automation.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>Guided product tours</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>API documentation help</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>Troubleshooting assistance</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-background p-6">
              <h3 className="text-xl font-semibold mb-3">Healthcare</h3>
              <p className="text-muted-foreground mb-4">
                Appointment scheduling, symptom checking, and patient education.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>HIPAA-compliant conversations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>Voice-based interactions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>Multi-language support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of businesses using Unik AI to automate customer interactions.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Start Free Trial
          </a>
          <a
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View Pricing
          </a>
        </div>
      </section>
    </div>
  );
}
