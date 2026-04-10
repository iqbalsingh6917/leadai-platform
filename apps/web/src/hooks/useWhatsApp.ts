'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { WhatsAppConfig, WhatsAppMessage, SaveConfig, SendMessage } from '@/types/whatsapp';

const CONFIG_KEY = 'whatsapp-config';
const MESSAGES_KEY = 'whatsapp-messages';

export function useWhatsAppConfig() {
  return useQuery({
    queryKey: [CONFIG_KEY],
    queryFn: async () => {
      const response = await api.get<WhatsAppConfig>('/whatsapp/config');
      return response.data;
    },
  });
}

export function useSaveConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SaveConfig) => {
      const response = await api.post<WhatsAppConfig>('/whatsapp/config', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONFIG_KEY] });
    },
  });
}

export function useTestConnection() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<{ connected: boolean; message: string }>(
        '/whatsapp/config/test',
      );
      return response.data;
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SendMessage) => {
      const response = await api.post<WhatsAppMessage>('/whatsapp/send', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY] });
    },
  });
}

export function useWhatsAppMessages(filters?: {
  leadId?: string;
  direction?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [MESSAGES_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.leadId) params.set('leadId', filters.leadId);
      if (filters?.direction) params.set('direction', filters.direction);
      if (filters?.page) params.set('page', String(filters.page));
      if (filters?.limit) params.set('limit', String(filters.limit));
      const response = await api.get<{ data: WhatsAppMessage[]; total: number }>(
        `/whatsapp/messages?${params.toString()}`,
      );
      return response.data;
    },
  });
}
