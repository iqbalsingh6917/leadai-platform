'use client';

import { useState, useEffect } from 'react';
import { Plug, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface IntegrationDef {
  provider: string;
  name: string;
  category: string;
  emoji: string;
  status?: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string;
}

const INTEGRATIONS: IntegrationDef[] = [
  // CRM
  { provider: 'salesforce', name: 'Salesforce', category: 'CRM', emoji: '☁️' },
  { provider: 'hubspot', name: 'HubSpot', category: 'CRM', emoji: '🟠' },
  { provider: 'zoho', name: 'Zoho CRM', category: 'CRM', emoji: '🔵' },
  { provider: 'freshsales', name: 'Freshsales', category: 'CRM', emoji: '🌿' },
  { provider: 'pipedrive', name: 'Pipedrive', category: 'CRM', emoji: '🔴' },
  // Communication
  { provider: 'slack', name: 'Slack', category: 'Communication', emoji: '💬' },
  { provider: 'teams', name: 'Microsoft Teams', category: 'Communication', emoji: '🟣' },
  { provider: 'gmail', name: 'Gmail', category: 'Communication', emoji: '📧' },
  { provider: 'outlook', name: 'Outlook', category: 'Communication', emoji: '📮' },
  { provider: 'twilio', name: 'Twilio', category: 'Communication', emoji: '📱' },
  // Marketing
  { provider: 'mailchimp', name: 'Mailchimp', category: 'Marketing', emoji: '🐒' },
  { provider: 'klaviyo', name: 'Klaviyo', category: 'Marketing', emoji: '📊' },
  { provider: 'brevo', name: 'Brevo', category: 'Marketing', emoji: '💌' },
  { provider: 'activecampaign', name: 'ActiveCampaign', category: 'Marketing', emoji: '⚡' },
  { provider: 'constantcontact', name: 'Constant Contact', category: 'Marketing', emoji: '📩' },
  // Ads
  { provider: 'google-ads', name: 'Google Ads', category: 'Ads', emoji: '🎯' },
  { provider: 'facebook-ads', name: 'Facebook Ads', category: 'Ads', emoji: '👍' },
  { provider: 'linkedin-ads', name: 'LinkedIn Ads', category: 'Ads', emoji: '💼' },
  { provider: 'twitter-ads', name: 'Twitter Ads', category: 'Ads', emoji: '🐦' },
  { provider: 'snapchat-ads', name: 'Snapchat Ads', category: 'Ads', emoji: '👻' },
  // E-commerce
  { provider: 'shopify', name: 'Shopify', category: 'E-commerce', emoji: '🛍️' },
  { provider: 'woocommerce', name: 'WooCommerce', category: 'E-commerce', emoji: '🛒' },
  { provider: 'magento', name: 'Magento', category: 'E-commerce', emoji: '🏪' },
  { provider: 'bigcommerce', name: 'BigCommerce', category: 'E-commerce', emoji: '💰' },
  { provider: 'razorpay', name: 'Razorpay', category: 'E-commerce', emoji: '💳' },
  // Analytics
  { provider: 'google-analytics', name: 'Google Analytics', category: 'Analytics', emoji: '📈' },
  { provider: 'mixpanel', name: 'Mixpanel', category: 'Analytics', emoji: '🔍' },
  { provider: 'amplitude', name: 'Amplitude', category: 'Analytics', emoji: '📉' },
  { provider: 'segment', name: 'Segment', category: 'Analytics', emoji: '🔀' },
  { provider: 'hotjar', name: 'Hotjar', category: 'Analytics', emoji: '🌡️' },
  // Automation
  { provider: 'zapier', name: 'Zapier', category: 'Automation', emoji: '⚡' },
  { provider: 'make', name: 'Make (Integromat)', category: 'Automation', emoji: '🔧' },
  { provider: 'n8n', name: 'n8n', category: 'Automation', emoji: '🤖' },
  { provider: 'pipedream', name: 'Pipedream', category: 'Automation', emoji: '🚰' },
  { provider: 'tray', name: 'Tray.io', category: 'Automation', emoji: '📦' },
  // Data
  { provider: 'airtable', name: 'Airtable', category: 'Data', emoji: '🗂️' },
  { provider: 'notion', name: 'Notion', category: 'Data', emoji: '📝' },
  { provider: 'google-sheets', name: 'Google Sheets', category: 'Data', emoji: '📋' },
  { provider: 'excel', name: 'Excel', category: 'Data', emoji: '📊' },
  { provider: 'snowflake', name: 'Snowflake', category: 'Data', emoji: '❄️' },
  // Support
  { provider: 'zendesk', name: 'Zendesk', category: 'Support', emoji: '🎫' },
  { provider: 'freshdesk', name: 'Freshdesk', category: 'Support', emoji: '🆘' },
  { provider: 'intercom', name: 'Intercom', category: 'Support', emoji: '💬' },
  { provider: 'crisp', name: 'Crisp', category: 'Support', emoji: '🗨️' },
  { provider: 'drift', name: 'Drift', category: 'Support', emoji: '💭' },
  // Video
  { provider: 'zoom', name: 'Zoom', category: 'Video', emoji: '📹' },
  { provider: 'google-meet', name: 'Google Meet', category: 'Video', emoji: '🎥' },
  { provider: 'calendly', name: 'Calendly', category: 'Video', emoji: '📅' },
  { provider: 'cal', name: 'Cal.com', category: 'Video', emoji: '🗓️' },
  { provider: 'loom', name: 'Loom', category: 'Video', emoji: '🎬' },
];

const CATEGORIES = ['All', ...Array.from(new Set(INTEGRATIONS.map((i) => i.category)))];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationDef[]>(
    INTEGRATIONS.map((i) => ({ ...i, status: 'disconnected' as const }))
  );
  const [activeCategory, setActiveCategory] = useState('All');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    api.get('/integrations')
      .then((res) => {
        const connected: { provider: string; status: string; lastSyncAt?: string }[] = res.data ?? [];
        setIntegrations((prev) =>
          prev.map((item) => {
            const match = connected.find((c) => c.provider === item.provider);
            if (match) {
              return {
                ...item,
                status: match.status as 'connected' | 'disconnected' | 'error',
                lastSyncAt: match.lastSyncAt,
              };
            }
            return item;
          })
        );
      })
      .catch(() => {
        // Keep all disconnected
      });
  }, []);

  const handleConnect = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await api.post(`/integrations/${provider}/connect`);
      setIntegrations((prev) =>
        prev.map((i) => (i.provider === provider ? { ...i, status: 'connected' } : i))
      );
      toast.success(`Connected to ${provider}`);
    } catch {
      toast.error(`Failed to connect ${provider}`);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleDisconnect = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await api.delete(`/integrations/${provider}/disconnect`);
      setIntegrations((prev) =>
        prev.map((i) => (i.provider === provider ? { ...i, status: 'disconnected' } : i))
      );
      toast.success(`Disconnected ${provider}`);
    } catch {
      toast.error(`Failed to disconnect ${provider}`);
    } finally {
      setLoadingProvider(null);
    }
  };

  const filtered =
    activeCategory === 'All'
      ? integrations
      : integrations.filter((i) => i.category === activeCategory);

  const connectedCount = integrations.filter((i) => i.status === 'connected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Integration Marketplace</h1>
          <p className="text-sm text-slate-500 mt-1">
            {connectedCount} of {integrations.length} integrations connected
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1 text-xs opacity-70">
                ({integrations.filter((i) => i.category === cat && i.status === 'connected').length}/
                {integrations.filter((i) => i.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const isConnected = item.status === 'connected';
          const isLoading = loadingProvider === item.provider;
          return (
            <Card key={item.provider} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{item.name}</p>
                    <Badge variant="neutral" className="text-xs mt-0.5">{item.category}</Badge>
                  </div>
                </div>
                {isConnected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <Badge variant={isConnected ? 'success' : 'neutral'}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
                {isConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    loading={isLoading}
                    onClick={() => handleDisconnect(item.provider)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    loading={isLoading}
                    onClick={() => handleConnect(item.provider)}
                  >
                    <Plug className="w-3 h-3" />
                    Connect
                  </Button>
                )}
              </div>
              {item.lastSyncAt && (
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Synced {new Date(item.lastSyncAt).toLocaleDateString()}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
