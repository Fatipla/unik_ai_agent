import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === "hero-dashboard-v2")

  return (
    <section id="home" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl w-full px-4">
        <div className="grid lg:grid-cols-2 items-center gap-12">
          <div className="text-center lg:text-left">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold leading-tight text-foreground">
              The Ultimate AI Agent Platform for Your Business
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Integrate a powerful Chatbot and Voice Agent in minutes. Boost conversions, automate support, and scale
              effortlessly with transparent pricing.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/dashboard">Get Started for Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#pricing">See Pricing</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/30">
              <Image
                src="/images/hero-ai-dashboard.jpg"
                alt="Hyper-realistic AI Agent dashboard with analytics, chatbot, and voice agent controls"
                width={1200}
                height={900}
                className="w-full h-auto"
                priority
              />
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>

            {/* Decorative glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 blur-3xl -z-10 opacity-50" />
          </div>
        </div>
      </div>
    </section>
  )
}
