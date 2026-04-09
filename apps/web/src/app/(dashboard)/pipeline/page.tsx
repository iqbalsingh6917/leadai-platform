'use client';

import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { PipelineBoard } from '@/components/pipeline/PipelineBoard';
import { usePipelines } from '@/hooks/usePipelines';
import { GitBranch } from 'lucide-react';
import { PipelineStage } from '@/types/pipeline';

// Mock pipeline data for when API isn't connected
const mockStages: PipelineStage[] = [
  {
    id: 's1', name: 'Prospecting', order: 1, pipelineId: 'p1',
    deals: [
      { id: 'd1', title: 'Infosys CRM Deal', value: 450000, contactName: 'Arjun Sharma', stageId: 's1', expectedCloseDate: '2026-05-30T00:00:00Z', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
      { id: 'd2', title: 'Wipro Enterprise', value: 280000, contactName: 'Priya Patel', stageId: 's1', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
    ],
    createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 's2', name: 'Qualification', order: 2, pipelineId: 'p1',
    deals: [
      { id: 'd3', title: 'TCS Digital Transformation', value: 920000, contactName: 'Rahul Gupta', stageId: 's2', expectedCloseDate: '2026-06-15T00:00:00Z', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
    ],
    createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 's3', name: 'Proposal', order: 3, pipelineId: 'p1',
    deals: [
      { id: 'd4', title: 'HCL AI Platform', value: 750000, stageId: 's3', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
      { id: 'd5', title: 'Reliance Retail CRM', value: 1200000, contactName: 'Vikram Singh', stageId: 's3', expectedCloseDate: '2026-05-01T00:00:00Z', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
    ],
    createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 's4', name: 'Negotiation', order: 4, pipelineId: 'p1',
    deals: [
      { id: 'd6', title: 'HDFC Bank Leads', value: 2100000, contactName: 'Sunita Kumar', stageId: 's4', expectedCloseDate: '2026-04-20T00:00:00Z', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
    ],
    createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 's5', name: 'Closed Won', order: 5, pipelineId: 'p1',
    deals: [
      { id: 'd7', title: 'Zomato Growth Pack', value: 350000, stageId: 's5', tenantId: 't1', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
    ],
    createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z',
  },
];

export default function PipelinePage() {
  const { data: pipelines, isLoading } = usePipelines();

  const stages = pipelines?.[0]?.stages || mockStages;

  if (isLoading) return <PageSpinner />;

  if (!stages || stages.length === 0) {
    return (
      <EmptyState
        icon={<GitBranch className="w-8 h-8" />}
        title="No pipeline configured"
        description="Set up your sales pipeline stages to get started."
      />
    );
  }

  return (
    <div className="h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Sales Pipeline</h2>
        <p className="text-sm text-slate-500">Drag and drop deals between stages</p>
      </div>
      <PipelineBoard stages={stages} />
    </div>
  );
}
