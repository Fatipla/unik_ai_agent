'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function DevSetupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/setup-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, setupKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message || 'Admin created successfully!' });
        // Clear form
        setEmail('');
        setPassword('');
        setName('');
        setSetupKey('');
      } else {
        setResult({ success: false, message: data.error || 'Failed to create admin' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🔧 Dev Setup - Create Admin</CardTitle>
          <CardDescription>
            Create an admin user for testing and development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 8 characters"
                minLength={8}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="setupKey">Setup Key *</Label>
              <Input
                id="setupKey"
                type="password"
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
                required
                placeholder="ADMIN_SETUP_SECRET"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default: "change-me-in-production" (check .env)
              </p>
            </div>

            {result && (
              <Alert variant={result.success ? 'default' : 'destructive'}>
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Admin User'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">📋 Quick Start:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Fill in your email and password</li>
              <li>Enter setup key (default or from .env)</li>
              <li>Click "Create Admin User"</li>
              <li>Go to <a href="/login" className="text-primary underline">/login</a> and sign in</li>
              <li>Access <a href="/admin" className="text-primary underline">/admin</a> dashboard</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
