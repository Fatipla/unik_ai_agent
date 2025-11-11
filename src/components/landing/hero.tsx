import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-dashboard');

  return (
    <section id="home" className="relative">
      <div className="mx-auto max-w-6xl w-full px-4 pt-24 lg:pt-32 pb-16">
        <div className="grid lg:grid-cols-2 items-center gap-10">
          <div className="text-center lg:text-left">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold leading-tight text-foreground">
              The Ultimate AI Agent Platform for Your Business
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Integrate a powerful Chatbot and Voice Agent in minutes. Boost
              conversions, automate support, and manage costs with predictable
              pricing.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Get Started for Free
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
          
          <div className="relative">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={1200}
                height={900}
                className="rounded-xl"
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
