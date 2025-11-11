import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-dashboard');

  return (
    <section id="home" className="relative bg-background">
      <div className="mx-auto max-w-6xl w-full px-4 h-screen min-h-[700px] flex items-center">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <div className="text-center md:text-left">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold leading-tight text-foreground">
              The Ultimate AI Agent Platform for Your Business
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
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
              >
                <Link href="#pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
          
          <div>
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={1200}
                height={900}
                className="rounded-xl shadow-2xl"
                priority
                data-ai-hint={heroImage.imageHint}
              />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
