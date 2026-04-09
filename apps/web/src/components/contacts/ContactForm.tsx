'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CreateContact, UpdateContact, Contact, LifecycleStage } from '@/types/contact';

interface ContactFormProps {
  initialData?: Partial<Contact>;
  onSubmit: (data: CreateContact | UpdateContact) => void;
  loading?: boolean;
  onCancel: () => void;
}

const lifecycleOptions = [
  { value: 'subscriber', label: 'Subscriber' },
  { value: 'lead', label: 'Lead' },
  { value: 'marketing_qualified_lead', label: 'Marketing Qualified Lead' },
  { value: 'sales_qualified_lead', label: 'Sales Qualified Lead' },
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'customer', label: 'Customer' },
  { value: 'evangelist', label: 'Evangelist' },
  { value: 'other', label: 'Other' },
];

export function ContactForm({ initialData, onSubmit, loading, onCancel }: ContactFormProps) {
  const [form, setForm] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
    lifecycleStage: initialData?.lifecycleStage || 'lead',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    return errs;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form as CreateContact);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name *"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          error={errors.firstName}
        />
        <Input
          label="Last Name *"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          error={errors.lastName}
        />
      </div>
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
      />
      <Input
        label="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Input
        label="Company"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />
      <Select
        label="Lifecycle Stage"
        value={form.lifecycleStage}
        onChange={(e) => setForm({ ...form, lifecycleStage: e.target.value as LifecycleStage })}
        options={lifecycleOptions}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData?.id ? 'Update Contact' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
}
