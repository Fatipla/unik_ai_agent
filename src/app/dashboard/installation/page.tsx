'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy } from 'lucide-react';

export default function InstallationPage() {
  const [widgetCode, setWidgetCode] = useState('');
  const [guides, setGuides] = useState<any>({});
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      const [codeRes, guideRes] = await Promise.all([
        fetch('/api/widget-code', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/install/guide', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (codeRes.ok) {
        const data = await codeRes.json();
        setWidgetCode(data.code);
      }

      if (guideRes.ok) {
        const data = await guideRes.json();
        setGuides(data.guides);
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Installation</h1>
        <p className="text-muted-foreground">
          Get your widget up and running in minutes
        </p>
      </div>

      <Tabs defaultValue="script" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="script">Script</TabsTrigger>
          <TabsTrigger value="npm">NPM</TabsTrigger>
          <TabsTrigger value="gtm">GTM</TabsTrigger>
          <TabsTrigger value="shopify">Shopify</TabsTrigger>
          <TabsTrigger value="wordpress">WordPress</TabsTrigger>
          <TabsTrigger value="webflow">Webflow</TabsTrigger>
        </TabsList>

        {Object.entries(guides).map(([key, guide]: [string, any]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <CardTitle>{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {guide.code && (
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{guide.code}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(guide.code, key)}
                    >
                      {copied === key ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-semibold">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {guide.steps.map((step: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
