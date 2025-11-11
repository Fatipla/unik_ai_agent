import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#install", label: "Installation" },
  ];

  return (
    <header className={cn("w-full", className)}>
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
             <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline text-foreground">
              Unik AI Agent
            </span>
          </Link>
        </div>

        <nav className="hidden items-center justify-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors text-foreground/60 hover:text-foreground/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center space-x-2 md:flex">
          <Button variant="link" asChild>
            <Link href="/dashboard">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="flex items-center space-x-2">
                 <Logo className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">Unik AI Agent</span>
              </Link>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-foreground">
                      {link.label}
                    </Link>
                  ))}
                   <div className="flex flex-col space-y-2 pt-4">
                     <Button variant="link" asChild className="justify-start px-0">
                        <Link href="/dashboard">Log In</Link>
                     </Button>
                     <Button asChild>
                        <Link href="/dashboard">Sign Up</Link>
                      </Button>
                   </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
