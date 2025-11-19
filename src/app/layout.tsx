import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  metadataBase: new URL('https://agent.unik.ai'),
  title: {
    default: 'Unik AI Agent Platform - AI-Powered Chatbot & Voice Agent',
    template: '%s | Unik AI Agent',
  },
  description: 'Enterprise-grade AI chatbot and voice agent platform with predictable pricing. Integrate in minutes, scale with confidence. 50% AI cost cap guarantee.',
  keywords: ['AI chatbot', 'voice agent', 'chatbot platform', 'AI assistant', 'customer support automation', 'conversational AI'],
  authors: [{ name: 'Unik AI' }],
  creator: 'Unik AI',
  publisher: 'Unik AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://agent.unik.ai',
    siteName: 'Unik AI Agent Platform',
    title: 'Unik AI Agent Platform - AI-Powered Chatbot & Voice Agent',
    description: 'Enterprise-grade AI chatbot and voice agent platform with predictable pricing. 50% AI cost cap guarantee.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Unik AI Agent Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unik AI Agent Platform - AI-Powered Chatbot & Voice Agent',
    description: 'Enterprise-grade AI chatbot and voice agent platform with predictable pricing.',
    images: ['/og-image.png'],
    creator: '@unikai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://agent.unik.ai',
    languages: {
      'en': 'https://agent.unik.ai/en',
      'de': 'https://agent.unik.ai/de',
      'sq': 'https://agent.unik.ai/al',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
