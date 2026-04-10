'use client';

import { useState } from 'react';
import { Shield, Plus, Check, AlertTriangle } from 'lucide-react';

type Tab = 'consents' | 'requests' | 'summary';

const MOCK_CONSENTS = [
  { id: '1', subject: 'john@example.com', type: 'marketing', status: 'granted', date: '2024-01-15' },
  { id: '2', subject: '+91 98765 43210', type: 'data_processing', status: 'granted', date: '2024-01-14' },
  { id: '3', subject: 'jane@example.com', type: 'analytics', status: 'withdrawn', date: '2024-01-13' },
  { id: '4', subject: 'bob@example.com', type: 'third_party_sharing', status: 'granted', date: '2024-01-12' },
];

const MOCK_REQUESTS = [
  { id: '1', email: 'user1@example.com', type: 'access', status: 'pending', date: '2024-01-15' },
  { id: '2', email: 'user2@example.com', type: 'deletion', status: 'completed', date: '2024-01-10' },
  { id: '3', email: 'user3@example.com', type: 'portability', status: 'processing', date: '2024-01-08' },
];

const CHECKLIST = [
  { label: 'Privacy policy published', done: true },
  { label: 'Cookie consent banner active', done: true },
  { label: 'Data retention policy defined', done: true },
  { label: 'DSAR process configured', done: false },
  { label: 'Data processing agreements signed', done: true },
  { label: 'Breach notification procedure', done: false },
  { label: 'Data protection officer assigned', done: false },
  { label: 'Employee data training completed', done: true },
];

const STATUS_COLORS: Record<string, string> = {
  granted: 'bg-green-100 text-green-700',
  withdrawn: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function CompliancePage() {
  const [tab, setTab] = useState<Tab>('consents');

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance Center</h1>
          <p className="text-slate-500 text-sm">GDPR / HIPAA / CCPA compliance management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        {[
          { id: 'consents', label: 'Consent Manager' },
          { id: 'requests', label: 'Data Requests' },
          { id: 'summary', label: 'Summary' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'consents' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-900">Consent Records</h2>
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> Record Consent
            </button>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  {['Data Subject', 'Consent Type', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_CONSENTS.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{c.subject}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 capitalize">{c.type.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'requests' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-900">Data Subject Access Requests (DSARs)</h2>
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> New Request
            </button>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  {['Requestor', 'Type', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_REQUESTS.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{r.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 capitalize">{r.type}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'summary' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Granted Consents', value: MOCK_CONSENTS.filter((c) => c.status === 'granted').length, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Withdrawn Consents', value: MOCK_CONSENTS.filter((c) => c.status === 'withdrawn').length, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Pending Requests', value: MOCK_REQUESTS.filter((r) => r.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Completed Requests', value: MOCK_REQUESTS.filter((r) => r.status === 'completed').length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-slate-900 mb-3">Compliance Readiness Checklist</h3>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {CHECKLIST.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-slate-700">{item.label}</span>
                {item.done ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><Check className="w-3.5 h-3.5" /> Done</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-yellow-600 font-medium"><AlertTriangle className="w-3.5 h-3.5" /> Pending</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-3">
            {CHECKLIST.filter((c) => c.done).length}/{CHECKLIST.length} items completed
          </p>
        </div>
      )}
    </div>
  );
}
