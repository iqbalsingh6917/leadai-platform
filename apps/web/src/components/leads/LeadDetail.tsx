'use client';

import { Lead } from '@/types/lead';
import { Badge } from '@/components/ui/Badge';
import { LeadScoreBadge } from './LeadScoreBadge';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Edit, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LeadDetailProps {
  lead: Lead;
  onEdit: () => void;
}

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  new: 'info',
  contacted: 'warning',
  qualified: 'success',
  unqualified: 'neutral',
  converted: 'success',
  lost: 'danger',
};

export function LeadDetail({ lead, onEdit }: LeadDetailProps) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/leads')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </button>
        <Button onClick={onEdit} size="sm">
          <Edit className="w-4 h-4 mr-1" />
          Edit Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{lead.firstName} {lead.lastName}</h2>
                {lead.company && <p className="text-sm text-slate-500 mt-0.5">{lead.company}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant[lead.status] || 'neutral'} className="capitalize">
                  {lead.status}
                </Badge>
                <LeadScoreBadge score={lead.score} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Email</p>
                <p className="text-sm text-slate-800">{lead.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Phone</p>
                <p className="text-sm text-slate-800">{lead.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Source</p>
                <p className="text-sm text-slate-800 capitalize">{lead.source.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Created</p>
                <p className="text-sm text-slate-800">{formatDate(lead.createdAt)}</p>
              </div>
            </div>
          </div>

          {lead.notes && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Notes</h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}

          {lead.tags && lead.tags.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag) => (
                  <Badge key={tag} variant="neutral">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Activity Timeline</h3>
          <div className="space-y-3">
            {[
              { action: 'Lead created', time: lead.createdAt },
            ].map((activity, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-700">{activity.action}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(activity.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
