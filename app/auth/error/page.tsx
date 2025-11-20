'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

const errorMessages: Record<string, string> = {
  Signin: 'Provoni të hyni me një llogari tjetër.',
  OAuthSignin: 'Provoni të hyni me një llogari tjetër.',
  OAuthCallback: 'Provoni të hyni me një llogari tjetër.',
  OAuthCreateAccount: 'Provoni të hyni me një llogari tjetër.',
  EmailCreateAccount: 'Provoni të hyni me një llogari tjetër.',
  Callback: 'Provoni të hyni me një llogari tjetër.',
  OAuthAccountNotLinked: 'Për të konfirmuar identitetin tuaj, hyni me të njëjtin llogari që përdorët fillimisht.',
  EmailSignin: 'Emaili nuk mund të dërgohej.',
  CredentialsSignin: 'Hyrja dështoi. Kontrolloni detajet që jepët.',
  SessionRequired: 'Ju lutem hyni për të aksesuar këtë faqe.',
  default: 'Dicka shkoi keq.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorMessage = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <Logo className="mx-auto h-12 w-12 text-primary" />
        <div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Gabim gjatë autentifikimit</h2>
          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
        </div>
        <div className="mt-8 space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Provo përsëri</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Kthehu në faqen kryesore</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
