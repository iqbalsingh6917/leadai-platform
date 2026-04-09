'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { LeadsOverTimeChart } from '@/components/analytics/LeadsOverTimeChart';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';
import { SourceBreakdown } from '@/components/analytics/SourceBreakdown';
import { CampaignROITable } from '@/components/analytics/CampaignROITable';
import { Input } from '@/components/ui/Input';

export default function AnalyticsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex items-center gap-4 bg-white rounded-lg border border-slate-200 p-4">
        <span className="text-sm font-medium text-slate-700">Date Range:</span>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-40"
          />
          <span className="text-slate-400">to</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Leads Over Time</h3>
          </div>
          <div className="p-6">
            <LeadsOverTimeChart />
          </div>
        </Card>

        <Card padding={false}>
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Conversion Funnel</h3>
          </div>
          <div className="p-6">
            <ConversionFunnel />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Lead Source Breakdown</h3>
          </div>
          <div className="p-6">
            <SourceBreakdown />
          </div>
        </Card>

        <Card padding={false}>
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Campaign ROI</h3>
          </div>
          <div className="p-6">
            <CampaignROITable />
          </div>
        </Card>
      </div>
    </div>
  );
}
