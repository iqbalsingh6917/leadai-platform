export type WorkflowTrigger = 'lead_created' | 'lead_updated' | 'deal_stage_changed' | 'manual';
export type WorkflowRunStatus = 'running' | 'completed' | 'failed';

export interface WorkflowStep {
  id: string;
  type: 'send_email' | 'send_whatsapp' | 'update_lead_status' | 'ai_score_lead' | 'add_tag' | 'assign_team_member' | 'wait';
  label: string;
  config: Record<string, any>;
}

export interface WorkflowDefinition {
  steps: WorkflowStep[];
}

export interface Workflow {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  isActive: boolean;
  definition: WorkflowDefinition;
  runCount?: number;
  lastRunAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  tenantId: string;
  status: WorkflowRunStatus;
  startedAt: string;
  completedAt?: string;
  inputData: Record<string, any>;
  outputData: Record<string, any>;
  error?: string;
}

export interface CreateWorkflow {
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  isActive?: boolean;
  definition?: WorkflowDefinition;
}

export interface UpdateWorkflow extends Partial<CreateWorkflow> {}

export interface AiScoreResult {
  score: number;
  tier: 'hot' | 'warm' | 'cold';
  reasoning: string;
  signals: Record<string, any>;
  recommendations: string[];
}

export interface BudgetOptimizeResult {
  recommendations: {
    campaignId: string;
    campaignName: string;
    currentSpend: number;
    suggestedSpend: number;
    rationale: string;
  }[];
  totalBudget: number;
  projectedImprovement: number;
}

export interface CopilotChatResponse {
  reply: string;
  sessionId: string;
  suggestions: string[];
}
