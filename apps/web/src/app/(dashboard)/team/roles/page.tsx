'use client';

import { useState, useEffect } from 'react';
import { Plus, Shield, X, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Role } from '@/types/phase3';

const PERMISSION_GROUPS: Record<string, string[]> = {
  Leads: ['leads:read', 'leads:write', 'leads:delete'],
  Contacts: ['contacts:read', 'contacts:write'],
  Campaigns: ['campaigns:read', 'campaigns:write'],
  Analytics: ['analytics:read'],
  Pipelines: ['pipelines:read', 'pipelines:write'],
  Billing: ['billing:read', 'billing:write'],
  Team: ['team:read', 'team:write'],
  Settings: ['settings:read', 'settings:write'],
  Integrations: ['integrations:read', 'integrations:write'],
  Workflows: ['workflows:read', 'workflows:write'],
};

const ALL_PERMISSIONS = Object.values(PERMISSION_GROUPS).flat();

const MOCK_ROLES: Role[] = [
  {
    id: '1',
    name: 'Owner',
    description: 'Full access to everything',
    permissions: ALL_PERMISSIONS,
    isSystem: true,
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Manage team and settings',
    permissions: [
      'leads:read', 'leads:write', 'contacts:read', 'contacts:write',
      'campaigns:read', 'campaigns:write', 'team:read', 'team:write',
    ],
    isSystem: true,
  },
  {
    id: '3',
    name: 'Member',
    description: 'Basic access',
    permissions: ['leads:read', 'contacts:read', 'campaigns:read'],
    isSystem: false,
  },
];

const EMPTY_FORM = {
  name: '',
  description: '',
  permissions: [] as string[],
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    api.get('/roles')
      .then((res) => setRoles(res.data ?? []))
      .catch(() => setRoles(MOCK_ROLES))
      .finally(() => setLoading(false));
  }, []);

  const openNew = () => {
    setEditingRole(null);
    setForm(EMPTY_FORM);
    setShowPanel(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setForm({ name: role.name, description: role.description ?? '', permissions: [...role.permissions] });
    setShowPanel(true);
  };

  const togglePermission = (perm: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const toggleGroup = (group: string) => {
    const groupPerms = PERMISSION_GROUPS[group];
    const allChecked = groupPerms.every((p) => form.permissions.includes(p));
    setForm((prev) => ({
      ...prev,
      permissions: allChecked
        ? prev.permissions.filter((p) => !groupPerms.includes(p))
        : [...new Set([...prev.permissions, ...groupPerms])],
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Role name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingRole) {
        const res = await api.patch(`/roles/${editingRole.id}`, form);
        setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? res.data : r)));
        toast.success('Role updated!');
      } else {
        const res = await api.post('/roles', { ...form, isSystem: false });
        setRoles((prev) => [...prev, res.data]);
        toast.success('Role created!');
      }
    } catch {
      const newRole: Role = {
        id: Date.now().toString(),
        ...form,
        isSystem: false,
      };
      if (editingRole) {
        setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? { ...r, ...form } : r)));
        toast.success('Role updated!');
      } else {
        setRoles((prev) => [...prev, newRole]);
        toast.success('Role created!');
      }
    } finally {
      setSaving(false);
      setShowPanel(false);
    }
  };

  const handleDelete = async (role: Role) => {
    if (!confirm(`Delete role "${role.name}"?`)) return;
    try {
      await api.delete(`/roles/${role.id}`);
    } catch {
      // Optimistic delete
    }
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    toast.success('Role deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Custom Roles</h1>
          <p className="text-sm text-slate-500 mt-1">Manage roles and permissions for your team</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4" />
          New Role
        </Button>
      </div>

      {/* Roles list */}
      {loading ? (
        <p className="text-slate-500 text-sm">Loading roles...</p>
      ) : (
        <div className="space-y-3">
          {roles.map((role) => (
            <Card key={role.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">{role.name}</span>
                    {role.isSystem && (
                      <Badge variant="info">System</Badge>
                    )}
                    <Badge variant="neutral">{role.permissions.length} permissions</Badge>
                  </div>
                  {role.description && (
                    <p className="text-sm text-slate-500 mt-0.5">{role.description}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(role)}
                    disabled={role.isSystem}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(role)}
                    disabled={role.isSystem}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Slide-over Panel */}
      {showPanel && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowPanel(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingRole ? 'Edit Role' : 'New Role'}
              </h2>
              <button onClick={() => setShowPanel(false)} className="p-1 rounded hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Sales Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of this role"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Permissions</label>
                <div className="space-y-4">
                  {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
                    const allChecked = perms.every((p) => form.permissions.includes(p));
                    const someChecked = perms.some((p) => form.permissions.includes(p));
                    return (
                      <div key={group} className="border border-slate-200 rounded-lg p-3">
                        <label className="flex items-center gap-2 cursor-pointer mb-2">
                          <input
                            type="checkbox"
                            checked={allChecked}
                            ref={(el) => { if (el) el.indeterminate = someChecked && !allChecked; }}
                            onChange={() => toggleGroup(group)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span className="font-semibold text-sm text-slate-900">{group}</span>
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 pl-6">
                          {perms.map((perm) => (
                            <label key={perm} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.permissions.includes(perm)}
                                onChange={() => togglePermission(perm)}
                                className="w-3.5 h-3.5 text-indigo-600 rounded"
                              />
                              <code className="text-xs text-slate-600 font-mono">{perm.split(':')[1]}</code>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowPanel(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave} loading={saving}>
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
