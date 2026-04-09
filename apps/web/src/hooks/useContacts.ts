'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Contact, CreateContact, UpdateContact } from '@/types/contact';
import { PaginatedResponse } from '@/types/common';

const CONTACTS_KEY = 'contacts';

export function useContacts(filters?: { search?: string; lifecycleStage?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: [CONTACTS_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.lifecycleStage) params.append('lifecycleStage', filters.lifecycleStage);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));
      const response = await api.get<PaginatedResponse<Contact>>(`/contacts?${params.toString()}`);
      return response.data;
    },
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: [CONTACTS_KEY, id],
    queryFn: async () => {
      const response = await api.get<Contact>(`/contacts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateContact) => {
      const response = await api.post<Contact>('/contacts', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_KEY] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateContact }) => {
      const response = await api.patch<Contact>(`/contacts/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_KEY] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_KEY] });
    },
  });
}
