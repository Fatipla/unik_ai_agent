import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Phone, DollarSign, Puzzle } from "lucide-react";

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: "Chatbot Web Widget",
    description: "Integrate a customizable chatbot widget on your website for instant customer support and lead generation.",
  },
  {
    icon: <Phone className="h-8 w-8 text-primary" />,
    title: "Voice Agent with n8n",
    description: "Handle voice calls, transcribe them, determine intent, and use TTS for responses. Orchestrate complex workflows with n8n.",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: "Predictable Cost Management",
    description: "Strictly monitor and cap your OpenAI costs at 50% of your plan's revenue, ensuring predictable, risk-free scaling.",
  },
  {
    icon: <Puzzle className="h-8 w-8 text-primary" />,
    title: "1-Minute Installation",
    description: "Get started in seconds with a simple 1-line script, NPM package, GTM template, or our dedicated Shopify/WordPress plugins.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="mx-auto max-w-6xl w-full px-4">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need. Nothing you don't.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Unik AI Agent provides a comprehensive suite of tools to automate customer interactions and drive growth, all with transparent pricing and effortless setup.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  {feature.icon}
                  <span className="font-headline text-xl">{feature.title}</span>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
