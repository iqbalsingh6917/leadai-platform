'use client';

import { useState } from 'react';
import { Code2, Plus, Copy, Trash2, Check, ExternalLink } from 'lucide-react';

type Tab = 'api-keys' | 'webhooks' | 'usage';

const SCOPES = ['leads:read', 'leads:write', 'contacts:read', 'contacts:write', 'analytics:read', 'campaigns:read', 'workflows:read'];

const EVENTS = ['lead.created', 'lead.updated', 'contact.created', 'deal.won', 'deal.lost', 'campaign.sent', 'payment.received'];

const MOCK_KEYS = [
  { id: '1', name: 'Production API', prefix: 'lak_a1b2', scopes: ['leads:read', 'contacts:read', 'analytics:read'], rateLimit: 5000, createdAt: '2024-01-10' },
  { id: '2', name: 'Dev Testing', prefix: 'lak_c3d4', scopes: ['leads:read'], rateLimit: 100, createdAt: '2024-01-12' },
];

const MOCK_WEBHOOKS = [
  { id: '1', url: 'https://myapp.com/webhooks/leadai', events: ['lead.created', 'deal.won'], deliveryCount: 143, failureCount: 2, lastDelivered: '2024-01-15' },
  { id: '2', url: 'https://crm.example.com/hook', events: ['contact.created'], deliveryCount: 67, failureCount: 0, lastDelivered: '2024-01-14' },
];

const MOCK_ACTIVITY = [
  { endpoint: 'GET /leads', calls: 1240, errors: 3, time: '2024-01-15' },
  { endpoint: 'POST /leads', calls: 89, errors: 1, time: '2024-01-15' },
  { endpoint: 'GET /analytics', calls: 203, errors: 0, time: '2024-01-15' },
  { endpoint: 'GET /contacts', calls: 445, errors: 5, time: '2024-01-14' },
];

export default function DeveloperPage() {
  const [tab, setTab] = useState<Tab>('api-keys');
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createKey = () => {
    const mockKey = `lak_${Math.random().toString(36).substring(2, 18)}`;
    setNewKey(mockKey);
    setShowKeyForm(false);
    setNewKeyName('');
    setSelectedScopes([]);
  };

  const copyKey = async () => {
    if (newKey) {
      await navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <Code2 className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Developer Portal</h1>
            <p className="text-slate-500 text-sm">API keys, webhooks, and usage statistics</p>
          </div>
        </div>
        <a href="#" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium">
          <ExternalLink className="w-4 h-4" /> API Documentation
        </a>
      </div>

      {/* New Key Banner */}
      {newKey && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm font-semibold text-amber-800 mb-2">⚠️ Copy your API key now — it won&apos;t be shown again</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-mono text-slate-900 overflow-x-auto">{newKey}</code>
            <button onClick={copyKey} className="flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        {[{ id: 'api-keys', label: 'API Keys' }, { id: 'webhooks', label: 'Webhooks' }, { id: 'usage', label: 'Usage Stats' }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as Tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'api-keys' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowKeyForm(!showKeyForm)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> Create Key
            </button>
          </div>

          {showKeyForm && (
            <div className="mb-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-semibold text-slate-900 mb-4">New API Key</h3>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Key Name</label>
                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Production App" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Scopes</label>
                <div className="flex flex-wrap gap-2">
                  {SCOPES.map((s) => (
                    <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={selectedScopes.includes(s)} onChange={(e) => {
                        setSelectedScopes((ss) => e.target.checked ? [...ss, s] : ss.filter((x) => x !== s));
                      }} className="rounded" />
                      <span className="text-xs text-slate-700">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={createKey} disabled={!newKeyName} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                Generate Key
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  {['Name', 'Key Prefix', 'Scopes', 'Rate Limit', 'Created', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_KEYS.map((key) => (
                  <tr key={key.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{key.name}</td>
                    <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-2 py-1 rounded">{key.prefix}...</code></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {key.scopes.map((s) => <span key={s} className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">{s}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{key.rateLimit}/hr</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{key.createdAt}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'webhooks' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowWebhookForm(!showWebhookForm)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> Add Webhook
            </button>
          </div>

          {showWebhookForm && (
            <div className="mb-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-semibold text-slate-900 mb-4">New Webhook</h3>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Endpoint URL</label>
                <input className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://yourapp.com/webhook" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Events to subscribe</label>
                <div className="flex flex-wrap gap-2">
                  {EVENTS.map((ev) => (
                    <label key={ev} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={selectedEvents.includes(ev)} onChange={(e) => {
                        setSelectedEvents((es) => e.target.checked ? [...es, ev] : es.filter((x) => x !== ev));
                      }} className="rounded" />
                      <span className="text-xs text-slate-700">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowWebhookForm(false)} disabled={!webhookUrl} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                Subscribe
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  {['URL', 'Events', 'Deliveries', 'Failures', 'Last Delivered', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_WEBHOOKS.map((wh) => (
                  <tr key={wh.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900 max-w-48 truncate">{wh.url}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {wh.events.map((e) => <span key={e} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{e}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-green-700 font-medium">{wh.deliveryCount}</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-medium">{wh.failureCount}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{wh.lastDelivered}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'usage' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total API Calls', value: '12,450', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Calls Today', value: '843', color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Error Rate', value: '0.7%', color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Active Keys', value: '2', color: 'text-green-600', bg: 'bg-green-50' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-slate-900 mb-3">Recent API Activity</h3>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  {['Endpoint', 'Calls', 'Errors', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_ACTIVITY.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-2 py-1 rounded">{a.endpoint}</code></td>
                    <td className="px-4 py-3 text-sm text-slate-700">{a.calls}</td>
                    <td className="px-4 py-3 text-sm text-red-600">{a.errors}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
