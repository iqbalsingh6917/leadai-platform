'use client';

import { useRef, useEffect, useState } from 'react';
import {
  UserCheck,
  TrendingUp,
  GitBranch,
  Megaphone,
  Webhook,
  Sparkles,
  CheckCheck,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarkRead, useMarkAllRead, Notification } from '@/hooks/useNotifications';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'lead_assigned',
    title: 'Lead Assigned',
    message: 'Sarah Connor has been assigned to you.',
    isRead: false,
    userId: 'u1',
    tenantId: 't1',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'lead_scored',
    title: 'Lead Score Updated',
    message: "John Doe's score jumped to 92 — high priority!",
    isRead: false,
    userId: 'u1',
    tenantId: 't1',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'deal_stage_changed',
    title: 'Deal Stage Changed',
    message: 'Acme Corp deal moved to "Negotiation".',
    isRead: false,
    userId: 'u1',
    tenantId: 't1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'webhook_received',
    title: 'New Lead via Facebook Ads',
    message: 'A new lead was captured from your Facebook campaign.',
    isRead: true,
    userId: 'u1',
    tenantId: 't1',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'ai_insight',
    title: 'AI Insight',
    message: '3 leads in your pipeline match high-conversion patterns.',
    isRead: true,
    userId: 'u1',
    tenantId: 't1',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

function typeIcon(type: string) {
  const cls = 'w-4 h-4';
  switch (type) {
    case 'lead_assigned': return <UserCheck className={cls} />;
    case 'lead_scored': return <TrendingUp className={cls} />;
    case 'deal_stage_changed': return <GitBranch className={cls} />;
    case 'campaign_completed': return <Megaphone className={cls} />;
    case 'webhook_received': return <Webhook className={cls} />;
    case 'ai_insight': return <Sparkles className={cls} />;
    default: return <Bell className={cls} />;
  }
}

function typeColor(type: string): string {
  switch (type) {
    case 'lead_assigned': return 'bg-blue-100 text-blue-600';
    case 'lead_scored': return 'bg-emerald-100 text-emerald-600';
    case 'deal_stage_changed': return 'bg-violet-100 text-violet-600';
    case 'campaign_completed': return 'bg-orange-100 text-orange-600';
    case 'webhook_received': return 'bg-sky-100 text-sky-600';
    case 'ai_insight': return 'bg-amber-100 text-amber-600';
    default: return 'bg-slate-100 text-slate-600';
  }
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  notifications?: Notification[];
}

export function NotificationDropdown({
  open,
  onClose,
  notifications = MOCK_NOTIFICATIONS,
}: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const [items, setItems] = useState<Notification[]>(notifications);

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const displayed = items.slice(0, 10);
  const unreadCount = items.filter((n) => !n.isRead).length;

  function handleMarkRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    markRead.mutate(id);
  }

  function handleMarkAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    markAllRead.mutate();
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-50">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Bell className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          displayed.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.isRead && handleMarkRead(n.id)}
              className={cn(
                'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors',
                n.isRead
                  ? 'bg-white hover:bg-slate-50'
                  : 'bg-blue-50/40 hover:bg-blue-50',
              )}
            >
              <span
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5',
                  typeColor(n.type),
                )}
              >
                {typeIcon(n.type)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p
                    className={cn(
                      'text-sm truncate',
                      n.isRead ? 'font-normal text-slate-700' : 'font-semibold text-slate-900',
                    )}
                  >
                    {n.title}
                  </p>
                  <span className="flex-shrink-0 text-xs text-slate-400">
                    {relativeTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
              </div>
              {!n.isRead && (
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
