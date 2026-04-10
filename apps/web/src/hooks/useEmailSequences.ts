'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  EmailSequence,
  CreateEmailSequence,
  UpdateEmailSequence,
} from '@/types/email-sequence';
import { PaginatedResponse } from '@/types/common';

const SEQUENCES_KEY = 'email-sequences';

export function useEmailSequences() {
  return useQuery({
    queryKey: [SEQUENCES_KEY],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<EmailSequence>>('/email-sequences');
      return response.data;
    },
  });
}

export function useEmailSequence(id: string) {
  return useQuery({
    queryKey: [SEQUENCES_KEY, id],
    queryFn: async () => {
      const response = await api.get<EmailSequence>(`/email-sequences/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateEmailSequence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEmailSequence) => {
      const response = await api.post<EmailSequence>('/email-sequences', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEQUENCES_KEY] });
    },
  });
}

export function useUpdateEmailSequence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEmailSequence }) => {
      const response = await api.patch<EmailSequence>(`/email-sequences/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEQUENCES_KEY] });
    },
  });
}

export function useDeleteEmailSequence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/email-sequences/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEQUENCES_KEY] });
    },
  });
}

export function useEnrollLeads() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, leadIds }: { id: string; leadIds: string[] }) => {
      const response = await api.post<{ enrolled: number }>(
        `/email-sequences/${id}/enroll`,
        { leadIds },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEQUENCES_KEY] });
    },
  });
}

export function useGetEnrollments(sequenceId: string) {
  return useQuery({
    queryKey: [SEQUENCES_KEY, sequenceId, 'enrollments'],
    queryFn: async () => {
      const response = await api.get(`/email-sequences/${sequenceId}/enrollments`);
      return response.data;
    },
    enabled: !!sequenceId,
  });
}
