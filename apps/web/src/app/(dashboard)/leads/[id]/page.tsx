'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { PageSpinner } from '@/components/ui/Spinner';
import { LeadDetail } from '@/components/leads/LeadDetail';
import { LeadForm } from '@/components/leads/LeadForm';
import { useLead, useUpdateLead } from '@/hooks/useLeads';
import { UpdateLead, Lead } from '@/types/lead';
import { AiScoreResult } from '@/types/ai';
import { Brain, RefreshCw, Flame, Thermometer, Snowflake, ChevronDown, ChevronUp } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// Mock lead for when API isn't connected
const mockLead: Lead = {
  id: '1',
  firstName: 'Arjun',
  lastName: 'Sharma',
  email: 'arjun@example.com',
  phone: '9876543210',
  company: 'TechCorp India',
  source: 'website',
  status: 'qualified',
  score: 85,
  notes: 'Interested in enterprise plan. Follow up needed.',
  tags: ['hot', 'enterprise'],
  tenantId: 't1',
  createdAt: '2026-04-01T00:00:00Z',
  updatedAt: '2026-04-01T00:00:00Z',
};

const TIER_CONFIG = {
  hot: { icon: Flame, color: 'text-red-500', bg: 'bg-red-50 border-red-200', label: 'Hot Lead' },
  warm: { icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200', label: 'Warm Lead' },
  cold: { icon: Snowflake, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200', label: 'Cold Lead' },
};

function AiAnalysisCard({ leadId }: { leadId: string }) {
  const [scoring, setScoring] = useState(false);
  const [result, setResult] = useState<AiScoreResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  async function handleScore() {
    setScoring(true);
    try {
      const res = await api.post<AiScoreResult>(`/leads/${leadId}/ai-score`);
      setResult(res.data);
      setShowDetails(true);
    } catch {
      toast.error('AI scoring failed. Please try again.');
    } finally {
      setScoring(false);
    }
  }

  const tier = result?.tier ?? 'cold';
  const TierConfig = result ? TIER_CONFIG[tier] : null;
  const TierIcon = TierConfig?.icon;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-600" />
          AI Analysis
        </h3>
        <button
          onClick={handleScore}
          disabled={scoring}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${scoring ? 'animate-spin' : ''}`} />
          {scoring ? 'Scoring...' : result ? 'Re-score' : 'Run AI Score'}
        </button>
      </div>

      {!result && !scoring && (
        <div className="text-center py-6 text-slate-400">
          <Brain className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Click "Run AI Score" to analyze this lead with AI.</p>
        </div>
      )}

      {scoring && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {result && TierConfig && TierIcon && (
        <div className="space-y-4">
          {/* Score + Tier */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border ${TierConfig.bg}`}>
            <div className="flex-shrink-0 text-center">
              <div className="text-3xl font-bold text-slate-900">{result.score}</div>
              <div className="text-xs text-slate-500">/ 100</div>
            </div>
            <div className="w-px h-10 bg-current opacity-20" />
            <div className="flex items-center gap-2">
              <TierIcon className={`w-5 h-5 ${TierConfig.color}`} />
              <span className={`text-sm font-semibold ${TierConfig.color}`}>{TierConfig.label}</span>
            </div>
          </div>

          {/* Reasoning */}
          {result.reasoning && (
            <div>
              <p className="text-sm text-slate-700 leading-relaxed">{result.reasoning}</p>
            </div>
          )}

          {/* Details toggle */}
          {(result.recommendations?.length > 0 || Object.keys(result.signals ?? {}).length > 0) && (
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
            >
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
          )}

          {showDetails && (
            <div className="space-y-3">
              {result.recommendations?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Recommendations</h4>
                  <ul className="space-y-1.5">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {Object.keys(result.signals ?? {}).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Score Signals</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(result.signals).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-xs bg-slate-50 px-2 py-1.5 rounded">
                        <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-slate-700">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: lead, isLoading } = useLead(id);
  const { mutateAsync: updateLead, isPending } = useUpdateLead();

  const displayLead = lead || mockLead;

  async function handleUpdate(data: UpdateLead) {
    try {
      await updateLead({ id, data });
      setShowEditModal(false);
      toast.success('Lead updated successfully');
    } catch {
      toast.error('Failed to update lead');
    }
  }

  if (isLoading) return <PageSpinner />;

  return (
    <>
      <div className="space-y-6">
        <LeadDetail lead={displayLead} onEdit={() => setShowEditModal(true)} />
        <div className="max-w-2xl">
          <AiAnalysisCard leadId={id} />
        </div>
      </div>
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Lead" size="lg">
        <LeadForm
          initialData={displayLead}
          onSubmit={(data) => handleUpdate(data as UpdateLead)}
          loading={isPending}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </>
  );
}
