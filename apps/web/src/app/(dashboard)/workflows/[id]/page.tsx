'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Trash2, Save, Zap, Mail, MessageSquare, UserCheck,
  Brain, Tag, Users, Clock, ChevronDown,
} from 'lucide-react';
import api from '@/lib/api';
import { Workflow, WorkflowStep, WorkflowTrigger, WorkflowDefinition } from '@/types/ai';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const TRIGGERS: { value: WorkflowTrigger; label: string; description: string }[] = [
  { value: 'lead_created', label: 'Lead Created', description: 'Fires when a new lead is added' },
  { value: 'lead_updated', label: 'Lead Updated', description: 'Fires when a lead is modified' },
  { value: 'deal_stage_changed', label: 'Deal Stage Changed', description: 'Fires when deal moves to next stage' },
  { value: 'manual', label: 'Manual', description: 'Triggered manually by a team member' },
];

const STEP_TYPES: { type: WorkflowStep['type']; label: string; icon: any; color: string; description: string }[] = [
  { type: 'send_email', label: 'Send Email', icon: Mail, color: 'bg-blue-50 text-blue-600 border-blue-200', description: 'Send an email to the lead' },
  { type: 'send_whatsapp', label: 'Send WhatsApp', icon: MessageSquare, color: 'bg-green-50 text-green-600 border-green-200', description: 'Send a WhatsApp message' },
  { type: 'update_lead_status', label: 'Update Lead Status', icon: UserCheck, color: 'bg-purple-50 text-purple-600 border-purple-200', description: 'Change the lead status' },
  { type: 'ai_score_lead', label: 'AI Score Lead', icon: Brain, color: 'bg-indigo-50 text-indigo-600 border-indigo-200', description: 'Run AI scoring on the lead' },
  { type: 'add_tag', label: 'Add Tag', icon: Tag, color: 'bg-orange-50 text-orange-600 border-orange-200', description: 'Add a tag to the lead' },
  { type: 'assign_team_member', label: 'Assign to Team Member', icon: Users, color: 'bg-pink-50 text-pink-600 border-pink-200', description: 'Assign the lead to a team member' },
  { type: 'wait', label: 'Wait (Delay)', icon: Clock, color: 'bg-slate-50 text-slate-600 border-slate-200', description: 'Wait for a specified time before next step' },
];

