'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { MessageSquare, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { DripCampaignForm } from '@/components/whatsapp-drip/DripCampaignForm';
import {
  useWhatsAppDripCampaigns,
  useCreateDripCampaign,
  useUpdateDripCampaign,
  useDeleteDripCampaign,
} from '@/hooks/useWhatsAppDrip';
import { WhatsAppDripCampaign, CreateDripCampaign } from '@/types/whatsapp-drip';

const MOCK_CAMPAIGNS: WhatsAppDripCampaign[] = [
  {
    id: 'mock-1',
    name: 'New Lead Welcome',
    description: 'Onboarding sequence for fresh leads',
    trigger: 'lead_created',
    status: 'active',
    steps: [
      { stepOrder: 0, delayDays: 0, messageType: 'text', body: 'Hi! Welcome to LeadAI 👋' },
      { stepOrder: 1, delayDays: 2, messageType: 'text', body: 'Have you had a chance to explore our platform?' },
    ],
    tenantId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    name: 'Re-engagement',
    description: 'Reach out to inactive leads',
    trigger: 'manual',
    status: 'draft',
    steps: [
      { stepOrder: 0, delayDays: 0, messageType: 'text', body: "We haven't heard from you in a while!" },
    ],
    tenantId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function triggerLabel(trigger: string) {
  if (trigger === 'lead_created') return 'Lead Created';
  if (trigger === 'lead_status_changed') return 'Status Changed';
  return 'Manual';
}

function statusVariant(status: string) {
  if (status === 'active') return 'success' as const;
  if (status === 'paused') return 'warning' as const;
  if (status === 'archived') return 'neutral' as const;
  return 'info' as const;
}

export default function WhatsAppDripPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [editCampaign, setEditCampaign] = useState<WhatsAppDripCampaign | null>(null);

  const { data, isLoading } = useWhatsAppDripCampaigns();
  const createCampaign = useCreateDripCampaign();
  const updateCampaign = useUpdateDripCampaign();
  const deleteCampaign = useDeleteDripCampaign();

  const campaigns: WhatsAppDripCampaign[] =
    data?.data?.length ? data.data : isLoading ? [] : MOCK_CAMPAIGNS;

  const handleCreate = async (dto: CreateDripCampaign) => {
    try {
      await createCampaign.mutateAsync(dto);
      toast.success('Campaign created');
      setShowCreate(false);
    } catch {
      toast.error('Failed to create campaign');
    }
  };

  const handleUpdate = async (dto: CreateDripCampaign) => {
    if (!editCampaign) return;
    try {
      await updateCampaign.mutateAsync({ id: editCampaign.id, data: dto });
      toast.success('Campaign updated');
      setEditCampaign(null);
    } catch {
      toast.error('Failed to update campaign');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete campaign "${name}"?`)) return;
    try {
      await deleteCampaign.mutateAsync(id);
      toast.success('Campaign deleted');
    } catch {
      toast.error('Failed to delete campaign');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">WhatsApp Drip Campaigns</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </div>

      {/* Campaign list */}
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : campaigns.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <MessageSquare className="w-10 h-10" />
            <p className="text-sm">No drip campaigns yet. Create your first one!</p>
            <Button variant="outline" onClick={() => setShowCreate(true)}>
              New Campaign
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-slate-900 text-sm">{campaign.name}</h2>
                    <Badge variant={statusVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <Badge variant="info">{triggerLabel(campaign.trigger)}</Badge>
                    <Badge variant="neutral">
                      {campaign.steps?.length ?? 0} step{(campaign.steps?.length ?? 0) !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  {campaign.description && (
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {campaign.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditCampaign(campaign)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(campaign.id, campaign.name)}
                    loading={deleteCampaign.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Drip Campaign"
        size="lg"
      >
        <DripCampaignForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={createCampaign.isPending}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editCampaign}
        onClose={() => setEditCampaign(null)}
        title="Edit Drip Campaign"
        size="lg"
      >
        {editCampaign && (
          <DripCampaignForm
            initial={editCampaign}
            onSubmit={handleUpdate}
            onCancel={() => setEditCampaign(null)}
            loading={updateCampaign.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
