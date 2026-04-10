import { API_BASE_URL } from '@/constants/api';
import type { Lead, Pipeline, Analytics, Notification, User } from '@/types';

export const USE_MOCK = true;

export function mockFallback<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), 400));
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get<T>(path: string, token?: string): Promise<T> {
    return request<T>('GET', path, undefined, token);
  },
  post<T>(path: string, body: unknown, token?: string): Promise<T> {
    return request<T>('POST', path, body, token);
  },
  patch<T>(path: string, body: unknown, token?: string): Promise<T> {
    return request<T>('PATCH', path, body, token);
  },
  del(path: string, token?: string): Promise<void> {
    return request<void>('DELETE', path, undefined, token);
  },
};

// ─── Mock data ───────────────────────────────────────────────────────────────

export const MOCK_LEADS: Lead[] = [
  { id: '1', tenantId: 't1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+919876543210', score: 92, status: 'qualified', source: 'Facebook', assignedTo: 'u1', pipelineStage: 'stage2', tags: ['hot', 'premium'], createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-10T08:30:00Z' },
  { id: '2', tenantId: 't1', name: 'Rahul Verma', email: 'rahul@example.com', phone: '+919845612345', score: 85, status: 'contacted', source: 'Google', assignedTo: 'u1', pipelineStage: 'stage2', tags: ['warm'], createdAt: '2024-06-02T11:00:00Z', updatedAt: '2024-06-09T09:00:00Z' },
  { id: '3', tenantId: 't1', name: 'Anita Patel', email: 'anita@example.com', phone: '+919812345678', score: 78, status: 'contacted', source: 'WhatsApp', assignedTo: 'u2', pipelineStage: 'stage1', tags: ['follow-up'], createdAt: '2024-06-03T09:00:00Z', updatedAt: '2024-06-08T11:00:00Z' },
  { id: '4', tenantId: 't1', name: 'Suresh Kumar', email: 'suresh@example.com', phone: '+919898765432', score: 88, status: 'qualified', source: 'Referral', assignedTo: 'u1', pipelineStage: 'stage3', tags: ['hot', 'enterprise'], createdAt: '2024-06-01T14:00:00Z', updatedAt: '2024-06-10T07:00:00Z' },
  { id: '5', tenantId: 't1', name: 'Meena Joshi', email: 'meena@example.com', phone: '+919765432109', score: 45, status: 'new', source: 'Facebook', assignedTo: 'u2', pipelineStage: 'stage1', tags: [], createdAt: '2024-06-05T10:00:00Z', updatedAt: '2024-06-05T10:00:00Z' },
  { id: '6', tenantId: 't1', name: 'Amit Singh', email: 'amit@example.com', phone: '+919654321098', score: 62, status: 'contacted', source: 'Google', assignedTo: 'u1', pipelineStage: 'stage1', tags: ['sme'], createdAt: '2024-06-04T08:00:00Z', updatedAt: '2024-06-07T14:00:00Z' },
  { id: '7', tenantId: 't1', name: 'Deepa Nair', email: 'deepa@example.com', phone: '+919543210987', score: 91, status: 'qualified', source: 'WhatsApp', assignedTo: 'u1', pipelineStage: 'stage3', tags: ['hot', 'vip'], createdAt: '2024-05-28T10:00:00Z', updatedAt: '2024-06-10T06:00:00Z' },
  { id: '8', tenantId: 't1', name: 'Vikram Rao', email: 'vikram@example.com', phone: '+919432109876', score: 33, status: 'new', source: 'Manual', assignedTo: 'u2', pipelineStage: 'stage1', tags: [], createdAt: '2024-06-06T15:00:00Z', updatedAt: '2024-06-06T15:00:00Z' },
  { id: '9', tenantId: 't1', name: 'Kavya Reddy', email: 'kavya@example.com', phone: '+919321098765', score: 75, status: 'contacted', source: 'Facebook', assignedTo: 'u1', pipelineStage: 'stage2', tags: ['warm', 'sme'], createdAt: '2024-06-03T12:00:00Z', updatedAt: '2024-06-09T10:00:00Z' },
  { id: '10', tenantId: 't1', name: 'Harish Menon', email: 'harish@example.com', phone: '+919210987654', score: 83, status: 'qualified', source: 'Referral', assignedTo: 'u2', pipelineStage: 'stage3', tags: ['hot'], createdAt: '2024-06-02T09:00:00Z', updatedAt: '2024-06-10T05:00:00Z' },
  { id: '11', tenantId: 't1', name: 'Sunita Gupta', email: 'sunita@example.com', phone: '+919109876543', score: 55, status: 'contacted', source: 'Google', assignedTo: 'u1', pipelineStage: 'stage2', tags: ['mid'], createdAt: '2024-06-04T10:00:00Z', updatedAt: '2024-06-08T09:00:00Z' },
  { id: '12', tenantId: 't1', name: 'Ravi Tiwari', email: 'ravi@example.com', phone: '+919098765432', score: 20, status: 'new', source: 'Facebook', assignedTo: 'u2', pipelineStage: 'stage1', tags: [], createdAt: '2024-06-07T10:00:00Z', updatedAt: '2024-06-07T10:00:00Z' },
  { id: '13', tenantId: 't1', name: 'Pooja Iyer', email: 'pooja@example.com', phone: '+918987654321', score: 95, status: 'converted', source: 'WhatsApp', assignedTo: 'u1', pipelineStage: 'stage4', tags: ['won', 'enterprise'], createdAt: '2024-05-20T10:00:00Z', updatedAt: '2024-06-05T10:00:00Z' },
  { id: '14', tenantId: 't1', name: 'Nikhil Desai', email: 'nikhil@example.com', phone: '+918876543210', score: 68, status: 'contacted', source: 'Manual', assignedTo: 'u1', pipelineStage: 'stage2', tags: ['follow-up'], createdAt: '2024-06-01T16:00:00Z', updatedAt: '2024-06-09T08:00:00Z' },
  { id: '15', tenantId: 't1', name: 'Lakshmi Prasad', email: 'lakshmi@example.com', phone: '+918765432109', score: 80, status: 'qualified', source: 'Google', assignedTo: 'u2', pipelineStage: 'stage3', tags: ['hot', 'premium'], createdAt: '2024-06-02T13:00:00Z', updatedAt: '2024-06-10T04:00:00Z' },
];

export const MOCK_PIPELINES: Pipeline[] = [
  {
    id: 'p1',
    name: 'Main Pipeline',
    stages: [
      { id: 'stage1', name: 'New Lead', color: '#3b82f6', order: 1, leads: MOCK_LEADS.filter(l => l.pipelineStage === 'stage1') },
      { id: 'stage2', name: 'Qualified', color: '#f59e0b', order: 2, leads: MOCK_LEADS.filter(l => l.pipelineStage === 'stage2') },
      { id: 'stage3', name: 'Negotiation', color: '#6366f1', order: 3, leads: MOCK_LEADS.filter(l => l.pipelineStage === 'stage3') },
      { id: 'stage4', name: 'Won', color: '#22c55e', order: 4, leads: MOCK_LEADS.filter(l => l.pipelineStage === 'stage4') },
    ],
  },
];

export const MOCK_ANALYTICS: Analytics = {
  totalLeads: 127,
  activeLeads: 89,
  convertedLeads: 23,
  conversionRate: 18.1,
  revenueThisMonth: 240000,
  aiAutomationRate: 76,
  topStages: [
    { name: 'New Lead', count: 48 },
    { name: 'Qualified', count: 35 },
    { name: 'Negotiation', count: 21 },
    { name: 'Won', count: 23 },
  ],
  recentActivity: [
    { label: 'Priya Sharma moved to Negotiation', time: '2 hours ago' },
    { label: 'AI scored 5 new leads', time: '4 hours ago' },
    { label: 'Deepa Nair called — no answer', time: '5 hours ago' },
    { label: 'Harish Menon signed contract', time: 'Yesterday' },
    { label: 'Suresh Kumar requested demo', time: 'Yesterday' },
  ],
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'hot_lead', title: '🔥 Hot Lead Alert', body: 'Priya Sharma score jumped to 92 — call now!', isRead: false, createdAt: '2024-06-10T08:30:00Z' },
  { id: 'n2', type: 'pipeline', title: '📋 Stage Update', body: 'Suresh Kumar moved to Negotiation stage', isRead: false, createdAt: '2024-06-10T07:00:00Z' },
  { id: 'n3', type: 'ai_insight', title: '🤖 AI Insight', body: '3 leads haven\'t been contacted in 7 days', isRead: false, createdAt: '2024-06-10T06:00:00Z' },
  { id: 'n4', type: 'hot_lead', title: '🔥 Hot Lead Alert', body: 'Deepa Nair is revisiting your proposal page', isRead: true, createdAt: '2024-06-09T15:00:00Z' },
  { id: 'n5', type: 'pipeline', title: '📋 Deal Won!', body: 'Pooja Iyer converted — ₹45,000 deal closed 🎉', isRead: true, createdAt: '2024-06-09T12:00:00Z' },
  { id: 'n6', type: 'ai_insight', title: '🤖 Weekly Summary', body: 'Pipeline velocity increased by 12% this week', isRead: true, createdAt: '2024-06-09T09:00:00Z' },
  { id: 'n7', type: 'system', title: '⚙️ System', body: 'AI scoring model updated with latest data', isRead: true, createdAt: '2024-06-08T10:00:00Z' },
  { id: 'n8', type: 'hot_lead', title: '🔥 Hot Lead Alert', body: 'Harish Menon opened your email 3 times today', isRead: true, createdAt: '2024-06-08T08:00:00Z' },
];

export const MOCK_USER: User = {
  id: 'u1',
  email: 'demo@leadai.io',
  name: 'Alex Johnson',
  role: 'admin',
};
