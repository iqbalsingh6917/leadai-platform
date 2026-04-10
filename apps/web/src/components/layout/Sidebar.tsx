'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Contact,
  Megaphone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  UsersRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/leads', icon: Users, label: 'Leads' },
  { href: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { href: '/contacts', icon: Contact, label: 'Contacts' },
  { href: '/campaigns', icon: Megaphone, label: 'Campaigns' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/team', icon: UsersRound, label: 'Team' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-slate-900 text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 border-b border-slate-700/50 px-4', collapsed ? 'justify-center' : 'gap-3')}>
        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold text-white">LeadAI</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                collapsed ? 'justify-center' : ''
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-5 h-5')} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Toggle */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={onToggle}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200',
            collapsed ? 'justify-center' : ''
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
