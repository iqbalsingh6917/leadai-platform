'use client';

import { useState } from 'react';
import { Plus, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PageSpinner } from '@/components/ui/Spinner';
import { Select } from '@/components/ui/Select';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCampaigns, useCreateCampaign } from '@/hooks/useCampaigns';
import { Campaign, CreateCampaign } from '@/types/campaign';
import toast from 'react-hot-toast';

const mockCampaigns: Campaign[] = [
  { id: '1', name: 'Spring Email Blast', type: 'email', status: 'active', budget: 50000, spent: 32000, startDate: '2026-03-01', endDate: '2026-04-30', tenantId: 't1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'WhatsApp Re-engagement', type: 'whatsapp', status: 'draft', budget: 20000, spent: 0, tenantId: 't1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'Google Ads Q2', type: 'ads', status: 'active', budget: 150000, spent: 89000, startDate: '2026-04-01', endDate: '2026-06-30', tenantId: 't1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', name: 'SMS Flash Sale', type: 'sms', status: 'completed', budget: 15000, spent: 14800, startDate: '2026-02-14', endDate: '2026-02-16', tenantId: 't1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const typeOptions = [
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'ads', label: 'Ads' },
];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function CampaignsPage() {
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading } = useCampaigns({ type: type || undefined, status: status || undefined });
  const { mutateAsync: createCampaign, isPending } = useCreateCampaign();

  const campaigns = data?.data || mockCampaigns;

  async function handleCreate(formData: CreateCampaign) {
    try {
      await createCampaign(formData);
      setShowCreateModal(false);
      toast.success('Campaign created successfully');
    } catch {
      toast.error('Failed to create campaign');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Campaigns</h2>
          <p className="text-sm text-slate-500">{campaigns.length} campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Create Campaign
        </Button>
      </div>

      <div className="flex gap-3">
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={typeOptions}
          placeholder="All Types"
          className="w-40"
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statusOptions}
          placeholder="All Statuses"
          className="w-44"
        />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-8 h-8" />}
          title="No campaigns found"
          description="Create your first campaign to start engaging leads."
          action={{ label: 'Create Campaign', onClick: () => setShowCreateModal(true) }}
        />
      ) : (
        <CampaignList campaigns={campaigns} />
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Campaign" size="md">
        <CampaignForm
          onSubmit={handleCreate}
          loading={isPending}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
}
