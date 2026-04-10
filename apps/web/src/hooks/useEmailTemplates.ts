'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  EmailTemplate,
  CreateEmailTemplate,
  UpdateEmailTemplate,
  PreviewTemplate,
} from '@/types/email-template';
import { PaginatedResponse } from '@/types/common';

const TEMPLATES_KEY = 'email-templates';

export function useEmailTemplates(search?: string) {
  return useQuery({
    queryKey: [TEMPLATES_KEY, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      const response = await api.get<PaginatedResponse<EmailTemplate>>(
        `/email-templates?${params.toString()}`,
      );
      return response.data;
    },
  });
}

export function useEmailTemplate(id: string) {
  return useQuery({
    queryKey: [TEMPLATES_KEY, id],
    queryFn: async () => {
      const response = await api.get<EmailTemplate>(`/email-templates/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateEmailTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEmailTemplate) => {
      const response = await api.post<EmailTemplate>('/email-templates', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
    },
  });
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEmailTemplate }) => {
      const response = await api.patch<EmailTemplate>(`/email-templates/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
    },
  });
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/email-templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
    },
  });
}

export function usePreviewTemplate() {
  return useMutation({
    mutationFn: async ({
      id,
      variables,
    }: {
      id: string;
      variables: Record<string, string>;
    }) => {
      const response = await api.post<PreviewTemplate>(`/email-templates/${id}/preview`, {
        variables,
      });
      return response.data;
    },
  });
}
