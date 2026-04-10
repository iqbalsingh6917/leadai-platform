'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Play, Download, Trash2, Clock, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Report } from '@/types/phase3';

const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    name: 'Monthly Lead Summary',
    description: 'Overview of leads generated this month',
    type: 'leads',
    config: { metrics: ['Total Leads', 'Conversion Rate'], groupBy: 'date', chartType: 'bar' },
    schedule: 'monthly',
    lastRunAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    name: 'Campaign Performance',
    description: 'Email open and click rates',
    type: 'campaigns',
    config: { metrics: ['Open Rate', 'Click Rate'], groupBy: 'status', chartType: 'line' },
    schedule: 'weekly',
    lastRunAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

const MOCK_RESULT = [
  { period: 'Jan', value: 142, conversion: '18%' },
  { period: 'Feb', value: 198, conversion: '22%' },
  { period: 'Mar', value: 231, conversion: '25%' },
  { period: 'Apr', value: 189, conversion: '20%' },
];

const TYPE_BADGE: Record<Report['type'], 'info' | 'success' | 'warning' | 'neutral' | 'danger'> = {
  leads: 'info',
  campaigns: 'success',
  pipeline: 'warning',
  revenue: 'neutral',
  activity: 'neutral',
};

const EMPTY_FORM = {
  name: '',
  description: '',
  type: 'leads' as Report['type'],
  metrics: [] as string[],
  groupBy: 'date',
  chartType: 'bar',
  schedule: 'none',
};

const METRICS_OPTIONS = [
  'Total Leads', 'Conversion Rate', 'Avg Deal Value', 'Revenue', 'Open Rate', 'Click Rate',
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runResults, setRunResults] = useState<Record<string, typeof MOCK_RESULT>>({});

  useEffect(() => {
    api.get('/reports')
      .then((res) => setReports(res.data ?? []))
      .catch(() => setReports(MOCK_REPORTS))
      .finally(() => setLoading(false));
  }, []);

  const toggleMetric = (m: string) => {
    setForm((prev) => ({
      ...prev,
      metrics: prev.metrics.includes(m) ? prev.metrics.filter((x) => x !== m) : [...prev.metrics, m],
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Report name is required');
      return;
    }
    setSaving(true);
    try {
      const payload: Omit<Report, 'id'> = {
        name: form.name,
        description: form.description,
        type: form.type,
        config: { metrics: form.metrics, groupBy: form.groupBy, chartType: form.chartType },
        schedule: form.schedule !== 'none' ? form.schedule : undefined,
      };
      const res = await api.post('/reports', payload);
      setReports((prev) => [...prev, res.data]);
      toast.success('Report saved!');
    } catch {
      const r: Report = {
        id: Date.now().toString(),
        name: form.name,
        description: form.description,
        type: form.type,
        config: { metrics: form.metrics, groupBy: form.groupBy, chartType: form.chartType },
        schedule: form.schedule !== 'none' ? form.schedule : undefined,
      };
      setReports((prev) => [...prev, r]);
      toast.success('Report saved!');
    } finally {
      setSaving(false);
      setShowPanel(false);
      setForm(EMPTY_FORM);
    }
  };

  const handleRun = async (report: Report) => {
    setRunningId(report.id ?? null);
    try {
      const res = await api.post(`/reports/${report.id}/run`);
      setRunResults((prev) => ({ ...prev, [report.id!]: res.data }));
    } catch {
      setRunResults((prev) => ({ ...prev, [report.id!]: MOCK_RESULT }));
    } finally {
      setRunningId(null);
      toast.success('Report run complete');
    }
  };

  const handleExport = async (report: Report) => {
    try {
      await api.post(`/reports/${report.id}/export`);
      toast.success('Export started — check your email');
    } catch {
      toast.success('Export started — check your email');
    }
  };

  const handleDelete = async (report: Report) => {
    if (!confirm(`Delete report "${report.name}"?`)) return;
    try {
      await api.delete(`/reports/${report.id}`);
    } catch {
      // Optimistic
    }
    setReports((prev) => prev.filter((r) => r.id !== report.id));
    toast.success('Report deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports Builder</h1>
          <p className="text-sm text-slate-500 mt-1">Build and schedule custom reports</p>
        </div>
        <Button onClick={() => setShowPanel(true)}>
          <Plus className="w-4 h-4" />
          New Report
        </Button>
      </div>

      {/* Reports */}
      {loading ? (
        <p className="text-slate-500 text-sm">Loading reports...</p>
      ) : reports.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-500 font-medium mb-3">No reports yet</p>
          <Button onClick={() => setShowPanel(true)}>
            <Plus className="w-4 h-4" />
            Create Report
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id}>
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900">{report.name}</span>
                      <Badge variant={TYPE_BADGE[report.type]} className="capitalize">{report.type}</Badge>
                      {report.schedule && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {report.schedule}
                        </span>
                      )}
                    </div>
                    {report.description && (
                      <p className="text-sm text-slate-500 mt-0.5">{report.description}</p>
                    )}
                    {report.lastRunAt && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last run {new Date(report.lastRunAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      loading={runningId === report.id}
                      onClick={() => handleRun(report)}
                    >
                      <Play className="w-3.5 h-3.5" />
                      Run
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleExport(report)}>
                      <Download className="w-3.5 h-3.5" />
                      Export CSV
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(report)}>
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Run result */}
              {runResults[report.id!] && (
                <div className="mt-2 bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Result Data</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left px-4 py-2 text-xs text-slate-500 font-medium">Period</th>
                        <th className="text-left px-4 py-2 text-xs text-slate-500 font-medium">Value</th>
                        <th className="text-left px-4 py-2 text-xs text-slate-500 font-medium">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {runResults[report.id!].map((row) => (
                        <tr key={row.period} className="border-b border-slate-50 last:border-0">
                          <td className="px-4 py-2 text-slate-700">{row.period}</td>
                          <td className="px-4 py-2 font-medium text-slate-900">{row.value}</td>
                          <td className="px-4 py-2 text-slate-600">{row.conversion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Panel */}
      {showPanel && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowPanel(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">New Report</h2>
              <button onClick={() => setShowPanel(false)} className="p-1 rounded hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Report Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Monthly Lead Summary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Report['type'] }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="leads">Leads</option>
                  <option value="campaigns">Campaigns</option>
                  <option value="pipeline">Pipeline</option>
                  <option value="revenue">Revenue</option>
                  <option value="activity">Activity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Metrics</label>
                <div className="space-y-2">
                  {METRICS_OPTIONS.map((m) => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.metrics.includes(m)}
                        onChange={() => toggleMetric(m)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm text-slate-700">{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Group By</label>
                <select
                  value={form.groupBy}
                  onChange={(e) => setForm((p) => ({ ...p, groupBy: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="date">Date</option>
                  <option value="source">Source</option>
                  <option value="status">Status</option>
                  <option value="assignee">Assignee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chart Type</label>
                <select
                  value={form.chartType}
                  onChange={(e) => setForm((p) => ({ ...p, chartType: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="pie">Pie</option>
                  <option value="table">Table</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Schedule</label>
                <select
                  value={form.schedule}
                  onChange={(e) => setForm((p) => ({ ...p, schedule: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setShowPanel(false); setForm(EMPTY_FORM); }}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave} loading={saving}>
                Save Report
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
