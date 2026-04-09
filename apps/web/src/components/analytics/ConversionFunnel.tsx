'use client';

const stages = [
  { name: 'New Leads', count: 150, color: 'bg-indigo-500' },
  { name: 'Contacted', count: 98, color: 'bg-blue-500' },
  { name: 'Qualified', count: 62, color: 'bg-amber-500' },
  { name: 'Proposal', count: 38, color: 'bg-orange-500' },
  { name: 'Won', count: 22, color: 'bg-emerald-500' },
];

interface ConversionFunnelProps {
  data?: { name: string; count: number }[];
}

export function ConversionFunnel({ data = stages }: ConversionFunnelProps) {
  const maxCount = data[0]?.count || 1;

  return (
    <div className="space-y-3">
      {data.map((stage, i) => {
        const width = (stage.count / maxCount) * 100;
        const stageColor = stages[i]?.color || 'bg-indigo-500';
        return (
          <div key={stage.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-700">{stage.name}</span>
              <span className="text-sm font-semibold text-slate-900">{stage.count}</span>
            </div>
            <div className="h-6 bg-slate-100 rounded-md overflow-hidden">
              <div
                className={`h-full flex items-center justify-end pr-2 rounded-md ${stageColor}`}
                style={{ width: `${width}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {i === 0 ? '100%' : `${Math.round((stage.count / maxCount) * 100)}%`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
