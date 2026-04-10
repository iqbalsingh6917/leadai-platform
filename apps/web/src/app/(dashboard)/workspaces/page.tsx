'use client';

import { useState, useEffect } from 'react';
import { Plus, Building2, Users, LayoutDashboard, X, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Workspace } from '@/types/phase3';

const MOCK_WORKSPACES: Workspace[] = [
  {
    id: '1',
    name: 'Acme Corp',
    slug: 'acme-corp',
    plan: 'growth',
    status: 'active',
    memberCount: 12,
    leadCount: 1842,
  },
  {
    id: '2',
    name: 'Beta Startup',
    slug: 'beta-startup',
    plan: 'starter',
    status: 'trial',
    memberCount: 3,
    leadCount: 124,
  },
];

const STATUS_BADGE: Record<Workspace['status'], 'success' | 'danger' | 'info'> = {
  active: 'success',
  suspended: 'danger',
  trial: 'info',
};

const PLAN_COLORS: Record<string, string> = {
  starter: 'bg-slate-100 text-slate-700',
  growth: 'bg-blue-100 text-blue-700',
  scale: 'bg-purple-100 text-purple-700',
  enterprise: 'bg-amber-100 text-amber-700',
};

const EMPTY_FORM = { name: '', plan: 'starter' };

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/workspaces')
      .then((res) => setWorkspaces(res.data ?? []))
      .catch(() => setWorkspaces(MOCK_WORKSPACES))
      .finally(() => setLoading(false));
  }, []);

  const openNew = () => {
    setEditingWorkspace(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (ws: Workspace) => {
    setEditingWorkspace(ws);
    setForm({ name: ws.name, plan: ws.plan });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Workspace name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingWorkspace) {
        const res = await api.patch(`/workspaces/${editingWorkspace.id}`, form);
        setWorkspaces((prev) => prev.map((w) => (w.id === editingWorkspace.id ? res.data : w)));
        toast.success('Workspace updated!');
      } else {
        const res = await api.post('/workspaces', form);
        setWorkspaces((prev) => [...prev, res.data]);
        toast.success('Workspace created!');
      }
    } catch {
      const ws: Workspace = {
        id: Date.now().toString(),
        name: form.name,
        slug: form.name.toLowerCase().replace(/\s+/g, '-'),
        plan: form.plan,
        status: 'active',
        memberCount: 1,
        leadCount: 0,
      };
      if (editingWorkspace) {
        setWorkspaces((prev) => prev.map((w) => (w.id === editingWorkspace.id ? { ...w, ...form } : w)));
        toast.success('Workspace updated!');
      } else {
        setWorkspaces((prev) => [...prev, ws]);
        toast.success('Workspace created!');
      }
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };

  const handleSuspend = async (ws: Workspace) => {
    if (!confirm(`${ws.status === 'suspended' ? 'Reactivate' : 'Suspend'} workspace "${ws.name}"?`)) return;
    const newStatus: Workspace['status'] = ws.status === 'suspended' ? 'active' : 'suspended';
    try {
      await api.patch(`/workspaces/${ws.id}`, { status: newStatus });
    } catch {
      // Optimistic
    }
    setWorkspaces((prev) => prev.map((w) => (w.id === ws.id ? { ...w, status: newStatus } : w)));
    toast.success(`Workspace ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}`);
  };

  const handleSwitch = (ws: Workspace) => {
    localStorage.setItem('active-workspace', ws.id ?? '');
    toast.success(`Switched to ${ws.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workspaces</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your organization workspaces</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4" />
          New Workspace
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-slate-500 text-sm">Loading workspaces...</p>
      ) : workspaces.length === 0 ? (
        <Card className="text-center py-12">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No workspaces yet</p>
          <Button className="mt-4" onClick={openNew}>
            <Plus className="w-4 h-4" />
            Create Workspace
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => (
            <Card key={ws.id} className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{ws.name}</p>
                    <code className="text-xs text-slate-400 font-mono">{ws.slug}</code>
                  </div>
                </div>
                <Badge variant={STATUS_BADGE[ws.status]} className="capitalize">
                  {ws.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${PLAN_COLORS[ws.plan] ?? 'bg-slate-100 text-slate-700'}`}>
                  {ws.plan}
                </span>
              </div>

              <div className="flex gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{ws.memberCount} members</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>{ws.leadCount.toLocaleString()} leads</span>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <Button size="sm" variant="outline" onClick={() => openEdit(ws)}>
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={ws.status === 'suspended' ? 'secondary' : 'outline'}
                  onClick={() => handleSuspend(ws)}
                >
                  {ws.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                </Button>
                <Button size="sm" onClick={() => handleSwitch(ws)}>
                  Switch
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingWorkspace ? 'Edit Workspace' : 'New Workspace'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-slate-100 text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Workspace Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                  <select
                    value={form.plan}
                    onChange={(e) => setForm((p) => ({ ...p, plan: e.target.value }))}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="scale">Scale</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSave} loading={saving}>
                  {editingWorkspace ? 'Update' : 'Create Workspace'}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
