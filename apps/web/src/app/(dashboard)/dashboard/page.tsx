'use client';

import Link from 'next/link';
import { Users, TrendingUp, Target, DollarSign } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LeadsChart } from '@/components/dashboard/LeadsChart';
import { LeadsBySourceChart } from '@/components/dashboard/LeadsBySourceChart';
import { RecentLeads } from '@/components/dashboard/RecentLeads';
import { PipelineOverview } from '@/components/dashboard/PipelineOverview';
import { Card } from '@/components/ui/Card';
import { PageSpinner } from '@/components/ui/Spinner';
import { useDashboardStats } from '@/hooks/useAnalytics';
import { formatCurrency } from '@/lib/utils';

// Mock stats for when API isn't connected
const mockStats = {
  totalLeads: 284,
  totalLeadsChange: 12.5,
  qualifiedLeads: 68,
  qualifiedLeadsChange: 8.3,
  conversionRate: 23.9,
  conversionRateChange: -2.1,
  pipelineValue: 5400000,
  pipelineValueChange: 18.7,
};

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const displayStats = stats || mockStats;

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Leads"
          value={displayStats.totalLeads}
          change={displayStats.totalLeadsChange}
          icon={<Users className="w-6 h-6" />}
          color="indigo"
        />
        <StatsCard
          title="Qualified Leads"
          value={displayStats.qualifiedLeads}
          change={displayStats.qualifiedLeadsChange}
          icon={<Target className="w-6 h-6" />}
          color="emerald"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${displayStats.conversionRate}%`}
          change={displayStats.conversionRateChange}
          icon={<TrendingUp className="w-6 h-6" />}
          color="amber"
        />
        <StatsCard
          title="Pipeline Value"
          value={formatCurrency(displayStats.pipelineValue)}
          change={displayStats.pipelineValueChange}
          icon={<DollarSign className="w-6 h-6" />}
          color="rose"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" padding={false}>
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Leads Over Time</h3>
            <p className="text-xs text-slate-400 mt-0.5">Last 30 days</p>
          </div>
          <div className="p-6">
            <LeadsChart />
          </div>
        </Card>

        <Card padding={false}>
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Leads by Source</h3>
          </div>
          <div className="p-6">
            <LeadsBySourceChart />
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" padding={false}>
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Recent Leads</h3>
            <Link href="/leads" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
            View all
          </Link>
          </div>
          <div className="p-6">
            <RecentLeads />
          </div>
        </Card>

        <Card padding={false}>
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Pipeline Overview</h3>
          </div>
          <div className="p-6">
            <PipelineOverview />
          </div>
        </Card>
      </div>
    </div>
  );
}
