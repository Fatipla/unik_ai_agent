import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { InstallationGuide } from "@/components/landing/installation-guide";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <section id="features">
          <Features />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <section id="installation">
          <InstallationGuide />
        </section>
      </main>
      <Footer />
    </div>
  );
}
