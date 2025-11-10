'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

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
    <Card className="relative bg-card-foreground text-background p-4 rounded-lg overflow-x-auto">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 text-background/50 hover:text-background"
        onClick={() => navigator.clipboard.writeText(code)}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <pre className="font-code text-sm">{code}</pre>
    </Card>
  );
}

export default function InstallPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">Installation Guide</h1>
                <p className="text-muted-foreground">
                    Integrate your AI agent on any platform in under a minute.
                </p>
            </div>

            <Tabs defaultValue="script">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {platforms.map((platform) => (
                <TabsTrigger key={platform.value} value={platform.value}>{platform.label}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="script" className="mt-6">
              <Card>
                <CardHeader>
                    <CardTitle>HTML Script Tag</CardTitle>
                    <CardDescription>
                    The simplest way to get started. Just paste this personalized snippet before the closing &lt;/body&gt; tag on your website.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CodeBlock code={oneLineScript} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="npm" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>NPM for React/Vue/etc.</CardTitle>
                    <CardDescription>
                    For SPAs and modern frameworks, install our NPM package and initialize it with your agent ID.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CodeBlock code={npmSdkScript} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="gtm" className="mt-6">
                <Card><CardContent className="p-8 text-center text-muted-foreground">Instructions for Google Tag Manager coming soon.</CardContent></Card>
            </TabsContent>
            <TabsContent value="shopify" className="mt-6">
                <Card><CardContent className="p-8 text-center text-muted-foreground">Our Shopify App Embed Block makes installation seamless. Instructions coming soon.</CardContent></Card>
            </TabsContent>
            <TabsContent value="wordpress" className="mt-6">
                <Card><CardContent className="p-8 text-center text-muted-foreground">Use our "Unik Agent" WordPress plugin for easy integration. Instructions coming soon.</CardContent></Card>
            </TabsContent>
            <TabsContent value="webflow" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Webflow Integration</CardTitle>
                        <CardDescription>In your Webflow project settings, go to "Custom Code" and paste the 1-line script into the "Footer Code" section.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CodeBlock code={oneLineScript} />
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>

        </div>
    );
}
