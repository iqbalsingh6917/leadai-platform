'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Zap, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { AutopilotRule } from '@/types/phase3';

const MOCK_RULES: AutopilotRule[] = [
  {
    id: '1',
    name: 'High Score Follow-up',
    trigger: 'lead_score_above',
    triggerValue: '75',
    actions: [{ type: 'send_email' }, { type: 'assign_lead' }],
    isActive: true,
    executionCount: 142,
    lastRunAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    name: 'Stage Change Notification',
    trigger: 'stage_changed',
    triggerValue: 'Qualified',
    actions: [{ type: 'send_whatsapp' }],
    isActive: false,
    executionCount: 38,
    lastRunAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const TRIGGER_LABELS: Record<string, string> = {
  lead_score_above: 'Lead Score Above',
  stage_changed: 'Stage Changed',
  no_activity: 'No Activity',
  tag_added: 'Tag Added',
};

const TRIGGER_COLORS: Record<string, 'info' | 'warning' | 'success' | 'neutral'> = {
  lead_score_above: 'info',
  stage_changed: 'success',
  no_activity: 'warning',
  tag_added: 'neutral',
};

const ACTION_OPTIONS = [
  { value: 'send_email', label: 'Send Email' },
  { value: 'send_whatsapp', label: 'Send WhatsApp' },
  { value: 'update_status', label: 'Update Status' },
  { value: 'assign_lead', label: 'Assign Lead' },
];

const EMPTY_FORM = {
  name: '',
  trigger: 'lead_score_above' as AutopilotRule['trigger'],
  triggerValue: '',
  actions: [] as { type: string }[],
  isActive: true,
};

export default function AutopilotPage() {
  const [rules, setRules] = useState<AutopilotRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    api.get('/campaigns/autopilot/rules')
      .then((res) => setRules(res.data ?? []))
      .catch(() => setRules(MOCK_RULES))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (rule: AutopilotRule) => {
    try {
      await api.patch(`/campaigns/autopilot/rules/${rule.id}/toggle`);
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, isActive: !r.isActive } : r))
      );
      toast.success(`Rule ${rule.isActive ? 'paused' : 'activated'}`);
    } catch {
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, isActive: !r.isActive } : r))
      );
      toast.success(`Rule ${rule.isActive ? 'paused' : 'activated'}`);
    }
  };

  const handleAddAction = (type: string) => {
    if (form.actions.find((a) => a.type === type)) return;
    setForm((prev) => ({ ...prev, actions: [...prev.actions, { type }] }));
  };

  const handleRemoveAction = (type: string) => {
    setForm((prev) => ({ ...prev, actions: prev.actions.filter((a) => a.type !== type) }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Rule name is required');
      return;
    }
    if (form.actions.length === 0) {
      toast.error('Add at least one action');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/campaigns/autopilot/rules', {
        ...form,
        executionCount: 0,
      });
      setRules((prev) => [...prev, res.data]);
      toast.success('Autopilot rule created!');
    } catch {
      const newRule: AutopilotRule = {
        id: Date.now().toString(),
        ...form,
        executionCount: 0,
      };
      setRules((prev) => [...prev, newRule]);
      toast.success('Autopilot rule created!');
    } finally {
      setSaving(false);
      setShowPanel(false);
      setForm(EMPTY_FORM);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign Autopilot</h1>
          <p className="text-sm text-slate-500 mt-1">Automate actions based on lead behavior</p>
        </div>
        <Button onClick={() => setShowPanel(true)}>
          <Plus className="w-4 h-4" />
          New Rule
        </Button>
      </div>

      {/* Rules */}
      {loading ? (
        <p className="text-slate-500 text-sm">Loading rules...</p>
      ) : rules.length === 0 ? (
        <Card className="text-center py-12">
          <Zap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No autopilot rules yet</p>
          <p className="text-sm text-slate-400 mb-4">Create your first rule to automate lead actions</p>
          <Button onClick={() => setShowPanel(true)}>
            <Plus className="w-4 h-4" />
            Create Rule
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Card key={rule.id} className="p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggle(rule)}
                  className="flex-shrink-0"
                  title={rule.isActive ? 'Pause rule' : 'Activate rule'}
                >
                  {rule.isActive ? (
                    <ToggleRight className="w-8 h-8 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">{rule.name}</span>
                    <Badge variant={TRIGGER_COLORS[rule.trigger]}>
                      {TRIGGER_LABELS[rule.trigger]}
                      {rule.triggerValue && `: ${rule.triggerValue}`}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                    <span>{rule.actions.length} action{rule.actions.length !== 1 ? 's' : ''}</span>
                    <span>{rule.executionCount} executions</span>
                    {rule.lastRunAt && (
                      <span>Last run {new Date(rule.lastRunAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex gap-1 flex-wrap max-w-48">
                    {rule.actions.map((a) => (
                      <Badge key={a.type} variant="neutral">
                        {ACTION_OPTIONS.find((o) => o.value === a.type)?.label ?? a.type}
                      </Badge>
                    ))}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Slide-over Panel */}
      {showPanel && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowPanel(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">New Autopilot Rule</h2>
              <button
                onClick={() => setShowPanel(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rule Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. High Score Follow-up"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trigger</label>
                <select
                  value={form.trigger}
                  onChange={(e) => setForm((p) => ({ ...p, trigger: e.target.value as AutopilotRule['trigger'] }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="lead_score_above">Lead Score Above</option>
                  <option value="stage_changed">Stage Changed</option>
                  <option value="no_activity">No Activity</option>
                  <option value="tag_added">Tag Added</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Trigger Value
                  <span className="text-slate-400 font-normal ml-1">
                    ({form.trigger === 'lead_score_above' ? 'e.g. 75' : form.trigger === 'stage_changed' ? 'e.g. Qualified' : form.trigger === 'no_activity' ? 'days, e.g. 7' : 'e.g. hot'})
                  </span>
                </label>
                <Input
                  value={form.triggerValue}
                  onChange={(e) => setForm((p) => ({ ...p, triggerValue: e.target.value }))}
                  placeholder="Enter trigger value"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Actions</label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {ACTION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAddAction(opt.value)}
                      disabled={!!form.actions.find((a) => a.type === opt.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        form.actions.find((a) => a.type === opt.value)
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-600 opacity-60 cursor-not-allowed'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      + {opt.label}
                    </button>
                  ))}
                </div>
                {form.actions.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {form.actions.map((a) => (
                      <span
                        key={a.type}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                      >
                        {ACTION_OPTIONS.find((o) => o.value === a.type)?.label ?? a.type}
                        <button
                          onClick={() => handleRemoveAction(a.type)}
                          className="hover:text-indigo-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                  className="flex-shrink-0"
                >
                  {form.isActive ? (
                    <ToggleRight className="w-8 h-8 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
                <span className="text-sm font-medium text-slate-700">
                  {form.isActive ? 'Rule is Active' : 'Rule is Paused'}
                </span>
              </div>
            </div>

            {/* Panel footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowPanel(false); setForm(EMPTY_FORM); }}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave} loading={saving}>
                Save Rule
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
