'use client';

import toast from 'react-hot-toast';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePlans, useSubscription, useCreateOrder, useVerifyPayment } from '@/hooks/useBilling';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  trial: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  past_due: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const USAGE = [
  { label: 'Leads', used: 284, total: 1000 },
  { label: 'Contacts', used: 156, total: 2000 },
  { label: 'Campaigns', used: 4, total: 10 },
  { label: 'Users', used: 3, total: 5 },
];

function formatLimit(n: number) {
  return n === -1 ? 'Unlimited' : n.toLocaleString();
}

function formatPrice(price: number) {
  if (price === 0) return 'Contact Sales';
  return `₹${price.toLocaleString('en-IN')}/mo`;
}

export default function BillingPage() {
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: subscription, isLoading: subLoading } = useSubscription();
  const createOrderMutation = useCreateOrder();
  const verifyPaymentMutation = useVerifyPayment();

  const handleUpgrade = async (planId: string) => {
    try {
      const order = await createOrderMutation.mutateAsync({ planId });

      if (typeof (window as any).Razorpay === 'undefined') {
        toast.error('Razorpay unavailable — payment gateway not loaded. Contact support to upgrade.');
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '',
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'LeadAI Platform',
        description: `Upgrade to ${planId} plan`,
        handler: async (response: any) => {
          try {
            await verifyPaymentMutation.mutateAsync({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              planId,
            });
            toast.success('Plan upgraded successfully!');
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
      });
      rzp.open();
    } catch {
      toast.error('Failed to create order. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your plan and usage</p>
      </div>

      {/* Current Plan */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Current Plan</h2>
        </div>
        {subLoading ? (
          <p className="text-slate-500 text-sm">Loading subscription...</p>
        ) : subscription ? (
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xl font-bold text-slate-900 capitalize">{subscription.planId}</span>
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                STATUS_COLORS[subscription.status] ?? 'bg-slate-100 text-slate-600',
              )}
            >
              {subscription.status.replace('_', ' ')}
            </span>
            {subscription.currentPeriodEnd && (
              <span className="text-sm text-slate-500">
                Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            )}
            {subscription.trialEndsAt && subscription.status === 'trial' && (
              <span className="text-sm text-amber-600">
                Trial ends {new Date(subscription.trialEndsAt).toLocaleDateString()}
              </span>
            )}
          </div>
        ) : null}
      </Card>

      {/* Usage */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Usage</h2>
        <div className="space-y-4">
          {USAGE.map((item) => {
            const pct = Math.min(100, Math.round((item.used / item.total) * 100));
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500">
                    {item.used.toLocaleString()} / {item.total.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-indigo-500',
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Plans</h2>
        {plansLoading ? (
          <p className="text-slate-500 text-sm">Loading plans...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(plans ?? []).map((plan) => {
              const isCurrent = subscription?.planId === plan.id;
              return (
                <div
                  key={plan.id}
                  className={cn(
                    'rounded-xl border-2 p-5 flex flex-col gap-4 transition-all',
                    isCurrent
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 bg-white hover:border-indigo-300',
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-slate-900">{plan.name}</h3>
                      {isCurrent && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{formatPrice(plan.price)}</p>
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-600 flex-1">
                    <li>{formatLimit(plan.usersLimit)} users</li>
                    <li>{formatLimit(plan.leadsLimit)} leads</li>
                    <li>{formatLimit(plan.campaignsLimit)} campaigns</li>
                  </ul>
                  {!isCurrent && plan.price > 0 ? (
                    <Button
                      onClick={() => handleUpgrade(plan.id)}
                      loading={createOrderMutation.isPending}
                      size="sm"
                    >
                      Upgrade
                    </Button>
                  ) : isCurrent ? (
                    <Button variant="outline" size="sm" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => toast('Contact sales@leadai.in')}>
                      Contact Sales
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
