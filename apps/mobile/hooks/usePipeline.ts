import { useState, useCallback } from 'react';
import { pipelineService } from '@/services/pipeline.service';
import { useAuth } from './useAuth';
import type { Pipeline } from '@/types';

export function usePipeline() {
  const { token } = useAuth();
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [activePipeline, setActivePipeline] = useState<Pipeline | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPipelines = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await pipelineService.getPipelines(token);
      setPipelines(data);
      if (data.length > 0) setActivePipeline(data[0]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchPipeline = useCallback(
    async (id: string) => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await pipelineService.getPipelineWithLeads(token, id);
        setActivePipeline(data);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const moveLeadToStage = useCallback(
    async (leadId: string, stageId: string) => {
      if (!token || !activePipeline) return;
      await pipelineService.moveLeadToStage(token, leadId, stageId);
      // Re-fetch the active pipeline to get updated stage data
      await fetchPipeline(activePipeline.id);
    },
    [token, activePipeline, fetchPipeline],
  );

  return {
    pipelines,
    activePipeline,
    loading,
    fetchPipelines,
    fetchPipeline,
    moveLeadToStage,
  };
}
