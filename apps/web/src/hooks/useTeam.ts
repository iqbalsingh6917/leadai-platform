'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { TeamMember, InviteTeamMember, UpdateTeamMember } from '@/types/team';

const TEAM_KEY = 'team';

export function useTeamMembers() {
  return useQuery({
    queryKey: [TEAM_KEY],
    queryFn: async () => {
      const response = await api.get<TeamMember[]>('/team');
      return response.data;
    },
  });
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InviteTeamMember) => {
      const response = await api.post<TeamMember>('/team/invite', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEAM_KEY] });
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTeamMember }) => {
      const response = await api.patch<TeamMember>(`/team/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEAM_KEY] });
    },
  });
}

export function useDeactivateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/team/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEAM_KEY] });
    },
  });
}
