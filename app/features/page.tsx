import { Header } from '@/src/components/layout/header';
import { Footer } from '@/src/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Mic, Database, BarChart, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'AI Chatbot',
    description: 'Chatbot i fuqishëm me teknologjinë më të fundit të AI që mund të trajnohet me të dhënat tuaja.',
  },
  {
    icon: Mic,
    title: 'Voice Agent',
    description: 'Agjent me zë që mund të kryejë biseda të natyrshme dhe të automatizojë thirrjet.',
  },
  {
    icon: Database,
    title: 'Knowledge Base',
    description: 'Trajnoni chatbot-in tuaj me dokumentet, website-in dhe të dhënat tuaja.',
  },
  {
    icon: BarChart,
    title: 'Analytics',
    description: 'Monitoroni performancën, analizoni bisedat dhe optimizoni strategjinë tuaj.',
  },
  {
    icon: Zap,
    title: 'Integrime',
    description: 'Lidhuni me mjetet tuaja të preferuara: n8n, Zapier, Slack dhe më shumë.',
  },
  {
    icon: Shield,
    title: 'Siguria',
    description: 'Të dhënat tuaja janë të sigurta me enkriptim end-to-end dhe compliance me GDPR.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Veçoritë e Platformës
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Gjithçka që ju nevojitet për të ndërtuar agjentë AI të fuqishëm për biznesin tuaj
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Gati për të filluar?</h2>
            <p className="text-muted-foreground mb-8">
              Provoni Unik AI Agent falas për 7 ditë - pa kartë krediti.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Filloni Tani
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Shiko Çmimet
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
