'use client';

import { Campaign, CampaignType } from '@/types/campaign';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Mail, MessageSquare, Phone, TrendingUp } from 'lucide-react';

const typeIcons: Record<CampaignType, React.ReactNode> = {
  email: <Mail className="w-4 h-4" />,
  whatsapp: <MessageSquare className="w-4 h-4" />,
  sms: <Phone className="w-4 h-4" />,
  ads: <TrendingUp className="w-4 h-4" />,
};

const typeColors: Record<CampaignType, string> = {
  email: 'bg-blue-100 text-blue-600',
  whatsapp: 'bg-emerald-100 text-emerald-600',
  sms: 'bg-amber-100 text-amber-600',
  ads: 'bg-purple-100 text-purple-600',
};

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  active: 'success',
  draft: 'neutral',
  paused: 'warning',
  completed: 'info',
  cancelled: 'danger',
};

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
}

export function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  const spentPercent = campaign.budget && campaign.spent
    ? Math.min(100, (campaign.spent / campaign.budget) * 100)
    : 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[campaign.type]}`}>
            {typeIcons[campaign.type]}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{campaign.name}</h3>
            <p className="text-xs text-slate-400 capitalize">{campaign.type}</p>
          </div>
        </div>
        <Badge variant={statusVariant[campaign.status] || 'neutral'} className="capitalize">
          {campaign.status}
        </Badge>
      </div>

      {campaign.budget && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Budget</span>
            <span>{formatCurrency(campaign.spent || 0)} / {formatCurrency(campaign.budget)}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${spentPercent}%` }}
            />
          </div>
        </div>
      )}

      {(campaign.startDate || campaign.endDate) && (
        <div className="text-xs text-slate-400">
          {campaign.startDate && formatDate(campaign.startDate)}
          {campaign.startDate && campaign.endDate && ' → '}
          {campaign.endDate && formatDate(campaign.endDate)}
        </div>
      )}
    </div>
  );
}
