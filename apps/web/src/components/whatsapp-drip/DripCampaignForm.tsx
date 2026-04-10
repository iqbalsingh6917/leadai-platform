'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CreateDripCampaign, DripStep } from '@/types/whatsapp-drip';

interface DripCampaignFormProps {
  initial?: Partial<CreateDripCampaign>;
  onSubmit: (data: CreateDripCampaign) => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const emptyStep = (): DripStep => ({
  stepOrder: 0,
  delayDays: 0,
  messageType: 'text',
  body: '',
});

export function DripCampaignForm({
  initial,
  onSubmit,
  onCancel,
  loading = false,
}: DripCampaignFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [trigger, setTrigger] = useState(initial?.trigger ?? 'manual');
  const [status, setStatus] = useState(initial?.status ?? 'draft');
  const [steps, setSteps] = useState<DripStep[]>(
    initial?.steps?.length ? initial.steps : [emptyStep()],
  );

  const addStep = () => {
    setSteps((prev) => [...prev, { ...emptyStep(), stepOrder: prev.length }]);
  };

  const removeStep = (index: number) => {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, stepOrder: i })),
    );
  };

  const updateStep = (index: number, patch: Partial<DripStep>) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedSteps = steps.map((s, i) => ({ ...s, stepOrder: i }));
    onSubmit({ name, description: description || undefined, trigger, status, steps: normalizedSteps });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Campaign Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Welcome Sequence"
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          className="block w-full rounded-md border-slate-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>

      <Select
        label="Trigger"
        value={trigger}
        onChange={(e) => setTrigger(e.target.value)}
        options={[
          { value: 'lead_created', label: 'Lead Created' },
          { value: 'lead_status_changed', label: 'Lead Status Changed' },
          { value: 'manual', label: 'Manual' },
        ]}
      />

      <Select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'active', label: 'Active' },
          { value: 'paused', label: 'Paused' },
          { value: 'archived', label: 'Archived' },
        ]}
      />

      {/* Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Steps</h3>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            Add Step
          </Button>
        </div>

        {steps.map((step, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Step {index + 1}
              </span>
              <button
                type="button"
                disabled={steps.length === 1}
                onClick={() => removeStep(index)}
                className="text-xs text-rose-500 hover:text-rose-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Remove Step
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Delay (days)"
                type="number"
                min={0}
                value={step.delayDays}
                onChange={(e) => updateStep(index, { delayDays: Number(e.target.value) })}
              />

              <Select
                label="Message Type"
                value={step.messageType}
                onChange={(e) =>
                  updateStep(index, { messageType: e.target.value as 'text' | 'template' })
                }
                options={[
                  { value: 'text', label: 'Text' },
                  { value: 'template', label: 'Template' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {step.messageType === 'template' ? 'Template Name' : 'Message Body'}
              </label>
              <textarea
                required
                className="block w-full rounded-md border-slate-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
                value={step.body}
                onChange={(e) => updateStep(index, { body: e.target.value })}
                placeholder="Message text or template name"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          Save Campaign
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
