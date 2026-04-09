'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Campaign, CreateCampaign, UpdateCampaign } from '@/types/campaign';
import { PaginatedResponse } from '@/types/common';

const CAMPAIGNS_KEY = 'campaigns';

export function useCampaigns(filters?: { type?: string; status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: [CAMPAIGNS_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));
      const response = await api.get<PaginatedResponse<Campaign>>(`/campaigns?${params.toString()}`);
      return response.data;
    },
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: [CAMPAIGNS_KEY, id],
    queryFn: async () => {
      const response = await api.get<Campaign>(`/campaigns/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCampaign) => {
      const response = await api.post<Campaign>('/campaigns', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_KEY] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCampaign }) => {
      const response = await api.patch<Campaign>(`/campaigns/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_KEY] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_KEY] });
    },
  });
}
