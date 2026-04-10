'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, Upload, Wifi, Megaphone, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import { useBulkImport } from '@/hooks/useLeads';

const ONBOARDING_KEY = 'onboarding_completed';

export function useOnboarding() {
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const done = localStorage.getItem(ONBOARDING_KEY);
      setShowWizard(!done);
    }
  }, []);

  const completeOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
    setShowWizard(false);
  };

  return { showWizard, completeOnboarding };
}

const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'other', label: 'Other' },
];

const CAMPAIGN_TYPE_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'ads', label: 'Ads' },
];

const STEPS = ['Set Up Your Company', 'Import Your Leads', 'Connect an Integration', 'Create Your First Campaign'];

interface OnboardingWizardProps {
  onComplete: () => void;
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all ${
            i < current ? 'w-6 bg-indigo-600' : i === current ? 'w-6 bg-indigo-400' : 'w-3 bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

function OnboardingWizardInner({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [phone, setPhone] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState('email');
  const [campaignStartDate, setCampaignStartDate] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkImport = useBulkImport();
  const createCampaign = useCreateCampaign();

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    next();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await bulkImport.mutateAsync(formData);
      toast.success(`Imported ${result.imported} leads!`);
      next();
    } catch {
      toast.error('Import failed. Check your CSV and try again.');
    }
  };

  const handleCreateAndFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCampaign.mutateAsync({
        name: campaignName,
        type: campaignType as any,
        startDate: campaignStartDate || undefined,
      });
      toast.success('Campaign created!');
    } catch {
      toast.error('Failed to create campaign.');
    }
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-slate-900">LeadAI Setup</span>
        </div>
        <div className="flex items-center gap-6">
          <StepIndicator current={step} total={STEPS.length} />
          <button
            onClick={onComplete}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            title="Skip setup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">
            Step {step + 1} of {STEPS.length}
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{STEPS[step]}</h2>

          {/* Step 1 */}
          {step === 0 && (
            <form onSubmit={handleCompanySubmit} className="mt-6 space-y-4">
              <p className="text-slate-500">Let&apos;s start by setting up your workspace.</p>
              <Input
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
                required
              />
              <Select
                label="Industry"
                options={INDUSTRY_OPTIONS}
                placeholder="Select industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              <Input
                label="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                type="tel"
              />
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div className="mt-6 space-y-4">
              <p className="text-slate-500">Upload a CSV file to import your existing leads instantly.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="font-medium text-slate-700">Click to upload CSV</p>
                <p className="text-xs text-slate-400 mt-1">firstName, lastName, email, phone, company columns</p>
              </div>
              <Button
                loading={bulkImport.isPending}
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4" />
                Upload CSV
              </Button>
              <button
                onClick={next}
                className="w-full text-sm text-slate-500 hover:text-slate-700 underline transition-colors"
              >
                Skip for now
              </button>
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className="mt-6 space-y-4">
              <p className="text-slate-500">Connect your marketing channels to start capturing leads automatically.</p>
              <div className="space-y-3">
                {[
                  { name: 'WhatsApp Business', desc: 'Send automated WhatsApp messages to leads' },
                  { name: 'Google Ads', desc: 'Auto-import leads from Google lead forms' },
                  { name: 'Meta Ads', desc: 'Sync leads from Facebook & Instagram ads' },
                ].map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Wifi className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{integration.name}</p>
                        <p className="text-xs text-slate-500">{integration.desc}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast('Coming soon! Contact support to set this up.')}
                    >
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
              <button
                onClick={next}
                className="w-full text-sm text-slate-500 hover:text-slate-700 underline transition-colors"
              >
                Skip for now
              </button>
            </div>
          )}

          {/* Step 4 */}
          {step === 3 && (
            <form onSubmit={handleCreateAndFinish} className="mt-6 space-y-4">
              <p className="text-slate-500">You&apos;re almost there! Create your first campaign to start reaching leads.</p>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">Your workspace is ready to go!</p>
              </div>
              <Input
                label="Campaign Name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="My First Campaign"
                required
              />
              <Select
                label="Campaign Type"
                options={CAMPAIGN_TYPE_OPTIONS}
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value)}
              />
              <Input
                label="Start Date (optional)"
                type="date"
                value={campaignStartDate}
                onChange={(e) => setCampaignStartDate(e.target.value)}
              />
              <Button type="submit" loading={createCampaign.isPending} className="w-full">
                <Megaphone className="w-4 h-4" />
                Create & Finish
              </Button>
              <button
                type="button"
                onClick={onComplete}
                className="w-full text-sm text-slate-500 hover:text-slate-700 underline transition-colors"
              >
                Skip & Finish
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function OnboardingWizard() {
  const { showWizard, completeOnboarding } = useOnboarding();

  if (!showWizard) return null;

  return <OnboardingWizardInner onComplete={completeOnboarding} />;
}
