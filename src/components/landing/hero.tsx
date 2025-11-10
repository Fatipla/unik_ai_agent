import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <section className="relative bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative z-10 py-20 text-center lg:py-48 lg:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
              The Ultimate AI Agent Platform for Your Business
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-lg text-muted-foreground lg:mx-0">
              Integrate a powerful Chatbot and Voice Agent in minutes. Boost conversions, automate support, and manage costs with predictable pricing.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Get Started for Free
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-96 lg:h-full">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover rounded-2xl shadow-2xl"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent lg:bg-gradient-to-r"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
