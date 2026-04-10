'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { TemplateForm } from '@/components/email-templates/TemplateForm';
import {
  useEmailTemplates,
  useCreateEmailTemplate,
  useUpdateEmailTemplate,
  useDeleteEmailTemplate,
} from '@/hooks/useEmailTemplates';
import { EmailTemplate } from '@/types/email-template';

export default function EmailTemplatesPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EmailTemplate | null>(null);

  const { data, isLoading } = useEmailTemplates(search || undefined);
  const createMutation = useCreateEmailTemplate();
  const updateMutation = useUpdateEmailTemplate();
  const deleteMutation = useDeleteEmailTemplate();

  const templates = data?.data ?? [];

  const handleCreate = async (formData: any) => {
    await createMutation.mutateAsync(formData);
    toast.success('Template created');
    setCreateOpen(false);
  };

  const handleUpdate = async (formData: any) => {
    if (!editTarget) return;
    await updateMutation.mutateAsync({ id: editTarget.id, data: formData });
    toast.success('Template updated');
    setEditTarget(null);
  };

  const handleDelete = async (template: EmailTemplate) => {
    if (!window.confirm(`Delete template "${template.name}"?`)) return;
    await deleteMutation.mutateAsync(template.id);
    toast.success('Template deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Email Templates</h1>
          <p className="text-sm text-slate-500 mt-1">Create reusable email templates with dynamic variables</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search templates..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="block w-full max-w-sm rounded-md border-slate-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
      />

      {/* Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16">
          <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No templates yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first email template to get started</p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            New Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{template.name}</h3>
                  <p className="text-sm text-slate-500 truncate mt-0.5">{template.subject}</p>
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => setEditTarget(template)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {template.description && (
                <p className="text-xs text-slate-500 line-clamp-2">{template.description}</p>
              )}
              <p className="text-xs text-slate-400">
                Updated {new Date(template.updatedAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New Email Template" size="lg">
        <TemplateForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          loading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Email Template"
        size="lg"
      >
        {editTarget && (
          <TemplateForm
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
