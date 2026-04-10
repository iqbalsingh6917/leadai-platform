'use client';

import { useState, useEffect } from 'react';
import { Palette, Save, Globe } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { WhiteLabelConfig } from '@/types/phase3';

const DEFAULT_CONFIG: WhiteLabelConfig = {
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  companyName: 'My Company',
  customDomain: '',
  logoUrl: '',
  favicon: '',
  emailFromName: '',
  emailFromAddress: '',
  isActive: true,
};

export default function WhiteLabelPage() {
  const [config, setConfig] = useState<WhiteLabelConfig>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/white-label')
      .then((res) => setConfig({ ...DEFAULT_CONFIG, ...res.data }))
      .catch(() => {
        // Use defaults silently
      });
  }, []);

  const handleChange = (field: keyof WhiteLabelConfig, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/white-label', config);
      toast.success('White label settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">White Label Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Customize branding for your platform</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">Brand Identity</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <Input
                  value={config.companyName ?? ''}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Custom Domain</label>
                <Input
                  value={config.customDomain ?? ''}
                  onChange={(e) => handleChange('customDomain', e.target.value)}
                  placeholder="app.yourdomain.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                <Input
                  value={config.logoUrl ?? ''}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="https://yourdomain.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Favicon URL</label>
                <Input
                  value={config.favicon ?? ''}
                  onChange={(e) => handleChange('favicon', e.target.value)}
                  placeholder="https://yourdomain.com/favicon.ico"
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">Brand Colors</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    placeholder="#6366f1"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="w-10 h-10 rounded border border-slate-300 cursor-pointer p-0.5"
                  />
                  <Input
                    value={config.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    placeholder="#8b5cf6"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-slate-900 mb-4">Email Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email From Name</label>
                <Input
                  value={config.emailFromName ?? ''}
                  onChange={(e) => handleChange('emailFromName', e.target.value)}
                  placeholder="Support Team"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email From Address</label>
                <Input
                  type="email"
                  value={config.emailFromAddress ?? ''}
                  onChange={(e) => handleChange('emailFromAddress', e.target.value)}
                  placeholder="noreply@yourdomain.com"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <Card>
            <h2 className="text-base font-semibold text-slate-900 mb-4">Live Preview</h2>
            <div className="rounded-lg overflow-hidden border border-slate-200 shadow-md" style={{ height: 420 }}>
              <div className="flex h-full">
                {/* Mini sidebar */}
                <div
                  className="w-14 flex flex-col py-3 px-2 gap-2"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  {/* Logo area */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: config.secondaryColor }}
                  >
                    <span className="text-white text-xs font-bold">
                      {(config.companyName ?? 'M').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Nav dots */}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 rounded"
                      style={{
                        backgroundColor: i === 0 ? config.secondaryColor : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  ))}
                </div>
                {/* Content area */}
                <div className="flex-1 bg-slate-50 p-3">
                  <div className="mb-3">
                    <div className="h-3 w-32 rounded bg-slate-300 mb-1" />
                    <div className="h-2 w-20 rounded bg-slate-200" />
                  </div>
                  {/* Header bar */}
                  <div
                    className="h-6 rounded mb-3 flex items-center px-2"
                    style={{ backgroundColor: config.primaryColor, opacity: 0.15 }}
                  />
                  {/* Cards */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-14 bg-white rounded border border-slate-200 p-2">
                        <div
                          className="h-2 w-8 rounded mb-1"
                          style={{ backgroundColor: config.primaryColor, opacity: 0.5 }}
                        />
                        <div className="h-3 w-12 rounded bg-slate-200" />
                      </div>
                    ))}
                  </div>
                  {/* Button */}
                  <div
                    className="h-7 w-24 rounded text-xs text-white flex items-center justify-center text-[10px]"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {config.companyName ?? 'My Company'}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">Live preview updates as you type</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
