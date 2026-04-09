'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DashboardStats, LeadAnalytics, CampaignAnalytics } from '@/types/analytics';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const response = await api.get<DashboardStats>('/analytics/dashboard');
      return response.data;
    },
  });
}

export function useLeadAnalytics(dateRange?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ['analytics', 'leads', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange?.from) params.append('from', dateRange.from);
      if (dateRange?.to) params.append('to', dateRange.to);
      const response = await api.get<LeadAnalytics>(`/analytics/leads?${params.toString()}`);
      return response.data;
    },
  });
}

export function useCampaignAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'campaigns'],
    queryFn: async () => {
      const response = await api.get<CampaignAnalytics[]>('/analytics/campaigns');
      return response.data;
    },
  });
}
