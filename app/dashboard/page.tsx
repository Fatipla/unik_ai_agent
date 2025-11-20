'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/src/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, CreditCard, TrendingUp, ArrowUpRight } from 'lucide-react';

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
      const [usageRes, subRes] = await Promise.all([
        fetch('/api/usage'),
        fetch('/api/subscription'),
      ]);

      if (usageRes.ok) {
        const usageData = await usageRes.json();
        setUsage(usageData);
      }

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData);
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

          {/* Usage Details */}
          <Card className="mt-6">
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
        </div>
      </main>
    </div>
  );
}
