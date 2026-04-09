'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Pipeline, Deal, CreateDeal, UpdateDeal, MoveDeal } from '@/types/pipeline';

const PIPELINES_KEY = 'pipelines';
const DEALS_KEY = 'deals';

export function usePipelines() {
  return useQuery({
    queryKey: [PIPELINES_KEY],
    queryFn: async () => {
      const response = await api.get<Pipeline[]>('/pipelines');
      return response.data;
    },
  });
}

export function usePipeline(id: string) {
  return useQuery({
    queryKey: [PIPELINES_KEY, id],
    queryFn: async () => {
      const response = await api.get<Pipeline>(`/pipelines/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDeal) => {
      const response = await api.post<Deal>('/deals', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PIPELINES_KEY] });
      queryClient.invalidateQueries({ queryKey: [DEALS_KEY] });
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDeal }) => {
      const response = await api.patch<Deal>(`/deals/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PIPELINES_KEY] });
      queryClient.invalidateQueries({ queryKey: [DEALS_KEY] });
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/deals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PIPELINES_KEY] });
      queryClient.invalidateQueries({ queryKey: [DEALS_KEY] });
    },
  });
}

export function useMoveDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: MoveDeal) => {
      const response = await api.patch<Deal>(`/deals/${data.dealId}/move`, { stageId: data.stageId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PIPELINES_KEY] });
    },
  });
}
