'use client';

import { useState } from 'react';
import { Lock, Copy, Check, Zap } from 'lucide-react';

const PROVIDERS = [
  { id: 'okta', name: 'Okta', icon: '🔷', fields: ['clientId', 'clientSecret'] },
  { id: 'azure_ad', name: 'Azure AD', icon: '☁️', fields: ['clientId', 'clientSecret', 'tenantDomain'] },
  { id: 'google_workspace', name: 'Google Workspace', icon: '🌐', fields: ['clientId', 'clientSecret'] },
  { id: 'saml', name: 'Custom SAML', icon: '🔒', fields: ['metadataUrl'] },
  { id: 'oidc', name: 'Custom OIDC', icon: '⚙️', fields: ['clientId', 'clientSecret', 'metadataUrl'] },
];

const CALLBACK_URL = 'https://app.leadai.io/auth/sso/callback';

const MOCK_SESSIONS = [
  { provider: 'google_workspace', email: 'admin@company.com', name: 'Admin User', lastLogin: '2024-01-15 10:30' },
  { provider: 'okta', email: 'john@company.com', name: 'John Smith', lastLogin: '2024-01-15 09:15' },
  { provider: 'azure_ad', email: 'jane@company.com', name: 'Jane Doe', lastLogin: '2024-01-14 16:45' },
];

const FIELD_LABELS: Record<string, string> = {
  clientId: 'Client ID',
  clientSecret: 'Client Secret',
  tenantDomain: 'Tenant Domain',
  metadataUrl: 'Metadata URL',
};

export default function SsoPage() {
  const [provider, setProvider] = useState('okta');
  const [config, setConfig] = useState({ clientId: '', clientSecret: '', tenantDomain: '', metadataUrl: '' });
  const [isActive, setIsActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedProvider = PROVIDERS.find((p) => p.id === provider)!;

  const copyCallback = async () => {
    await navigator.clipboard.writeText(CALLBACK_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    await new Promise((r) => setTimeout(r, 800));
    setTestResult({ success: true, message: 'SSO connection test successful (mock)' });
    setTesting(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Lock className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Enterprise SSO</h1>
          <p className="text-slate-500 text-sm">Configure single sign-on for your organization</p>
        </div>
      </div>

      {/* Provider Selector */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Select Identity Provider</h2>
        <div className="grid grid-cols-5 gap-3">
          {PROVIDERS.map((p) => (
            <button key={p.id} onClick={() => setProvider(p.id)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${provider === p.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
              <div className="text-xl mb-1">{p.icon}</div>
              <div className="text-xs font-medium text-slate-700">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Config Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 mb-4">
        {selectedProvider.fields.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{FIELD_LABELS[field]}</label>
            <input
              type={field === 'clientSecret' ? 'password' : 'text'}
              value={config[field as keyof typeof config]}
              onChange={(e) => setConfig((c) => ({ ...c, [field]: e.target.value }))}
              placeholder={field === 'metadataUrl' ? 'https://provider.com/app/metadata.xml' : `Enter ${FIELD_LABELS[field]}`}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}

        {/* Callback URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Callback URL (read-only)</label>
          <div className="flex gap-2">
            <input readOnly value={CALLBACK_URL}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-600 font-mono" />
            <button onClick={copyCallback} className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-indigo-600' : 'bg-slate-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm text-slate-700">Enable SSO</span>
        </div>
      </div>

      {testResult && (
        <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`w-3 h-3 rounded-full ${testResult.success ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-slate-700">{testResult.message}</span>
        </div>
      )}

      <div className="flex gap-3 mb-8">
        <button onClick={handleTest} disabled={testing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium disabled:opacity-50">
          <Zap className="w-4 h-4" />{testing ? 'Testing...' : 'Test Connection'}
        </button>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
          {saved ? '✓ Saved' : 'Save Configuration'}
        </button>
      </div>

      {/* SSO Sessions */}
      <h2 className="font-semibold text-slate-900 mb-3">Recent SSO Sessions</h2>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              {['Provider', 'Email', 'Name', 'Last Login'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_SESSIONS.map((s, i) => {
              const p = PROVIDERS.find((x) => x.id === s.provider);
              return (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="text-sm">{p?.icon} {p?.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">{s.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{s.lastLogin}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
