'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Check } from 'lucide-react';

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

const CURRENCY_SYMBOLS: Record<Currency, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

const PLANS = [
  {
    name: 'Starter',
    prices: { INR: { monthly: 2499, annual: 23990 }, USD: { monthly: 29, annual: 278 }, EUR: { monthly: 27, annual: 259 }, GBP: { monthly: 23, annual: 221 } },
    features: ['5 Users', '1,000 Leads', 'Email Campaigns', 'Basic Analytics', 'WhatsApp Integration'],
    color: 'border-slate-200',
    badge: '',
  },
  {
    name: 'Professional',
    prices: { INR: { monthly: 6999, annual: 67190 }, USD: { monthly: 79, annual: 758 }, EUR: { monthly: 73, annual: 701 }, GBP: { monthly: 62, annual: 595 } },
    features: ['20 Users', '10,000 Leads', 'WhatsApp + Email', 'Advanced Analytics', 'AI Copilot', 'Workflows', 'Reports'],
    color: 'border-indigo-500',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    prices: { INR: { monthly: 17499, annual: 167990 }, USD: { monthly: 199, annual: 1910 }, EUR: { monthly: 183, annual: 1757 }, GBP: { monthly: 156, annual: 1498 } },
    features: ['Unlimited Users', 'Unlimited Leads', 'White Label', 'SSO', 'Priority Support', 'Custom AI Models', 'Dedicated Manager'],
    color: 'border-slate-200',
    badge: '',
  },
];

export default function GlobalBillingPage() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('preferredCurrency') as Currency | null;
    if (stored) setCurrency(stored);
  }, []);

  const handleCurrencyChange = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem('preferredCurrency', c);
  };

  const sym = CURRENCY_SYMBOLS[currency];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Global Plans</h1>
          <p className="text-slate-500 text-sm">Pricing in your local currency</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
          {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCurrencyChange(c)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${currency === c ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {CURRENCY_SYMBOLS[c]} {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <span className={`text-sm ${!annual ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${annual ? 'bg-indigo-600' : 'bg-slate-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${annual ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className={`text-sm ${annual ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
            Annual <span className="text-green-600 font-bold">−20%</span>
          </span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const price = plan.prices[currency];
          const displayPrice = annual ? price.annual : price.monthly;
          return (
            <div key={plan.name} className={`relative bg-white rounded-2xl border-2 ${plan.color} p-6 flex flex-col`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-slate-900">{sym}{displayPrice.toLocaleString()}</span>
                <span className="text-slate-500 text-sm">/{annual ? 'year' : 'month'}</span>
              </div>
              {annual && (
                <p className="text-xs text-green-600 font-medium mb-3">
                  Save {sym}{(price.monthly * 12 - price.annual).toLocaleString()} vs monthly
                </p>
              )}
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${plan.badge ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                Upgrade to {plan.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
