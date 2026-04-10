'use client';

import { useState } from 'react';
import { Store, Star, Download, Search, Plus, Power, Trash2 } from 'lucide-react';

type Category = 'all' | 'scoring' | 'communication' | 'analytics' | 'automation' | 'custom';
type PriceFilter = 'all' | 'free' | 'paid';
type ViewTab = 'marketplace' | 'installed';

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  installCount: number;
  isOfficial: boolean;
  tags: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  scoring: 'bg-purple-100 text-purple-700',
  communication: 'bg-blue-100 text-blue-700',
  analytics: 'bg-orange-100 text-orange-700',
  automation: 'bg-green-100 text-green-700',
  custom: 'bg-slate-100 text-slate-700',
};

const MOCK_AGENTS: Agent[] = [
  { id: '1', name: 'LeadScorer Pro', description: 'AI-powered lead scoring using behavioral signals and demographic data', category: 'scoring', price: 0, rating: 4.8, installCount: 2341, isOfficial: true, tags: ['scoring', 'ai'] },
  { id: '2', name: 'Intent Analyzer', description: 'Detects purchase intent from email and chat interactions', category: 'analytics', price: 19, rating: 4.6, installCount: 1823, isOfficial: true, tags: ['intent', 'nlp'] },
  { id: '3', name: 'Deal Coach', description: 'Real-time coaching suggestions during sales calls', category: 'communication', price: 29, rating: 4.7, installCount: 1204, isOfficial: true, tags: ['coaching'] },
  { id: '4', name: 'Revenue Forecaster', description: 'ML-based revenue forecasting with confidence intervals', category: 'analytics', price: 39, rating: 4.5, installCount: 987, isOfficial: true, tags: ['forecasting'] },
  { id: '5', name: 'Sentiment Monitor', description: 'Real-time sentiment analysis across all customer touchpoints', category: 'analytics', price: 0, rating: 4.4, installCount: 3102, isOfficial: true, tags: ['sentiment'] },
  { id: '6', name: 'Auto Drip Builder', description: 'Automatically builds optimal drip sequences based on lead behavior', category: 'automation', price: 19, rating: 4.3, installCount: 756, isOfficial: false, tags: ['drip'] },
  { id: '7', name: 'WhatsApp Responder', description: 'Intelligent auto-responses for WhatsApp conversations', category: 'communication', price: 0, rating: 4.6, installCount: 2891, isOfficial: true, tags: ['whatsapp'] },
  { id: '8', name: 'Pipeline Optimizer', description: 'Identifies bottlenecks and suggests pipeline optimizations', category: 'automation', price: 29, rating: 4.2, installCount: 534, isOfficial: false, tags: ['pipeline'] },
  { id: '9', name: 'Email Subject Tester', description: 'Predicts email open rates for subject lines before sending', category: 'communication', price: 0, rating: 4.5, installCount: 4201, isOfficial: true, tags: ['email'] },
  { id: '10', name: 'Churn Predictor', description: 'Identifies at-risk accounts before they churn', category: 'scoring', price: 49, rating: 4.7, installCount: 892, isOfficial: true, tags: ['churn'] },
  { id: '11', name: 'Contact Enricher', description: 'Auto-enriches contact profiles with social and firmographic data', category: 'automation', price: 0, rating: 4.1, installCount: 1567, isOfficial: false, tags: ['enrichment'] },
  { id: '12', name: 'Meeting Scheduler', description: 'AI-powered meeting time optimization and scheduling', category: 'communication', price: 19, rating: 4.4, installCount: 1089, isOfficial: false, tags: ['scheduling'] },
  { id: '13', name: 'Competitor Tracker', description: 'Monitors competitor mentions in customer conversations', category: 'analytics', price: 39, rating: 4.3, installCount: 423, isOfficial: false, tags: ['competitive'] },
  { id: '14', name: 'Voice Transcriber', description: 'Transcribes and summarizes sales calls with action items', category: 'communication', price: 29, rating: 4.6, installCount: 1345, isOfficial: true, tags: ['transcription'] },
  { id: '15', name: 'Smart Segmentation', description: 'Dynamic audience segmentation using ML clustering', category: 'analytics', price: 0, rating: 4.5, installCount: 2103, isOfficial: true, tags: ['segmentation'] },
  { id: '16', name: 'Follow-up Reminder', description: 'Intelligent follow-up timing recommendations per lead', category: 'automation', price: 0, rating: 4.2, installCount: 3456, isOfficial: false, tags: ['followup'] },
  { id: '17', name: 'Persona Builder', description: 'Auto-generates buyer personas from your CRM data', category: 'scoring', price: 19, rating: 4.0, installCount: 678, isOfficial: false, tags: ['persona'] },
  { id: '18', name: 'Campaign ROI Analyzer', description: 'Real-time ROI calculation across all marketing channels', category: 'analytics', price: 29, rating: 4.4, installCount: 891, isOfficial: true, tags: ['roi'] },
  { id: '19', name: 'Language Translator', description: 'Auto-translates outreach messages to prospect language', category: 'communication', price: 0, rating: 4.3, installCount: 1782, isOfficial: false, tags: ['translation'] },
  { id: '20', name: 'Custom Workflow Bot', description: 'Build custom AI workflows with drag-and-drop interface', category: 'custom', price: 49, rating: 4.1, installCount: 312, isOfficial: false, tags: ['custom'] },
];

