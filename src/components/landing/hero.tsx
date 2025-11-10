import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Hero() {
  const heroImage = {
      "id": "hero-dashboard-v2",
      "description": "Cinematic 4K render of a SaaS platform dashboard on a glass screen, with purple and blue glowing UI elements. Positioned on the right side of a dark hero section with a blurred futuristic city skyline.",
      "imageUrl": "https://storage.googleapis.com/gemini-studio-assets/project-images%2F2494958f-3151-409e-9764-28490a07c91f.jpeg",
      "imageHint": "futuristic dashboard"
    };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-background"
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

          <div className="flex justify-center md:justify-end">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    width={600}
                    height={550}
                    className="w-full max-w-[600px] rounded-lg"
                    data-ai-hint={heroImage.imageHint}
                    priority
                />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}