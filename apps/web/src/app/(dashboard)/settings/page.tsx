'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { MessageSquare, Mail, TrendingUp, Send } from 'lucide-react';

type Tab = 'profile' | 'team' | 'integrations' | 'billing';

const tabs: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'team', label: 'Team' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'billing', label: 'Billing' },
];

const mockTeam = [
  { id: '1', name: 'Arjun Sharma', email: 'arjun@company.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Priya Patel', email: 'priya@company.com', role: 'Manager', status: 'active' },
  { id: '3', name: 'Rahul Gupta', email: 'rahul@company.com', role: 'Agent', status: 'invited' },
];

const integrations = [
  { name: 'WhatsApp Business', description: 'Send automated messages and receive lead inquiries via WhatsApp', icon: MessageSquare, color: 'bg-emerald-500', connected: false },
  { name: 'Google Ads', description: 'Automatically import leads from your Google Ads campaigns', icon: TrendingUp, color: 'bg-blue-500', connected: false },
  { name: 'Meta Ads', description: 'Import leads from Facebook and Instagram ad campaigns', icon: TrendingUp, color: 'bg-indigo-500', connected: false },
  { name: 'SendGrid', description: 'Send transactional and marketing emails via SendGrid', icon: Send, color: 'bg-cyan-500', connected: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [inviteEmail, setInviteEmail] = useState('');

  function handleSaveProfile() {
    if (user) {
      updateUser({ ...user, ...profileForm });
      toast.success('Profile updated successfully');
    }
  }

  function handleInvite() {
    if (!inviteEmail) return;
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
  }

  return (
    <div className="max-w-4xl">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-6">Profile Settings</h3>
          <div className="flex items-center gap-4 mb-6">
            <Avatar firstName={user?.firstName || 'U'} lastName={user?.lastName} size="lg" />
            <div>
              <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-4 max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
            <Input
              label="Phone"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            />
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        </Card>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-4">Team Members</h3>
            <div className="space-y-3">
              {mockTeam.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar firstName={member.name.split(' ')[0]} lastName={member.name.split(' ')[1]} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{member.role}</span>
                    <Badge variant={member.status === 'active' ? 'success' : 'warning'} className="capitalize">
                      {member.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-4">Invite Member</h3>
            <div className="flex gap-3 max-w-md">
              <Input
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                type="email"
              />
              <Button onClick={handleInvite}>Invite</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.name}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${integration.color} flex-shrink-0`}>
                  <integration.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900">{integration.name}</h4>
                    <Badge variant={integration.connected ? 'success' : 'neutral'}>
                      {integration.connected ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 mb-3">{integration.description}</p>
                  <Button variant="outline" size="sm">
                    {integration.connected ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-4">
          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-4">Current Plan</h3>
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div>
                <p className="text-base font-bold text-indigo-900">Starter Plan</p>
                <p className="text-sm text-indigo-600">₹2,999/month · Up to 5 users · 1,000 leads</p>
              </div>
              <Button>Upgrade Plan</Button>
            </div>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-slate-900 mb-4">Usage</h3>
            <div className="space-y-3">
              {[
                { label: 'Leads', used: 284, limit: 1000 },
                { label: 'Contacts', used: 156, limit: 2000 },
                { label: 'Campaigns', used: 4, limit: 10 },
                { label: 'Team Members', used: 3, limit: 5 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-500">{item.used} / {item.limit}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${Math.min(100, (item.used / item.limit) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
