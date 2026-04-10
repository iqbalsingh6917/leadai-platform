'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Zap, Play, ToggleLeft, ToggleRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';
import { Workflow, WorkflowTrigger } from '@/types/ai';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const mockWorkflows: Workflow[] = [
  {
    id: '1', tenantId: 't1', name: 'New Lead Auto-Score', trigger: 'lead_created', isActive: true,
    definition: { steps: [{ id: 's1', type: 'ai_score_lead', label: 'AI Score Lead', config: {} }] },
    runCount: 42, lastRunAt: '2026-04-10T09:00:00Z', createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-04-10T00:00:00Z',
  },
  {
    id: '2', tenantId: 't1', name: 'Follow-up Sequence', trigger: 'lead_updated', isActive: true,
    definition: { steps: [{ id: 's1', type: 'send_email', label: 'Send Email', config: {} }, { id: 's2', type: 'wait', label: 'Wait 2 days', config: { days: 2 } }] },
    runCount: 18, lastRunAt: '2026-04-09T14:30:00Z', createdAt: '2026-03-05T00:00:00Z', updatedAt: '2026-04-09T00:00:00Z',
  },
  {
    id: '3', tenantId: 't1', name: 'Deal Stage Notification', trigger: 'deal_stage_changed', isActive: false,
    definition: { steps: [{ id: 's1', type: 'send_whatsapp', label: 'Send WhatsApp', config: {} }] },
    runCount: 5, lastRunAt: null, createdAt: '2026-03-10T00:00:00Z', updatedAt: '2026-03-10T00:00:00Z',
  },
];

const TRIGGER_LABELS: Record<WorkflowTrigger, string> = {
  lead_created: 'Lead Created',
  lead_updated: 'Lead Updated',
  deal_stage_changed: 'Deal Stage Changed',
  manual: 'Manual',
};

const TRIGGER_COLORS: Record<WorkflowTrigger, string> = {
  lead_created: 'bg-green-100 text-green-700',
  lead_updated: 'bg-blue-100 text-blue-700',
  deal_stage_changed: 'bg-purple-100 text-purple-700',
  manual: 'bg-slate-100 text-slate-700',
};

function useWorkflows() {
  return useQuery<Workflow[]>({
    queryKey: ['workflows'],
    queryFn: async () => {
      const res = await api.get('/workflows');
      return res.data;
    },
  });
}

function useToggleWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await api.patch(`/workflows/${id}`, { isActive });
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workflows'] }),
  });
}

export default function WorkflowsPage() {
  const router = useRouter();
  const { data, isLoading } = useWorkflows();
  const { mutateAsync: toggle } = useToggleWorkflow();

  const workflows = data ?? mockWorkflows;

  async function handleToggle(wf: Workflow) {
    try {
      await toggle({ id: wf.id, isActive: !wf.isActive });
      toast.success(`Workflow ${!wf.isActive ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update workflow');
    }
  }

  function handleNewWorkflow() {
    router.push('/workflows/new');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Workflows</h2>
          <p className="text-sm text-slate-500">{workflows.length} automation workflows</p>
        </div>
        <button
          onClick={handleNewWorkflow}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Workflow
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      <div className="grid gap-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{wf.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TRIGGER_COLORS[wf.trigger]}`}>
                      {TRIGGER_LABELS[wf.trigger]}
                    </span>
                    {wf.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {wf.runCount ?? 0} runs
                    </span>
                    {wf.lastRunAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last run {new Date(wf.lastRunAt).toLocaleDateString()}
                      </span>
                    )}
                    <span>{wf.definition?.steps?.length ?? 0} steps</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(wf)}
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                  title={wf.isActive ? 'Deactivate' : 'Activate'}
                >
                  {wf.isActive ? (
                    <ToggleRight className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                </button>
                <button
                  onClick={() => router.push(`/workflows/${wf.id}`)}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && workflows.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">No workflows yet</h3>
            <p className="text-sm text-slate-500 mb-4">Automate your sales process with smart workflows.</p>
            <button
              onClick={handleNewWorkflow}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create first workflow
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
