'use client';

import { formatCurrency } from '@/lib/utils';

const stages = [
  { name: 'Prospecting', deals: 12, value: 450000, color: 'bg-indigo-500' },
  { name: 'Qualification', deals: 8, value: 680000, color: 'bg-blue-500' },
  { name: 'Proposal', deals: 5, value: 920000, color: 'bg-amber-500' },
  { name: 'Negotiation', deals: 3, value: 1250000, color: 'bg-orange-500' },
  { name: 'Closed Won', deals: 7, value: 2100000, color: 'bg-emerald-500' },
];

const maxValue = Math.max(...stages.map((s) => s.value));

export function PipelineOverview() {
  return (
    <div className="space-y-3">
      {stages.map((stage) => (
        <div key={stage.name}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-slate-700">{stage.name}</span>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{stage.deals} deals</span>
              <span className="font-medium text-slate-700">{formatCurrency(stage.value)}</span>
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${stage.color}`}
              style={{ width: `${(stage.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
