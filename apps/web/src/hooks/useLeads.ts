'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Lead, CreateLead, UpdateLead, LeadFilter } from '@/types/lead';
import { PaginatedResponse } from '@/types/common';

const LEADS_KEY = 'leads';

export function useLeads(filters?: LeadFilter) {
  return useQuery({
    queryKey: [LEADS_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.source) params.append('source', filters.source);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));
      const response = await api.get<PaginatedResponse<Lead>>(`/leads?${params.toString()}`);
      return response.data;
    },
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: [LEADS_KEY, id],
    queryFn: async () => {
      const response = await api.get<Lead>(`/leads/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLead) => {
      const response = await api.post<Lead>('/leads', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_KEY] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLead }) => {
      const response = await api.patch<Lead>(`/leads/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_KEY] });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_KEY] });
    },
  });
}
