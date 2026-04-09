'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose';
}

const colorClasses = {
  indigo: 'bg-indigo-100 text-indigo-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
};

export function StatsCard({ title, value, change, icon, color = 'indigo' }: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 mt-1 text-xs font-medium', isPositive ? 'text-emerald-600' : 'text-rose-600')}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{Math.abs(change).toFixed(1)}% from last month</span>
            </div>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colorClasses[color])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
