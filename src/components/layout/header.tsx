'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut } from 'lucide-react';
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/#installation", label: "Installation" },
    { href: "/contact", label: "Contact" },
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
          <ThemeToggle />
          {!isAuthenticated ? (
            <>
              <Button variant="link" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
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
                     {!isAuthenticated ? (
                       <>
                         <Button variant="link" asChild className="justify-start px-0">
                            <Link href="/login">Log In</Link>
                         </Button>
                         <Button asChild>
                            <Link href="/signup">Sign Up</Link>
                          </Button>
                       </>
                     ) : (
                       <>
                         <Button variant="outline" asChild>
                            <Link href="/dashboard">Dashboard</Link>
                         </Button>
                         <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
                           <LogOut className="mr-2 h-4 w-4" />
                           Logout
                         </Button>
                       </>
                     )}
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
