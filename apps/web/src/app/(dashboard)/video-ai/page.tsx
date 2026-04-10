'use client';

import { useState } from 'react';
import { Video, Plus, Play, MessageSquare, X } from 'lucide-react';

type Tab = 'templates' | 'jobs';

const STYLE_COLORS: Record<string, string> = {
  professional: 'bg-blue-100 text-blue-700',
  casual: 'bg-green-100 text-green-700',
  animated: 'bg-purple-100 text-purple-700',
};

const JOB_STATUS_COLORS: Record<string, string> = {
  queued: 'bg-slate-100 text-slate-600',
  processing: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

const MOCK_TEMPLATES = [
  { id: '1', name: 'Product Demo', style: 'professional', variables: ['recipientName', 'productName', 'price'], duration: 60, status: 'active' },
  { id: '2', name: 'Welcome Video', style: 'casual', variables: ['recipientName', 'companyName'], duration: 30, status: 'active' },
  { id: '3', name: 'Feature Announcement', style: 'animated', variables: ['featureName', 'launchDate'], duration: 45, status: 'draft' },
];

const MOCK_JOBS = [
  { id: '1', recipient: 'Rahul Sharma', template: 'Product Demo', status: 'completed', videoUrl: 'https://mock-videos.leadai.io/job1.mp4', createdAt: '2024-01-15 10:30' },
  { id: '2', recipient: 'Priya Singh', template: 'Welcome Video', status: 'processing', videoUrl: null, createdAt: '2024-01-15 11:00' },
  { id: '3', recipient: 'Amit Kumar', template: 'Product Demo', status: 'queued', videoUrl: null, createdAt: '2024-01-15 11:15' },
  { id: '4', recipient: 'Neha Patel', template: 'Feature Announcement', status: 'failed', videoUrl: null, createdAt: '2024-01-14 16:00' },
];

export default function VideoAIPage() {
  const [tab, setTab] = useState<Tab>('templates');
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [sentMsg, setSentMsg] = useState<string | null>(null);
  const [templateForm, setTemplateForm] = useState({ name: '', scriptTemplate: '', variables: '', style: 'professional', duration: '60' });
  const [jobForm, setJobForm] = useState({ templateId: '', recipientName: '' });

  const sendViaWA = (job: typeof MOCK_JOBS[0]) => {
    setSentMsg(`Video sent to ${job.recipient} via WhatsApp!`);
    setTimeout(() => setSentMsg(null), 3000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
            <Video className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Video AI</h1>
            <p className="text-slate-500 text-sm">Personalized video generation for leads and contacts</p>
          </div>
        </div>
      </div>

      {sentMsg && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">✓ {sentMsg}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        {[{ id: 'templates', label: 'Templates' }, { id: 'jobs', label: 'Render Jobs' }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as Tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'templates' && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowTemplateForm(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> New Template
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_TEMPLATES.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{t.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STYLE_COLORS[t.style]}`}>{t.style}</span>
                </div>
                <div className="flex gap-3 text-xs text-slate-500">
                  <span>⏱ {t.duration}s</span>
                  <span>📝 {t.variables.length} variables</span>
                  <span className={`capitalize ${t.status === 'active' ? 'text-green-600' : 'text-slate-400'}`}>{t.status}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {t.variables.map((v) => (
                    <span key={v} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{'{'}{v}{'}'}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'jobs' && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowJobForm(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> New Job
            </button>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  {['Recipient', 'Template', 'Status', 'Created', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_JOBS.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{job.recipient}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{job.template}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${JOB_STATUS_COLORS[job.status]}`}>{job.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{job.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {job.videoUrl && (
                          <a href={job.videoUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs text-slate-700">
                            <Play className="w-3 h-3" /> Preview
                          </a>
                        )}
                        {job.status === 'completed' && (
                          <button onClick={() => sendViaWA(job)}
                            className="flex items-center gap-1 px-2 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs">
                            <MessageSquare className="w-3 h-3" /> WA
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Template Form */}
      {showTemplateForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowTemplateForm(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-semibold text-lg">New Video Template</h2>
              <button onClick={() => setShowTemplateForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Template Name</label>
                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={templateForm.name} onChange={(e) => setTemplateForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Script Template</label>
                <textarea rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Hi {recipientName}, welcome to {companyName}..."
                  value={templateForm.scriptTemplate} onChange={(e) => setTemplateForm((f) => ({ ...f, scriptTemplate: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Variables (comma separated)</label>
                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="recipientName, companyName"
                  value={templateForm.variables} onChange={(e) => setTemplateForm((f) => ({ ...f, variables: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Style</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    value={templateForm.style} onChange={(e) => setTemplateForm((f) => ({ ...f, style: e.target.value }))}>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="animated">Animated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (sec)</label>
                  <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    value={templateForm.duration} onChange={(e) => setTemplateForm((f) => ({ ...f, duration: e.target.value }))} />
                </div>
              </div>
              <button onClick={() => setShowTemplateForm(false)}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
