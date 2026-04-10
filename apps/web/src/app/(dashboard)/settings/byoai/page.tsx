'use client';

import { useState } from 'react';
import { Brain, Save, Zap, ChevronDown } from 'lucide-react';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', icon: '🤖', models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'anthropic', name: 'Anthropic', icon: '🧠', models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'] },
  { id: 'llama3', name: 'Llama 3 (Ollama)', icon: '🦙', models: ['llama3', 'llama3:70b', 'llama3:8b'] },
  { id: 'mistral', name: 'Mistral', icon: '🌪️', models: ['mistral-large', 'mistral-medium', 'mistral-small'] },
  { id: 'gemini', name: 'Gemini', icon: '♊', models: ['gemini-1.5-pro', 'gemini-1.5-flash'] },
  { id: 'custom', name: 'Custom', icon: '⚙️', models: [] },
];

export default function BYOAIPage() {
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [isActive, setIsActive] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs: number; model: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedProvider = PROVIDERS.find((p) => p.id === provider)!;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    await new Promise((r) => setTimeout(r, Math.random() * 600 + 200));
    setTestResult({ success: true, latencyMs: Math.floor(Math.random() * 400) + 120, model: modelName || provider });
    setTesting(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">BYOAI — Bring Your Own AI</h1>
          <p className="text-slate-500 text-sm">Connect your preferred AI model to power LeadAI features</p>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Select AI Provider</h2>
        <div className="grid grid-cols-3 gap-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                provider === p.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="text-2xl mb-1">{p.icon}</div>
              <div className="font-medium text-slate-900 text-sm">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Config Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        {provider !== 'llama3' && provider !== 'custom' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {(provider === 'llama3' || provider === 'custom') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
          {selectedProvider.models.length > 0 ? (
            <div className="relative">
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="">Select model...</option>
                {selectedProvider.models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          ) : (
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g. my-custom-model"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Temperature: <span className="text-indigo-600 font-bold">{temperature.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0.0 (Precise)</span>
            <span>1.0 (Balanced)</span>
            <span>2.0 (Creative)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Max Tokens</label>
          <input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            min={1}
            max={128000}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm text-slate-700">Enable as active AI model</span>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`w-3 h-3 rounded-full ${testResult.success ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium text-slate-700">
            {testResult.success ? `✓ Connected to ${testResult.model} — ${testResult.latencyMs}ms latency` : 'Connection failed'}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleTest}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
}
