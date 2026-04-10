import { api, USE_MOCK, mockFallback, MOCK_LEADS } from './api';
import type { Lead } from '@/types';

interface LeadFilters {
  status?: Lead['status'];
  source?: Lead['source'];
  minScore?: number;
}

export const leadsService = {
  async getLeads(token: string, filters?: LeadFilters): Promise<Lead[]> {
    if (USE_MOCK) {
      let leads = [...MOCK_LEADS];
      if (filters?.status) leads = leads.filter(l => l.status === filters.status);
      if (filters?.source) leads = leads.filter(l => l.source === filters.source);
      if (filters?.minScore !== undefined) leads = leads.filter(l => l.score >= filters.minScore!);
      return mockFallback(leads);
    }
    return api.get<Lead[]>('/leads', token);
  },

  async getLead(token: string, id: string): Promise<Lead> {
    if (USE_MOCK) {
      const lead = MOCK_LEADS.find(l => l.id === id);
      if (!lead) throw new Error('Lead not found');
      return mockFallback(lead);
    }
    return api.get<Lead>(`/leads/${id}`, token);
  },

  async updateLead(token: string, id: string, data: Partial<Lead>): Promise<Lead> {
    if (USE_MOCK) {
      const lead = MOCK_LEADS.find(l => l.id === id);
      if (!lead) throw new Error('Lead not found');
      return mockFallback({ ...lead, ...data, updatedAt: new Date().toISOString() });
    }
    return api.patch<Lead>(`/leads/${id}`, data, token);
  },

  async assignLead(token: string, id: string, userId: string): Promise<Lead> {
    if (USE_MOCK) {
      const lead = MOCK_LEADS.find(l => l.id === id);
      if (!lead) throw new Error('Lead not found');
      return mockFallback({ ...lead, assignedTo: userId, updatedAt: new Date().toISOString() });
    }
    return api.patch<Lead>(`/leads/${id}/assign`, { userId }, token);
  },

  async getHotLeads(token: string): Promise<Lead[]> {
    if (USE_MOCK) {
      return mockFallback(MOCK_LEADS.filter(l => l.score >= 80));
    }
    return api.get<Lead[]>('/leads?minScore=80', token);
  },
};
