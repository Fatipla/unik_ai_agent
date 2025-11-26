import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code } from 'lucide-react';

export default function InstallationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Instalimi dhe Integrimi
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Filloni me Unik AI Agent në pak minuta
              </p>
            </div>

            <Tabs defaultValue="widget" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="widget">Widget</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="voice">Voice Agent</TabsTrigger>
              </TabsList>

              <TabsContent value="widget" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Chat Widget</CardTitle>
                    <CardDescription>
                      Shtoni një chatbot AI në faqen tuaj me vetëm një rresht kodi
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Hapi 1: Merrni API Key-in tuaj</h3>
                      <p className="text-sm text-muted-foreground">
                        Shkoni te Dashboard → Settings → API Keys
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Hapi 2: Shtoni script-in</h3>
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{`<script>
  (function() {
    var widget = document.createElement('script');
    widget.src = 'https://cdn.unik-ai.com/widget.js';
    widget.setAttribute('data-api-key', 'YOUR_API_KEY');
    document.head.appendChild(widget);
  })();
</script>`}</code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Hapi 3: Personalizoni</h3>
                      <p className="text-sm text-muted-foreground">
                        Konfiguroni ngjyrat, pozicionin dhe sjelljen e widget-it nga Dashboard.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="api" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>REST API</CardTitle>
                    <CardDescription>
                      Integroni Unik AI në aplikacionin tuaj
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint</h3>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>POST https://api.unik-ai.com/v1/chat</code>
                      </pre>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Shembull (cURL)</h3>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`curl -X POST https://api.unik-ai.com/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Hello!",
    "session_id": "unique-session-id"
  }'`}</code>
                      </pre>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Response</h3>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`{
  "response": "Hi! How can I help you?",
  "session_id": "unique-session-id",
  "tokens_used": 15
}`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voice" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Agent</CardTitle>
                    <CardDescription>
                      Konfiguroni një agjent me zë për thirrje automatike
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Hapi 1: Aktivizoni Voice Agent</h3>
                      <p className="text-sm text-muted-foreground">
                        Shkoni te Dashboard → Voice Settings dhe aktivizoni veçorinë.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Hapi 2: Konfiguroni numrin tuaj</h3>
                      <p className="text-sm text-muted-foreground">
                        Lidhni një numër telefoni ose përdorni një të ri nga Unik AI.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Hapi 3: Testoni</h3>
                      <p className="text-sm text-muted-foreground">
                        Bëni një thirrje test për të verifikuar konfigurimin.
                      </p>
                    </div>

                    <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                      <p className="text-sm">
                        <strong>Shënim:</strong> Voice Agent është i disponueshëm vetëm në planet Pro dhe Enterprise.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
