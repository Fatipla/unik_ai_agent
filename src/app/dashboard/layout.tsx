import {
  Bot,
  BrainCircuit,
  CreditCard,
  Download,
  LayoutDashboard,
  Phone,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarFooter
} from '@/components/ui/sidebar';
import { UserNav } from '@/components/dashboard/user-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/chatbot', label: 'Chatbot', icon: Bot },
    { href: '/dashboard/voice', label: 'Voice Agent', icon: Phone },
    { href: '/dashboard/training', label: 'Training', icon: BrainCircuit },
  ];
  
  const settingsItems = [
    { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/install', label: 'Installation', icon: Download },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 text-primary-foreground">
            <Logo className="w-7 h-7" />
            <span className="font-headline text-lg font-semibold">Unik AI</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarSeparator />
          <SidebarMenu>
            {settingsItems.map((item) => (
               <SidebarMenuItem key={item.href}>
               <SidebarMenuButton asChild>
                 <Link href={item.href}>
                   <item.icon />
                   <span>{item.label}</span>
                 </Link>
               </SidebarMenuButton>
             </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
