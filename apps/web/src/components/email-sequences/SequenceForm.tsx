'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { CreateEmailSequence, SequenceStep } from '@/types/email-sequence';

const TRIGGER_OPTIONS = [
  { value: 'lead_created', label: 'Lead Created' },
  { value: 'lead_status_changed', label: 'Lead Status Changed' },
  { value: 'manual', label: 'Manual' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'archived', label: 'Archived' },
];

const emptyStep = (): SequenceStep => ({
  stepOrder: 0,
  delayDays: 0,
  subject: '',
  body: '',
});

interface SequenceFormProps {
  initialValues?: Partial<CreateEmailSequence>;
  onSubmit: (data: CreateEmailSequence) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function SequenceForm({ initialValues, onSubmit, onCancel, loading }: SequenceFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [trigger, setTrigger] = useState(initialValues?.trigger ?? 'manual');
  const [status, setStatus] = useState(initialValues?.status ?? 'draft');
  const [steps, setSteps] = useState<SequenceStep[]>(
    initialValues?.steps?.length
      ? initialValues.steps
      : [emptyStep()],
  );

  const addStep = () => {
    setSteps((prev) => [...prev, { ...emptyStep(), stepOrder: prev.length }]);
  };

  const removeStep = (index: number) => {
    setSteps((prev) =>
      prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepOrder: i })),
    );
  };

  const updateStep = (index: number, field: keyof SequenceStep, value: string | number) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description: description || undefined,
      trigger,
      status,
      steps: steps.map((s, i) => ({ ...s, stepOrder: i })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Sequence Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. New Lead Welcome Sequence"
        required
      />
      <Input
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe this sequence"
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Trigger"
          options={TRIGGER_OPTIONS}
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
        />
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Steps ({steps.length})</h3>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="w-3 h-3" />
            Add Step
          </Button>
        </div>

        {steps.map((step, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Step {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Delay (days)"
                type="number"
                min={0}
                value={step.delayDays}
                onChange={(e) => updateStep(index, 'delayDays', Number(e.target.value))}
              />
            </div>
            <Input
              label="Subject"
              value={step.subject}
              onChange={(e) => updateStep(index, 'subject', e.target.value)}
              placeholder="Email subject..."
              required
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Body</label>
              <textarea
                className="block w-full rounded-md border-slate-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={5}
                value={step.body}
                onChange={(e) => updateStep(index, 'body', e.target.value)}
                placeholder="Email body..."
                required
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Save Sequence
        </Button>
      </div>
    </form>
  );
}
