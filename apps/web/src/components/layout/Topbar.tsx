'use client';

import { useState } from 'react';
import { Bell, LogOut, User, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: unreadCount = 0 } = useUnreadCount();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const dropdownItems = [
    {
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      onClick: () => router.push('/settings'),
    },
    {
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => router.push('/settings'),
    },
    {
      label: 'Logout',
      icon: <LogOut className="w-4 h-4" />,
      onClick: handleLogout,
      divider: true,
      danger: true,
    },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
          />
        </div>
        {user && (
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors">
                <Avatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  size="sm"
                />
                <span className="text-sm font-medium text-slate-700 hidden md:block">
                  {user.firstName}
                </span>
              </button>
            }
            items={dropdownItems}
          />
        )}
      </div>
    </header>
  );
}

