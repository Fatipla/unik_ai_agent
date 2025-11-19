import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl w-full px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Top section with logo and links */}
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary" />
                <span className="font-semibold text-lg">Unik AI Agent</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                AI-powered chatbot and voice agent platform for businesses.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Product</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                  <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                  <li><Link href="/refunds" className="hover:text-foreground">Refund Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bottom section with company info */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <div className="text-center md:text-left">
                <p className="font-medium text-foreground">Unik Trading LLC</p>
                <p>28 Nëntori, nr 76/1, Prishtina, Kosovo</p>
                <p><a href="mailto:support@unik-ks.com" className="hover:text-foreground">support@unik-ks.com</a></p>
              </div>
              <p>© {new Date().getFullYear()} Unik Trading LLC. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
