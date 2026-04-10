'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { SequenceForm } from '@/components/email-sequences/SequenceForm';
import {
  useEmailSequences,
  useCreateEmailSequence,
  useUpdateEmailSequence,
  useDeleteEmailSequence,
} from '@/hooks/useEmailSequences';
import { EmailSequence } from '@/types/email-sequence';
import { cn } from '@/lib/utils';

const triggerColors: Record<string, string> = {
  lead_created: 'bg-blue-100 text-blue-700',
  lead_status_changed: 'bg-yellow-100 text-yellow-700',
  manual: 'bg-slate-100 text-slate-600',
};

const triggerLabels: Record<string, string> = {
  lead_created: 'Lead Created',
  lead_status_changed: 'Status Changed',
  manual: 'Manual',
};

const statusColors: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-amber-100 text-amber-700',
  archived: 'bg-slate-100 text-slate-500',
};

export default function EmailSequencesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EmailSequence | null>(null);

  const { data, isLoading } = useEmailSequences();
  const createMutation = useCreateEmailSequence();
  const updateMutation = useUpdateEmailSequence();
  const deleteMutation = useDeleteEmailSequence();

  const sequences = data?.data ?? [];

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    toast.success('Sequence created');
    setCreateOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editTarget) return;
    await updateMutation.mutateAsync({ id: editTarget.id, data: formData });
    toast.success('Sequence updated');
    setEditTarget(null);
  };

  const handleDelete = async (sequence: EmailSequence) => {
    if (!window.confirm(`Delete sequence "${sequence.name}"?`)) return;
    await deleteMutation.mutateAsync(sequence.id);
    toast.success('Sequence deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Email Sequences</h1>
          <p className="text-sm text-slate-500 mt-1">Automate multi-step email campaigns triggered by lead events</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          New Sequence
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading sequences...</div>
      ) : sequences.length === 0 ? (
        <div className="text-center py-16">
          <ListOrdered className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No sequences yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first email sequence to automate outreach</p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            New Sequence
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sequences.map((sequence) => (
            <Card key={sequence.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{sequence.name}</h3>
                  {sequence.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{sequence.description}</p>
                  )}
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => setEditTarget(sequence)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sequence)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    triggerColors[sequence.trigger] ?? 'bg-slate-100 text-slate-600',
                  )}
                >
                  {triggerLabels[sequence.trigger] ?? sequence.trigger}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    statusColors[sequence.status] ?? 'bg-slate-100 text-slate-600',
                  )}
                >
                  {sequence.status.charAt(0).toUpperCase() + sequence.status.slice(1)}
                </span>
              </div>

              <p className="text-xs text-slate-400">
                {sequence.steps?.length ?? 0} step{(sequence.steps?.length ?? 0) !== 1 ? 's' : ''}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New Email Sequence" size="xl">
        <SequenceForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          loading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Email Sequence"
        size="xl"
      >
        {editTarget && (
          <SequenceForm
            initialValues={editTarget}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
            loading={updateMutation.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
