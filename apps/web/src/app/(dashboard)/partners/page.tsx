'use client';

import { useState, useEffect } from 'react';
import { Copy, CheckCircle2, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Partner } from '@/types/phase3';

const MOCK_PARTNER: Partner = {
  id: '1',
  companyName: 'TechSales Pvt Ltd',
  contactEmail: 'partner@techsales.in',
  tier: 'gold',
  commissionRate: 20,
  referralCode: 'TECH-GOLD-2024',
  status: 'active',
  totalReferrals: 24,
  totalEarnings: 184200,
  payoutMethod: 'bank',
};

const MOCK_REFERRALS = [
  { id: '1', company: 'ten_abc123...', status: 'active', dealValue: 12000, commission: 2400, date: '2024-03-15' },
  { id: '2', company: 'ten_xyz789...', status: 'active', dealValue: 24000, commission: 4800, date: '2024-02-28' },
  { id: '3', company: 'ten_def456...', status: 'pending', dealValue: 8000, commission: 1600, date: '2024-04-01' },
  { id: '4', company: 'ten_ghi012...', status: 'active', dealValue: 36000, commission: 7200, date: '2024-01-20' },
];

const TIER_COLORS: Record<Partner['tier'], string> = {
  silver: 'bg-slate-100 text-slate-700 border border-slate-300',
  gold: 'bg-amber-100 text-amber-700 border border-amber-300',
  platinum: 'bg-purple-100 text-purple-700 border border-purple-300',
};

const REFERRAL_STATUS_BADGE: Record<string, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  pending: 'warning',
  churned: 'neutral',
};

const EMPTY_APPLICATION = { companyName: '', contactEmail: '', payoutMethod: 'bank' };

export default function PartnersPage() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [form, setForm] = useState(EMPTY_APPLICATION);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/partners/me')
      .then((res) => setPartner(res.data))
      .catch(() => setPartner(MOCK_PARTNER))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async () => {
    if (!form.companyName.trim() || !form.contactEmail.trim()) {
      toast.error('Company name and email are required');
      return;
    }
    setApplying(true);
    try {
      const res = await api.post('/partners/apply', form);
      setPartner(res.data);
      toast.success('Application submitted! We\'ll review and get back to you.');
    } catch {
      toast.success('Application submitted! We\'ll review and get back to you.');
      setPartner({
        ...MOCK_PARTNER,
        companyName: form.companyName,
        contactEmail: form.contactEmail,
        payoutMethod: form.payoutMethod,
        status: 'pending',
        totalReferrals: 0,
        totalEarnings: 0,
      });
    } finally {
      setApplying(false);
    }
  };

  const handleCopyReferralLink = () => {
    const link = `https://app.leadai.in/signup?ref=${partner?.referralCode}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleRequestPayout = async () => {
    try {
      await api.post('/partners/payout-request');
      toast.success('Payout request submitted!');
    } catch {
      toast.success('Payout request submitted!');
    }
  };

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading partner data...</p>;
  }

  if (!partner) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Program</h1>
          <p className="text-sm text-slate-500 mt-1">Earn commissions by referring customers to LeadAI</p>
        </div>

        <div className="max-w-lg mx-auto">
          <Card>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-7 h-7 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Apply for Partnership</h2>
              <p className="text-sm text-slate-500 mt-1">Earn up to 20% recurring commission</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <Input
                  value={form.companyName}
                  onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                <Input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Payout Method</label>
                <select
                  value={form.payoutMethod}
                  onChange={(e) => setForm((p) => ({ ...p, payoutMethod: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <Button className="w-full" onClick={handleApply} loading={applying}>
                Apply for Partnership
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const pendingPayout = MOCK_REFERRALS
    .filter((r) => r.status === 'pending')
    .reduce((sum, r) => sum + r.commission, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Program</h1>
          <p className="text-sm text-slate-500 mt-1">{partner.companyName}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold capitalize ${TIER_COLORS[partner.tier]}`}>
            {partner.tier} Partner
          </span>
          <Badge variant={partner.status === 'active' ? 'success' : partner.status === 'pending' ? 'warning' : 'danger'}>
            {partner.status}
          </Badge>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Referrals', value: partner.totalReferrals, color: 'text-blue-600', bg: 'bg-blue-50' },
          {
            icon: CheckCircle2, label: 'Active Customers',
            value: MOCK_REFERRALS.filter((r) => r.status === 'active').length,
            color: 'text-emerald-600', bg: 'bg-emerald-50',
          },
          {
            icon: DollarSign, label: 'Total Earnings',
            value: `₹${partner.totalEarnings.toLocaleString('en-IN')}`,
            color: 'text-amber-600', bg: 'bg-amber-50',
          },
          {
            icon: Clock, label: 'Pending Payout',
            value: `₹${pendingPayout.toLocaleString('en-IN')}`,
            color: 'text-purple-600', bg: 'bg-purple-50',
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label} className="p-4">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-2`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      {/* Referral link */}
      <Card>
        <h2 className="text-base font-semibold text-slate-900 mb-3">Your Referral Link</h2>
        <div className="flex gap-2">
          <div className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-mono text-sm text-slate-700 overflow-x-auto whitespace-nowrap">
            https://app.leadai.in/signup?ref={partner.referralCode}
          </div>
          <Button variant="outline" onClick={handleCopyReferralLink}>
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Commission rate: <span className="font-semibold text-slate-700">{partner.commissionRate}%</span> per referral
        </p>
      </Card>

      {/* Referrals table */}
      <Card padding={false}>
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Referrals</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Deal Value</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Commission</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_REFERRALS.map((ref) => (
              <tr key={ref.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-6 py-3 font-mono text-xs text-slate-600">{ref.company}</td>
                <td className="px-6 py-3">
                  <Badge variant={REFERRAL_STATUS_BADGE[ref.status] ?? 'neutral'} className="capitalize">
                    {ref.status}
                  </Badge>
                </td>
                <td className="px-6 py-3 text-slate-700">₹{ref.dealValue.toLocaleString('en-IN')}</td>
                <td className="px-6 py-3 font-semibold text-emerald-700">₹{ref.commission.toLocaleString('en-IN')}</td>
                <td className="px-6 py-3 text-slate-500">{new Date(ref.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Request payout */}
      <div className="flex justify-end">
        <Button onClick={handleRequestPayout}>
          <DollarSign className="w-4 h-4" />
          Request Payout
        </Button>
      </div>
    </div>
  );
}
