'use client';

import { useState } from 'react';
import { Phone, Plus, Mic, MessageSquare, ChevronDown } from 'lucide-react';

type Tab = 'numbers' | 'calls' | 'stats';

const PROVIDER_COLORS: Record<string, string> = {
  twilio: 'bg-red-100 text-red-700',
  exotel: 'bg-blue-100 text-blue-700',
  plivo: 'bg-purple-100 text-purple-700',
  vonage: 'bg-orange-100 text-orange-700',
};

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  missed: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  answered: 'bg-blue-100 text-blue-700',
  ringing: 'bg-yellow-100 text-yellow-700',
  initiated: 'bg-slate-100 text-slate-600',
};

const SENTIMENT_EMOJI: Record<string, string> = { positive: '😊', neutral: '😐', negative: '😔' };

const MOCK_NUMBERS = [
  { id: '1', number: '+1 555 123 4567', provider: 'twilio', countryCode: '1', capabilities: { voice: true, sms: true, whatsapp: false }, monthlyRent: 15 },
  { id: '2', number: '+91 8800 123 456', provider: 'exotel', countryCode: '91', capabilities: { voice: true, sms: true, whatsapp: true }, monthlyRent: 500 },
];

const MOCK_CALLS = [
  { id: '1', from: '+91 98765 43210', to: '+91 8800 123 456', direction: 'inbound', duration: 185, status: 'completed', sentiment: 'positive', aiSummary: 'Lead expressed strong interest in Professional plan. Follow up with pricing sheet.', createdAt: '2024-01-15 10:30' },
  { id: '2', from: '+91 8800 123 456', to: '+91 87654 32109', direction: 'outbound', duration: 0, status: 'missed', sentiment: null, aiSummary: null, createdAt: '2024-01-15 11:00' },
  { id: '3', from: '+91 76543 21098', to: '+91 8800 123 456', direction: 'inbound', duration: 302, status: 'completed', sentiment: 'neutral', aiSummary: 'Asked about integration with existing CRM. Send API docs.', createdAt: '2024-01-14 15:30' },
  { id: '4', from: '+91 8800 123 456', to: '+91 65432 10987', direction: 'outbound', duration: 78, status: 'answered', sentiment: 'negative', aiSummary: 'Prospect not interested at this time. Mark for re-engagement in Q2.', createdAt: '2024-01-14 14:00' },
];

export default function TelephonyPage() {
  const [tab, setTab] = useState<Tab>('numbers');
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [showProvision, setShowProvision] = useState(false);
  const [provForm, setProvForm] = useState({ provider: 'twilio', countryCode: '1' });

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          <Phone className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Telephony</h1>
          <p className="text-slate-500 text-sm">Phone numbers, call logs, and AI call analytics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        {[{ id: 'numbers', label: 'Phone Numbers' }, { id: 'calls', label: 'Call Logs' }, { id: 'stats', label: 'Stats' }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as Tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'numbers' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowProvision(!showProvision)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> Provision Number
            </button>
          </div>

          {showProvision && (
            <div className="mb-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-semibold text-slate-900 mb-4">Provision New Number</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Provider</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    value={provForm.provider} onChange={(e) => setProvForm((f) => ({ ...f, provider: e.target.value }))}>
                    <option value="twilio">Twilio</option>
                    <option value="exotel">Exotel</option>
                    <option value="plivo">Plivo</option>
                    <option value="vonage">Vonage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country Code</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    value={provForm.countryCode} onChange={(e) => setProvForm((f) => ({ ...f, countryCode: e.target.value }))}>
                    <option value="91">🇮🇳 India (+91)</option>
                    <option value="1">🇺🇸 USA (+1)</option>
                    <option value="44">🇬🇧 UK (+44)</option>
                    <option value="61">🇦🇺 Australia (+61)</option>
                  </select>
                </div>
              </div>
              <button onClick={() => setShowProvision(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                Provision
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  {['Number', 'Provider', 'Capabilities', 'Monthly Cost', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_NUMBERS.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 font-mono">{n.number}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${PROVIDER_COLORS[n.provider]}`}>{n.provider}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {n.capabilities.voice && <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded"><Mic className="w-3 h-3 inline" /> Voice</span>}
                        {n.capabilities.sms && <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded">SMS</span>}
                        {n.capabilities.whatsapp && <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded"><MessageSquare className="w-3 h-3 inline" /> WA</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">₹{n.monthlyRent}/mo</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-red-600 hover:text-red-700 font-medium">Release</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'calls' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                {['From', 'To', 'Direction', 'Duration', 'Status', 'Sentiment', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CALLS.map((call) => (
                <>
                  <tr key={call.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setExpandedCall(expandedCall === call.id ? null : call.id)}>
                    <td className="px-4 py-3 text-xs font-mono text-slate-700">{call.from}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-700">{call.to}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${call.direction === 'inbound' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {call.direction === 'inbound' ? '↓ In' : '↑ Out'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {call.duration > 0 ? `${Math.floor(call.duration / 60)}:${String(call.duration % 60).padStart(2, '0')}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[call.status]}`}>{call.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xl">
                      {call.sentiment ? SENTIMENT_EMOJI[call.sentiment] : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedCall === call.id ? 'rotate-180' : ''}`} />
                    </td>
                  </tr>
                  {expandedCall === call.id && call.aiSummary && (
                    <tr key={`${call.id}-expand`}>
                      <td colSpan={7} className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-semibold text-slate-600">AI Summary: </span>
                            <span className="text-xs text-slate-700">{call.aiSummary}</span>
                          </div>
                          <div className="text-xs text-slate-500">{call.createdAt}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'stats' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Calls', value: '248', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Avg Duration', value: '3:42', color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Answer Rate', value: '78%', color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Missed Today', value: '3', color: 'text-red-600', bg: 'bg-red-50' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-slate-900 mb-3">Provider Breakdown</h3>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {[
              { provider: 'Twilio', calls: 143, color: PROVIDER_COLORS.twilio },
              { provider: 'Exotel', calls: 105, color: PROVIDER_COLORS.exotel },
            ].map((p) => (
              <div key={p.provider} className="flex items-center justify-between px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.color}`}>{p.provider}</span>
                <span className="text-sm text-slate-700">{p.calls} calls</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
