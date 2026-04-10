'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  WhatsAppDripCampaign,
  CreateDripCampaign,
  UpdateDripCampaign,
} from '@/types/whatsapp-drip';

const DRIP_KEY = 'whatsapp-drip';

export function useWhatsAppDripCampaigns() {
  return useQuery({
    queryKey: [DRIP_KEY],
    queryFn: async () => {
      const response = await api.get<{ data: WhatsAppDripCampaign[]; total: number }>(
        '/whatsapp-drip',
      );
      return response.data;
    },
  });
}

export function useWhatsAppDripCampaign(id: string) {
  return useQuery({
    queryKey: [DRIP_KEY, id],
    queryFn: async () => {
      const response = await api.get<WhatsAppDripCampaign>(`/whatsapp-drip/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateDripCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDripCampaign) => {
      const response = await api.post<WhatsAppDripCampaign>('/whatsapp-drip', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIP_KEY] });
    },
  });
}

export function useUpdateDripCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDripCampaign }) => {
      const response = await api.patch<WhatsAppDripCampaign>(`/whatsapp-drip/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIP_KEY] });
    },
  });
}

export function useDeleteDripCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/whatsapp-drip/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIP_KEY] });
    },
  });
}

export function useEnrollLeadsDrip() {
  return useMutation({
    mutationFn: async ({
      id,
      leadIds,
      phoneNumbers,
    }: {
      id: string;
      leadIds: string[];
      phoneNumbers: string[];
    }) => {
      const response = await api.post<{ enrolled: number }>(
        `/whatsapp-drip/${id}/enroll`,
        { leadIds, phoneNumbers },
      );
      return response.data;
    },
  });
}

export function useDripEnrollments(campaignId: string) {
  return useQuery({
    queryKey: [DRIP_KEY, campaignId, 'enrollments'],
    queryFn: async () => {
      const response = await api.get(`/whatsapp-drip/${campaignId}/enrollments`);
      return response.data;
    },
    enabled: !!campaignId,
  });
}
