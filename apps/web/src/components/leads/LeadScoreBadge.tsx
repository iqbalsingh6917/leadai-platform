'use client';

import { cn } from '@/lib/utils';

interface LeadScoreBadgeProps {
  score: number;
}

export function LeadScoreBadge({ score }: LeadScoreBadgeProps) {
  const color =
    score >= 61
      ? 'bg-emerald-100 text-emerald-700'
      : score >= 31
      ? 'bg-amber-100 text-amber-700'
      : 'bg-rose-100 text-rose-700';

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold', color)}>
      {score}
    </span>
  );
}
