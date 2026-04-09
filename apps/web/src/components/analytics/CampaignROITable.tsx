'use client';

import { CampaignAnalytics } from '@/types/analytics';
import { formatCurrency } from '@/lib/utils';

const mockData: CampaignAnalytics[] = [
  { id: '1', name: 'Spring Email Campaign', budget: 50000, spent: 42000, leadsGenerated: 85, costPerLead: 494, roi: 142 },
  { id: '2', name: 'WhatsApp Blast Q1', budget: 30000, spent: 28000, leadsGenerated: 120, costPerLead: 233, roi: 215 },
  { id: '3', name: 'Google Ads - Leads', budget: 100000, spent: 95000, leadsGenerated: 210, costPerLead: 452, roi: 88 },
  { id: '4', name: 'LinkedIn Outreach', budget: 25000, spent: 12000, leadsGenerated: 32, costPerLead: 375, roi: 167 },
];

interface CampaignROITableProps {
  data?: CampaignAnalytics[];
}

export function CampaignROITable({ data = mockData }: CampaignROITableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-200">
            {['Campaign', 'Budget', 'Spent', 'Leads', 'Cost/Lead', 'ROI %'].map((h) => (
              <th key={h} className="py-2 px-3 text-left text-xs font-semibold text-slate-500 uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-3 text-sm font-medium text-slate-900">{row.name}</td>
              <td className="py-3 px-3 text-sm text-slate-600">{formatCurrency(row.budget)}</td>
              <td className="py-3 px-3 text-sm text-slate-600">{formatCurrency(row.spent)}</td>
              <td className="py-3 px-3 text-sm text-slate-600">{row.leadsGenerated}</td>
              <td className="py-3 px-3 text-sm text-slate-600">{formatCurrency(row.costPerLead)}</td>
              <td className="py-3 px-3">
                <span className={`text-sm font-semibold ${row.roi >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {row.roi}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
