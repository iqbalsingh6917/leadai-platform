export interface Lead {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: 'Facebook' | 'Google' | 'WhatsApp' | 'Manual' | 'Referral';
  assignedTo: string;
  pipelineStage: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  leadCount: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
  leads: Lead[];
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
}

export interface Notification {
  id: string;
  type: 'hot_lead' | 'pipeline' | 'ai_insight' | 'system';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'agent';
  avatar?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

export interface Analytics {
  totalLeads: number;
  activeLeads: number;
  convertedLeads: number;
  conversionRate: number;
  revenueThisMonth: number;
  aiAutomationRate: number;
  topStages: { name: string; count: number }[];
  recentActivity: { label: string; time: string }[];
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}
