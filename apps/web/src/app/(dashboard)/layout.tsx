'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/pipeline': 'Pipeline',
  '/contacts': 'Contacts',
  '/campaigns': 'Campaigns',
  '/email-templates': 'Email Templates',
  '/email-sequences': 'Email Sequences',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/billing': 'Billing',
};

function getTitle(pathname: string): string {
  // Try exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];
  // Try prefix match
  const prefix = Object.keys(pageTitles).find((k) => pathname.startsWith(k + '/'));
  return prefix ? pageTitles[prefix] : 'LeadAI';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <OnboardingWizard />
    </div>
  );
}
