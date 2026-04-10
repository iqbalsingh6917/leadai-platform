import { useState, useEffect, useCallback } from 'react';
import { leadsService } from '@/services/leads.service';
import { useAuth } from './useAuth';
import type { Lead } from '@/types';

export function useLeads() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await leadsService.getLeads(token);
      setLeads(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLead = useCallback(
    async (id: string, data: Partial<Lead>) => {
      if (!token) return;
      const updated = await leadsService.updateLead(token, id, data);
      setLeads(prev => prev.map(l => (l.id === id ? updated : l)));
    },
    [token],
  );

  const hotLeads = leads.filter(l => l.score >= 80);

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads,
    updateLead,
    hotLeads,
  };
}
