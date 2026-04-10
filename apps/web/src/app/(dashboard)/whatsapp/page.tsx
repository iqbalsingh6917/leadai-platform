'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  useWhatsAppConfig,
  useSaveConfig,
  useTestConnection,
  useWhatsAppMessages,
} from '@/hooks/useWhatsApp';

type Tab = 'config' | 'messages';

function StatusBadge({ status }: { status?: string }) {
  if (status === 'connected') return <Badge variant="success">Connected</Badge>;
  if (status === 'failed') return <Badge variant="danger">Failed</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

export default function WhatsAppPage() {
  const [tab, setTab] = useState<Tab>('config');
  const [directionFilter, setDirectionFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const { data: config, isLoading: configLoading } = useWhatsAppConfig();
  const saveConfig = useSaveConfig();
  const testConnection = useTestConnection();
  const { data: messagesData } = useWhatsAppMessages(
    directionFilter ? { direction: directionFilter } : undefined,
  );

  const [form, setForm] = useState({
    phoneNumberId: '',
    wabaId: '',
    accessToken: '',
  });

  const tenantId = config?.tenantId ?? 'YOUR_TENANT_ID';
  const webhookUrl = `https://your-api.leadai.in/whatsapp/webhook/${tenantId}`;

  const handleCopyVerifyToken = async () => {
    if (config?.verifyToken) {
      await navigator.clipboard.writeText(config.verifyToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveConfig.mutateAsync(form);
      toast.success('Configuration saved');
    } catch {
      toast.error('Failed to save configuration');
    }
  };

  const handleTest = async () => {
    try {
      const result = await testConnection.mutateAsync();
      if (result.connected) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Connection test failed');
    }
  };

  const messages = messagesData?.data ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {(['config', 'messages'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t === 'config' ? 'Configuration' : 'Messages'}
          </button>
        ))}
      </div>

      {tab === 'config' && (
        <div className="space-y-4">
          {/* Status banner */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Connection Status</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your WhatsApp Business API integration
                </p>
              </div>
              {configLoading ? (
                <Badge variant="neutral">Loading...</Badge>
              ) : (
                <StatusBadge status={config?.status} />
              )}
            </div>
          </Card>

          {/* Info box */}
          <div className="rounded-md bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
            Get these credentials from{' '}
            <strong>Meta Business Suite → WhatsApp → API Setup</strong>
          </div>

          {/* Config form */}
          <Card>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Phone Number ID"
                placeholder="Enter Meta phone number ID"
                value={form.phoneNumberId}
                onChange={(e) => setForm((f) => ({ ...f, phoneNumberId: e.target.value }))}
              />
              <Input
                label="WABA ID"
                placeholder="WhatsApp Business Account ID"
                value={form.wabaId}
                onChange={(e) => setForm((f) => ({ ...f, wabaId: e.target.value }))}
              />
              <Input
                label="Access Token"
                type="password"
                placeholder="Meta permanent access token"
                value={form.accessToken}
                onChange={(e) => setForm((f) => ({ ...f, accessToken: e.target.value }))}
              />

              {config?.verifyToken && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Webhook Verify Token
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-slate-100 rounded-md text-sm font-mono text-slate-800 overflow-auto">
                      {config.verifyToken}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyVerifyToken}
                      className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      title="Copy verify token"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Webhook URL
                </label>
                <code className="block w-full px-3 py-2 bg-slate-100 rounded-md text-sm font-mono text-slate-800 overflow-auto break-all">
                  {webhookUrl}
                </code>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={saveConfig.isPending}>
                  Save Configuration
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTest}
                  loading={testConnection.isPending}
                >
                  Test Connection
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {tab === 'messages' && (
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="flex items-center gap-3">
            <Select
              label=""
              options={[
                { value: '', label: 'All Directions' },
                { value: 'inbound', label: 'Inbound' },
                { value: 'outbound', label: 'Outbound' },
              ]}
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="w-48"
            />
          </div>

          {/* Messages list */}
          {messages.length === 0 ? (
            <Card>
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">No messages found</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => (
                <Card key={msg.id} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-sm text-slate-700 shrink-0">
                        {msg.phoneNumber}
                      </span>
                      <Badge variant={msg.direction === 'inbound' ? 'info' : 'success'}>
                        {msg.direction}
                      </Badge>
                      <Badge
                        variant={
                          msg.status === 'failed'
                            ? 'danger'
                            : msg.status === 'delivered' || msg.status === 'read'
                            ? 'success'
                            : 'neutral'
                        }
                      >
                        {msg.status}
                      </Badge>
                      <p className="text-sm text-slate-600 truncate">
                        {msg.body.length > 60 ? `${msg.body.slice(0, 60)}…` : msg.body}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
