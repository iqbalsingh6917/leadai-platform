'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CreateDeal, UpdateDeal, Deal } from '@/types/pipeline';

interface DealFormProps {
  initialData?: Partial<Deal>;
  stageId: string;
  onSubmit: (data: CreateDeal | UpdateDeal) => void;
  loading?: boolean;
  onCancel: () => void;
}

export function DealForm({ initialData, stageId, onSubmit, loading, onCancel }: DealFormProps) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    value: initialData?.value ? String(initialData.value) : '',
    contactName: initialData?.contactName || '',
    expectedCloseDate: initialData?.expectedCloseDate?.split('T')[0] || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.value || isNaN(Number(form.value))) errs.value = 'Valid value is required';
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
      title: form.title,
      value: Number(form.value),
      stageId,
      expectedCloseDate: form.expectedCloseDate || undefined,
    } as CreateDeal);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Deal Title *"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        error={errors.title}
      />
      <Input
        label="Value (₹) *"
        type="number"
        value={form.value}
        onChange={(e) => setForm({ ...form, value: e.target.value })}
        error={errors.value}
      />
      <Input
        label="Contact Name"
        value={form.contactName}
        onChange={(e) => setForm({ ...form, contactName: e.target.value })}
      />
      <Input
        label="Expected Close Date"
        type="date"
        value={form.expectedCloseDate}
        onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData?.id ? 'Update Deal' : 'Add Deal'}
        </Button>
      </div>
    </form>
  );
}
