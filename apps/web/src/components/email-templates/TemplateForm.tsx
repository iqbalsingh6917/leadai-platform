'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CreateEmailTemplate, UpdateEmailTemplate } from '@/types/email-template';

interface TemplateFormProps {
  initialValues?: Partial<CreateEmailTemplate>;
  onSubmit: (data: CreateEmailTemplate | UpdateEmailTemplate) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TemplateForm({ initialValues, onSubmit, onCancel, loading }: TemplateFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [subject, setSubject] = useState(initialValues?.subject ?? '');
  const [body, setBody] = useState(initialValues?.body ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, subject, body, description: description || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Template Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Welcome Email"
        required
      />
      <Input
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Brief description of this template"
      />
      <div>
        <Input
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Hello {{firstName}}, welcome to {{company}}!"
          required
        />
        <p className="mt-1 text-xs text-slate-500">
          Use {'{{firstName}}'}, {'{{company}}'} etc. for personalisation.
        </p>
      </div>
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1">Body</label>
        <textarea
          className="block w-full rounded-md border-slate-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={9}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your email HTML here..."
          required
        />
        <p className="mt-1 text-xs text-slate-500">
          Available variables: {'{{firstName}}'}, {'{{lastName}}'}, {'{{email}}'}, {'{{company}}'}
        </p>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Save Template
        </Button>
      </div>
    </form>
  );
}
