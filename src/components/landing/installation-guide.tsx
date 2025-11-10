'use client';

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const oneLineScript = `<script
  src="https://agent.unik.ai/v1/widget.js"
  data-agent-id="AGENT-XXXX"
  defer
></script>`;

const npmSdkScript = `import { initAgent } from '@unik/agent-widget';

initAgent({
  agentId: 'AGENT-XXXX',
});`;

const platforms = [
  { value: "script", label: "1-Line Script" },
  { value: "npm", label: "NPM SDK" },
  { value: "gtm", label: "Google Tag Manager" },
  { value: "shopify", label: "Shopify" },
  { value: "wordpress", label: "WordPress" },
  { value: "webflow", label: "Webflow" },
];

function CodeBlock({ code }: { code: string }) {
  return (
    <Card className="relative bg-black/80 text-white p-4 rounded-lg overflow-x-auto">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 text-white/50 hover:text-white"
        onClick={() => navigator.clipboard.writeText(code)}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <pre className="font-code text-sm">{code}</pre>
    </Card>
  );
}

export function InstallationGuide() {
  return (
    <section id="install" className="py-20 sm:py-32">
      <div className="mx-auto max-w-6xl w-full px-4">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            1-Minute Installation
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Integrate Unik AI Agent effortlessly on any platform. Just copy, paste, and you're live.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-4xl">
          <Tabs defaultValue="script">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {platforms.map((platform) => (
                <TabsTrigger key={platform.value} value={platform.value}>{platform.label}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="script" className="mt-6">
              <h3 className="text-lg font-semibold mb-2">HTML Script Tag</h3>
              <p className="text-muted-foreground mb-4">The simplest way to get started. Just paste this snippet before the closing &lt;/body&gt; tag on your website.</p>
              <CodeBlock code={oneLineScript} />
            </TabsContent>
            <TabsContent value="npm" className="mt-6">
              <h3 className="text-lg font-semibold mb-2">NPM for React/Vue/etc.</h3>
              <p className="text-muted-foreground mb-4">For SPAs and modern frameworks, use our NPM package.</p>
              <CodeBlock code={npmSdkScript} />
            </TabsContent>
            <TabsContent value="gtm" className="mt-6">
                <p className="text-muted-foreground text-center p-8">Instructions for Google Tag Manager coming soon.</p>
            </TabsContent>
            <TabsContent value="shopify" className="mt-6">
                <p className="text-muted-foreground text-center p-8">Our Shopify App Embed Block makes installation seamless.</p>
            </TabsContent>
            <TabsContent value="wordpress" className="mt-6">
                <p className="text-muted-foreground text-center p-8">Use our "Unik Agent" WordPress plugin for easy integration.</p>
            </TabsContent>
            <TabsContent value="webflow" className="mt-6">
                <p className="text-muted-foreground mb-4">In your Webflow project settings, go to "Custom Code" and paste the 1-line script into the "Footer Code" section.</p>
                <CodeBlock code={oneLineScript} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
