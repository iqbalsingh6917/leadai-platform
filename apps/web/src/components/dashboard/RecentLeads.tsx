'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Lead } from '@/types/lead';

const mockLeads: Lead[] = [
  { id: '1', firstName: 'Arjun', lastName: 'Sharma', email: 'arjun@example.com', source: 'website', status: 'new', score: 85, tags: [], tenantId: 't1', createdAt: '2026-04-05T10:00:00Z', updatedAt: '2026-04-05T10:00:00Z' },
  { id: '2', firstName: 'Priya', lastName: 'Patel', email: 'priya@example.com', source: 'referral', status: 'qualified', score: 72, tags: [], tenantId: 't1', createdAt: '2026-04-04T09:00:00Z', updatedAt: '2026-04-04T09:00:00Z' },
  { id: '3', firstName: 'Rahul', lastName: 'Gupta', email: 'rahul@example.com', source: 'social_media', status: 'contacted', score: 45, tags: [], tenantId: 't1', createdAt: '2026-04-03T08:00:00Z', updatedAt: '2026-04-03T08:00:00Z' },
  { id: '4', firstName: 'Sunita', lastName: 'Kumar', email: 'sunita@example.com', source: 'email', status: 'new', score: 60, tags: [], tenantId: 't1', createdAt: '2026-04-02T07:00:00Z', updatedAt: '2026-04-02T07:00:00Z' },
  { id: '5', firstName: 'Vikram', lastName: 'Singh', email: 'vikram@example.com', source: 'advertisement', status: 'qualified', score: 91, tags: [], tenantId: 't1', createdAt: '2026-04-01T06:00:00Z', updatedAt: '2026-04-01T06:00:00Z' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
  new: 'info',
  contacted: 'warning',
  qualified: 'success',
  unqualified: 'neutral',
  converted: 'success',
  lost: 'neutral',
};

interface RecentLeadsProps {
  leads?: Lead[];
}

export function RecentLeads({ leads = mockLeads }: RecentLeadsProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Name</th>
            <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Source</th>
            <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Status</th>
            <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Score</th>
            <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50/50">
              <td className="py-2.5">
                <Link href={`/leads/${lead.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                  {lead.firstName} {lead.lastName}
                </Link>
              </td>
              <td className="py-2.5 text-sm text-slate-600 capitalize">{lead.source.replace('_', ' ')}</td>
              <td className="py-2.5">
                <Badge variant={statusVariant[lead.status] || 'neutral'} className="capitalize">
                  {lead.status}
                </Badge>
              </td>
              <td className="py-2.5">
                <span className={`text-sm font-semibold ${lead.score >= 61 ? 'text-emerald-600' : lead.score >= 31 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {lead.score}
                </span>
              </td>
              <td className="py-2.5 text-sm text-slate-500">{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
