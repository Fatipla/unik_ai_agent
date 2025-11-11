import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-dashboard-v3');

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: heroImage ? `url(${heroImage.imageUrl})` : 'none',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative mx-auto max-w-6xl w-full px-4">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <div className="text-center md:text-left">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold leading-tight text-white">
              The Ultimate AI Agent Platform for Your Business
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Integrate a powerful Chatbot and Voice Agent in minutes. Boost
              conversions, automate support, and manage costs with predictable
              pricing.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Get Started for Free
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground/20 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="#pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
          
          {/* The image is now the background of the section */}
          <div />

        </div>
      </div>
    </section>
  );
}