export default function AiMarketplacePage() {
  const [viewTab, setViewTab] = useState<ViewTab>('marketplace');
  const [category, setCategory] = useState<Category>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [search, setSearch] = useState('');
  const [installed, setInstalled] = useState<Set<string>>(new Set(['1', '7']));
  const [activeAgents, setActiveAgents] = useState<Set<string>>(new Set(['1', '7']));

  const filtered = MOCK_AGENTS.filter((a) => {
    if (category !== 'all' && a.category !== category) return false;
    if (priceFilter === 'free' && a.price > 0) return false;
    if (priceFilter === 'paid' && a.price === 0) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const installedAgents = MOCK_AGENTS.filter((a) => installed.has(a.id));

  const toggleInstall = (id: string) => {
    setInstalled((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleActive = (id: string) => {
    setActiveAgents((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Marketplace</h1>
            <p className="text-slate-500 text-sm">Discover and install AI agents for your platform</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Publish Agent
        </button>
      </div>

      {/* View Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        {[{ id: 'marketplace', label: `Marketplace (${MOCK_AGENTS.length})` }, { id: 'installed', label: `Installed (${installed.size})` }].map((t) => (
          <button key={t.id} onClick={() => setViewTab(t.id as ViewTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewTab === t.id ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {viewTab === 'marketplace' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 flex-wrap">
              {(['all', 'scoring', 'communication', 'analytics', 'automation', 'custom'] as Category[]).map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${category === c ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
              {(['all', 'free', 'paid'] as PriceFilter[]).map((p) => (
                <button key={p} onClick={() => setPriceFilter(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${priceFilter === p ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>
                  {p}
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agents..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Agent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((agent) => (
              <div key={agent.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CATEGORY_COLORS[agent.category]}`}>{agent.category}</span>
                  {agent.isOfficial && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">Official</span>}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{agent.name}</h3>
                <p className="text-xs text-slate-500 mb-3 flex-1 line-clamp-2">{agent.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{agent.rating}</span>
                  <Download className="w-3.5 h-3.5 ml-1" />
                  <span>{agent.installCount.toLocaleString()}</span>
                  <span className="ml-auto font-semibold text-slate-700">{agent.price === 0 ? 'Free' : `$${agent.price}/mo`}</span>
                </div>
                <button
                  onClick={() => toggleInstall(agent.id)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors ${installed.has(agent.id) ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  {installed.has(agent.id) ? '✓ Installed' : 'Install'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {viewTab === 'installed' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {installedAgents.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No agents installed yet</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  {['Agent', 'Category', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {installedAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 text-sm">{agent.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{agent.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${CATEGORY_COLORS[agent.category]}`}>{agent.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(agent.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${activeAgents.has(agent.id) ? 'bg-green-500' : 'bg-slate-200'}`}>
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${activeAgents.has(agent.id) ? 'translate-x-4' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleInstall(agent.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
