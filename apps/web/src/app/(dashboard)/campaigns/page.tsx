'use client';

import { useState } from 'react';
import { Plus, Megaphone, Brain, TrendingUp, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PageSpinner } from '@/components/ui/Spinner';
import { Select } from '@/components/ui/Select';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCampaigns, useCreateCampaign } from '@/hooks/useCampaigns';
import { Campaign, CreateCampaign } from '@/types/campaign';
import { BudgetOptimizeResult } from '@/types/ai';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const mockCampaigns: Campaign[] = [
  { id: '1', name: 'Spring Email Blast', type: 'email', status: 'active', budget: 50000, spent: 32000, startDate: '2026-03-01', endDate: '2026-04-30', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '2', name: 'WhatsApp Re-engagement', type: 'whatsapp', status: 'draft', budget: 20000, spent: 0, tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '3', name: 'Google Ads Q2', type: 'ads', status: 'active', budget: 150000, spent: 89000, startDate: '2026-04-01', endDate: '2026-06-30', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '4', name: 'SMS Flash Sale', type: 'sms', status: 'completed', budget: 15000, spent: 14800, startDate: '2026-02-14', endDate: '2026-02-16', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
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

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function BudgetOptimizerModal({
  campaigns,
  onClose,
}: {
  campaigns: Campaign[];
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BudgetOptimizeResult | null>(null);

  async function runOptimizer() {
    setLoading(true);
    try {
      const payload = {
        campaigns: campaigns.map((c) => ({
          id: c.id,
          name: c.name,
          spend: c.spent ?? 0,
          leads: Math.floor(Math.random() * 100) + 10,
          conversions: Math.floor(Math.random() * 20) + 1,
        })),
      };
      const res = await api.post<BudgetOptimizeResult>('/campaigns/ai-optimize', payload);
      setResult(res.data);
    } catch {
      toast.error('AI optimization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {!result && !loading && (
        <div className="text-center py-6">
          <Brain className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600 mb-4">
            AI will analyze your campaign performance and suggest budget reallocations to maximize conversions.
          </p>
          <button
            onClick={runOptimizer}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Brain className="w-4 h-4" />
            Analyze & Optimize
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center py-10 gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Analyzing campaign performance...</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="text-sm text-slate-600">Total Budget</div>
            <div className="font-semibold text-slate-900">{formatCurrency(result.totalBudget)}</div>
          </div>
          {result.projectedImprovement !== 0 && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100 text-sm text-green-700">
              <TrendingUp className="w-4 h-4 flex-shrink-0" />
              Projected improvement: {result.projectedImprovement > 0 ? '+' : ''}{result.projectedImprovement.toFixed(1)}%
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase">Campaign</th>
                  <th className="text-right py-2 pr-4 text-xs font-semibold text-slate-500 uppercase">Current</th>
                  <th className="text-center py-2 pr-4 text-xs font-semibold text-slate-500"></th>
                  <th className="text-right py-2 pr-4 text-xs font-semibold text-slate-500 uppercase">Suggested</th>
                  <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {result.recommendations.map((rec) => {
                  const diff = rec.suggestedSpend - rec.currentSpend;
                  const isIncrease = diff > 0;
                  return (
                    <tr key={rec.campaignId} className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-slate-800">{rec.campaignName}</td>
                      <td className="py-3 pr-4 text-right text-slate-600">{formatCurrency(rec.currentSpend)}</td>
                      <td className="py-3 pr-4 text-center">
                        <ArrowRight className="w-3 h-3 text-slate-400 mx-auto" />
                      </td>
                      <td className={`py-3 pr-4 text-right font-semibold ${isIncrease ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                        {formatCurrency(rec.suggestedSpend)}
                        {diff !== 0 && (
                          <span className="ml-1 text-xs font-normal">
                            ({isIncrease ? '+' : ''}{formatCurrency(diff)})
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-500 text-xs max-w-xs">{rec.rationale}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={runOptimizer}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <Brain className="w-3.5 h-3.5" />
              Re-analyze
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CampaignsPage() {
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOptimizerModal, setShowOptimizerModal] = useState(false);

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
        <div className="flex gap-2">
          <button
            onClick={() => setShowOptimizerModal(true)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Brain className="w-4 h-4" />
            AI Budget Optimizer
          </button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Create Campaign
          </Button>
        </div>
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

      <Modal
        isOpen={showOptimizerModal}
        onClose={() => setShowOptimizerModal(false)}
        title="AI Budget Optimizer"
        size="lg"
      >
        <BudgetOptimizerModal campaigns={campaigns} onClose={() => setShowOptimizerModal(false)} />
      </Modal>
    </div>
  );
}

const mockCampaigns: Campaign[] = [
  { id: '1', name: 'Spring Email Blast', type: 'email', status: 'active', budget: 50000, spent: 32000, startDate: '2026-03-01', endDate: '2026-04-30', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '2', name: 'WhatsApp Re-engagement', type: 'whatsapp', status: 'draft', budget: 20000, spent: 0, tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '3', name: 'Google Ads Q2', type: 'ads', status: 'active', budget: 150000, spent: 89000, startDate: '2026-04-01', endDate: '2026-06-30', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: '4', name: 'SMS Flash Sale', type: 'sms', status: 'completed', budget: 15000, spent: 14800, startDate: '2026-02-14', endDate: '2026-02-16', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
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
