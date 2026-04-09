'use client';

import { Campaign } from '@/types/campaign';
import { CampaignCard } from './CampaignCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Megaphone } from 'lucide-react';

interface CampaignListProps {
  campaigns: Campaign[];
  onCampaignClick?: (campaign: Campaign) => void;
}

export function CampaignList({ campaigns, onCampaignClick }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={<Megaphone className="w-8 h-8" />}
        title="No campaigns yet"
        description="Create your first campaign to start reaching out to leads."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onClick={() => onCampaignClick?.(campaign)}
        />
      ))}
    </div>
  );
}
