import { api, USE_MOCK, mockFallback, MOCK_PIPELINES } from './api';
import type { Pipeline, Lead } from '@/types';

export const pipelineService = {
  async getPipelines(token: string): Promise<Pipeline[]> {
    if (USE_MOCK) {
      return mockFallback(MOCK_PIPELINES);
    }
    return api.get<Pipeline[]>('/pipelines', token);
  },

  async getPipelineWithLeads(token: string, id: string): Promise<Pipeline> {
    if (USE_MOCK) {
      const pipeline = MOCK_PIPELINES.find(p => p.id === id);
      if (!pipeline) throw new Error('Pipeline not found');
      return mockFallback(pipeline);
    }
    return api.get<Pipeline>(`/pipelines/${id}?include=leads`, token);
  },

  async moveLeadToStage(token: string, leadId: string, stageId: string): Promise<Lead> {
    if (USE_MOCK) {
      const { MOCK_LEADS } = await import('./api');
      const lead = MOCK_LEADS.find(l => l.id === leadId);
      if (!lead) throw new Error('Lead not found');
      return mockFallback({ ...lead, pipelineStage: stageId, updatedAt: new Date().toISOString() });
    }
    return api.patch<Lead>(`/leads/${leadId}/stage`, { stageId }, token);
  },
};
