'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, TrendingUp, ArrowUpRight, MessageSquare, Phone, Clock } from 'lucide-react';

interface UsageData {
  promptsMonth: number;
  promptsDay: number;
  lastResetMonth: string;
}

interface SubscriptionData {
  plan: string;
  status: string;
  tier: string;
  currentPeriodEnd?: string;
}

interface Conversation {
  id: string;
  message: string;
  response: string;
  createdAt: string;
  tokensUsed: number;
}

interface VoiceCall {
  id: string;
  duration: number;
  status: string;
  transcript?: string;
  createdAt: string;
}

const PLAN_LIMITS: Record<string, number> = {
  STANDARD: 500,
  PRO: 1500,
  ENTERPRISE: 999999, // Unlimited
  Free: 100, // Free tier limit
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [voiceCalls, setVoiceCalls] = useState<VoiceCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [usageRes, subRes, convsRes, callsRes] = await Promise.all([
        fetch('/api/usage'),
        fetch('/api/subscription'),
        fetch('/api/conversations?limit=10'),
        fetch('/api/voice-calls?limit=10'),
      ]);

      if (usageRes.ok) {
        const usageData = await usageRes.json();
        setUsage(usageData);
      }

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData);
      }

      if (convsRes.ok) {
        const convsData = await convsRes.json();
        setConversations(convsData.conversations || []);
      }

      if (callsRes.ok) {
        const callsData = await callsRes.json();
        setVoiceCalls(callsData.voiceCalls || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const planTier = subscription?.tier || 'Free';
  const limit = PLAN_LIMITS[planTier] || 100;
  const used = usage?.promptsMonth || 0;
  const usagePercentage = Math.min((used / limit) * 100, 100);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Mirësevini në panelin tuaj të kontrollit
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Profile Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profili</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">
                  {session?.user?.name || 'User'}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {session?.user?.email}
                </p>
              </CardContent>
            </Card>

            {/* Plan Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plani</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscription?.plan || 'Free'}</div>
                <p className="text-xs text-muted-foreground">
                  Status: {subscription?.status || 'active'}
                </p>
              </CardContent>
            </Card>

            {/* Usage Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Përdorimi</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {used} / {limit === 999999 ? '∞' : limit}
                </div>
                <p className="text-xs text-muted-foreground">Conversations këtë muaj</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs: Usage, Conversations, Voice Calls */}
          <div className="mt-8">
            <Tabs defaultValue="usage" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="usage">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Përdorimi
                </TabsTrigger>
                <TabsTrigger value="conversations">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Biseda ({conversations.length})
                </TabsTrigger>
                <TabsTrigger value="voice">
                  <Phone className="mr-2 h-4 w-4" />
                  Thirrje ({voiceCalls.length})
                </TabsTrigger>
              </TabsList>

              {/* Usage Tab */}
              <TabsContent value="usage">
                <Card>
                  <CardHeader>
                    <CardTitle>Detajet e Përdorimit</CardTitle>
                    <CardDescription>
                      Shikoni limitin tuaj mujor dhe statistikat e përdorimit
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Conversations Mujore</span>
                        <span className="text-sm text-muted-foreground">
                          {usagePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={usagePercentage} className="h-2" />
                    </div>

                    {planTier === 'Free' || planTier === 'STANDARD' ? (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <h3 className="font-semibold mb-2">Përmirëso planin tënd</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Hap akses në më shumë conversations dhe veçori të avancuara
                        </p>
                        <Button asChild>
                          <Link href="/pricing">
                            Shiko Planet
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-lg border bg-muted/50 p-4">
                        <p className="text-sm text-muted-foreground">
                          Ju jeni në planin <strong>{subscription?.plan}</strong>.
                          {planTier === 'ENTERPRISE' && ' Gëzoni përdorim të pakufizuar!'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Conversations Tab */}
              <TabsContent value="conversations">
                <Card>
                  <CardHeader>
                    <CardTitle>Historiku i Bisedave</CardTitle>
                    <CardDescription>
                      Të gjitha komunikimet tuaja përmes Chatbot AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {conversations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-20" />
                        <p>Asnjë bisedë ende. Filloni një bisedë me AI Chatbot!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {conversations.map((conv) => (
                          <div key={conv.id} className="border rounded-lg p-4 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium mb-1">Ju:</p>
                                <p className="text-sm text-muted-foreground mb-3">{conv.message}</p>
                                <p className="text-sm font-medium mb-1">AI:</p>
                                <p className="text-sm">{conv.response}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(conv.createdAt).toLocaleString('sq-AL')}
                              </span>
                              <span>{conv.tokensUsed} tokens</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Voice Calls Tab */}
              <TabsContent value="voice">
                <Card>
                  <CardHeader>
                    <CardTitle>Historiku i Thirrjeve</CardTitle>
                    <CardDescription>
                      Të gjitha thirrjet tuaja përmes Voice Agent AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {voiceCalls.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Phone className="mx-auto h-12 w-12 mb-4 opacity-20" />
                        <p>Asnjë thirrje ende. Aktivizoni Voice Agent për të filluar!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {voiceCalls.map((call) => (
                          <div key={call.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="font-medium">Thirrje</span>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  call.status === 'completed'
                                    ? 'bg-green-500/10 text-green-500'
                                    : 'bg-yellow-500/10 text-yellow-500'
                                }`}
                              >
                                {call.status}
                              </span>
                            </div>
                            {call.transcript && (
                              <p className="text-sm text-muted-foreground mb-2">{call.transcript}</p>
                            )}
                            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(call.createdAt).toLocaleString('sq-AL')}
                              </span>
                              <span>{Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')} min</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
