'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CreateCampaign } from '@/types/campaign';

interface CampaignFormProps {
  onSubmit: (data: CreateCampaign) => void;
  loading?: boolean;
  onCancel: () => void;
}

const typeOptions = [
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'ads', label: 'Ads' },
];

export function CampaignForm({ onSubmit, loading, onCancel }: CampaignFormProps) {
  const [form, setForm] = useState({
    name: '',
    type: 'email',
    budget: '',
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Campaign name is required';
    return errs;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      name: form.name,
      type: form.type as CreateCampaign['type'],
      budget: form.budget ? Number(form.budget) : undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Campaign Name *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
      />
      <Select
        label="Type"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        options={typeOptions}
      />
      <Input
        label="Budget (₹)"
        type="number"
        value={form.budget}
        onChange={(e) => setForm({ ...form, budget: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        <Input
          label="End Date"
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create Campaign
        </Button>
      </div>
    </form>
  );
}
