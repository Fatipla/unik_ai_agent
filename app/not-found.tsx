import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <Logo className="mx-auto h-16 w-16 text-primary" />
        <div>
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Faqja nuk u gjet
          </h2>
          <p className="mt-2 text-muted-foreground">
            Faqja që po kërkoni nuk ekziston ose është zhvendosur.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/">Kthehu në faqen kryesore</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