const DEFAULT_WORKFLOW: Workflow = {
  id: 'new',
  tenantId: '',
  name: 'New Workflow',
  description: '',
  trigger: 'manual',
  isActive: false,
  definition: { steps: [] },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function useWorkflow(id: string) {
  return useQuery<Workflow>({
    queryKey: ['workflow', id],
    queryFn: async () => {
      if (id === 'new') return DEFAULT_WORKFLOW;
      const res = await api.get(`/workflows/${id}`);
      return res.data;
    },
    retry: false,
  });
}

function generateStepId() {
  return `step_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function WorkflowBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const isNew = id === 'new';

  const { data: remote, isLoading } = useWorkflow(id);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState<WorkflowTrigger>('manual');
  const [isActive, setIsActive] = useState(false);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [showStepPicker, setShowStepPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  if (remote && !initialized) {
    setName(remote.name);
    setDescription(remote.description ?? '');
    setTrigger(remote.trigger);
    setIsActive(remote.isActive);
    setSteps(remote.definition?.steps ?? []);
    setInitialized(true);
  }

  const addStep = useCallback((type: WorkflowStep['type']) => {
    const stepType = STEP_TYPES.find((s) => s.type === type);
    const newStep: WorkflowStep = {
      id: generateStepId(),
      type,
      label: stepType?.label ?? type,
      config: type === 'wait' ? { days: 1 } : {},
    };
    setSteps((prev) => [...prev, newStep]);
    setShowStepPicker(false);
  }, []);

  const removeStep = useCallback((stepId: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== stepId));
  }, []);

  const updateStep = useCallback((stepId: string, updates: Partial<WorkflowStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, ...updates } : s)));
  }, []);

  async function handleSave() {
    if (!name.trim()) {
      toast.error('Workflow name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        trigger,
        isActive,
        definition: { steps } as WorkflowDefinition,
      };
      if (isNew) {
        await api.post('/workflows', payload);
        toast.success('Workflow created!');
      } else {
        await api.patch(`/workflows/${id}`, payload);
        toast.success('Workflow saved!');
      }
      qc.invalidateQueries({ queryKey: ['workflows'] });
      router.push('/workflows');
    } catch {
      toast.error('Failed to save workflow');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const selectedTrigger = TRIGGERS.find((t) => t.value === trigger);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/workflows')}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workflow name..."
            className="text-lg font-semibold text-slate-900 bg-transparent border-none outline-none w-full placeholder-slate-400"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description..."
            className="text-sm text-slate-500 bg-transparent border-none outline-none w-full placeholder-slate-400 mt-0.5"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <div
              onClick={() => setIsActive((v) => !v)}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${isActive ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            {isActive ? 'Active' : 'Inactive'}
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Trigger Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Trigger
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {TRIGGERS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTrigger(t.value)}
              className={`text-left p-3 rounded-lg border transition-all ${
                trigger === t.value
                  ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-400'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-medium text-slate-900">{t.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{t.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Steps Builder */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Steps</h3>

        {steps.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
            <p className="text-sm text-slate-500">No steps yet. Add your first action below.</p>
          </div>
        )}

        <div className="space-y-3">
          {steps.map((step, index) => {
            const stepDef = STEP_TYPES.find((s) => s.type === step.type);
            const Icon = stepDef?.icon ?? Zap;
            return (
              <div key={step.id}>
                {index > 0 && (
                  <div className="flex justify-center my-1">
                    <div className="w-px h-6 bg-slate-200" />
                  </div>
                )}
                <div className={`flex items-start gap-3 p-4 rounded-xl border ${stepDef?.color ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={step.label}
                        onChange={(e) => updateStep(step.id, { label: e.target.value })}
                        className="text-sm font-medium bg-transparent border-none outline-none flex-1"
                      />
                      <button
                        onClick={() => removeStep(step.id)}
                        className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors opacity-60 hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {step.type === 'wait' && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs">Wait</span>
                        <input
                          type="number"
                          min={1}
                          value={step.config.days ?? 1}
                          onChange={(e) => updateStep(step.id, { config: { ...step.config, days: +e.target.value } })}
                          className="w-16 text-xs border border-current/30 rounded px-2 py-1 bg-white/50"
                        />
                        <span className="text-xs">days</span>
                      </div>
                    )}
                    {step.type === 'update_lead_status' && (
                      <select
                        value={step.config.status ?? 'contacted'}
                        onChange={(e) => updateStep(step.id, { config: { status: e.target.value } })}
                        className="mt-2 text-xs border border-current/30 rounded px-2 py-1 bg-white/50"
                      >
                        {['new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost'].map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    )}
                    {step.type === 'add_tag' && (
                      <input
                        type="text"
                        placeholder="Tag name..."
                        value={step.config.tag ?? ''}
                        onChange={(e) => updateStep(step.id, { config: { tag: e.target.value } })}
                        className="mt-2 text-xs border border-current/30 rounded px-2 py-1 bg-white/50 w-40"
                      />
                    )}
                    {(step.type === 'send_email' || step.type === 'send_whatsapp') && (
                      <input
                        type="text"
                        placeholder="Message template..."
                        value={step.config.template ?? ''}
                        onChange={(e) => updateStep(step.id, { config: { template: e.target.value } })}
                        className="mt-2 text-xs border border-current/30 rounded px-2 py-1 bg-white/50 w-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Step */}
        <div className="mt-4">
          <button
            onClick={() => setShowStepPicker((v) => !v)}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-slate-500 border-2 border-dashed border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Step
            <ChevronDown className={`w-4 h-4 transition-transform ${showStepPicker ? 'rotate-180' : ''}`} />
          </button>

          {showStepPicker && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {STEP_TYPES.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.type}
                    onClick={() => addStep(s.type)}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-left hover:opacity-80 transition-opacity ${s.color}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium">{s.label}</div>
                      <div className="text-xs opacity-70">{s.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
