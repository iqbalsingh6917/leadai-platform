# 🤖 @leadai/ai-agents — AI Agent Package

Shared AI agent definitions, interfaces, and utilities for the LeadAI Platform multi-agent system.

For full architecture documentation, see [docs/architecture/ai-agent-architecture.md](../../docs/architecture/ai-agent-architecture.md).

## Agent Roster

| Agent | Role |
|-------|------|
| **Orchestrator Agent** | Central coordinator — routes tasks, monitors progress, aggregates results |
| **Prospector Agent** | Lead discovery and enrichment from external sources |
| **Qualifier Agent** | AI-powered lead scoring and BANT qualification |
| **Nurture Agent** | Personalized multi-channel drip sequences |
| **Scheduler Agent** | Meeting and follow-up scheduling optimization |
| **Sales Copilot Agent** | Real-time AI assistant for sales reps |
| **Support Agent** | Post-sale customer support automation |
| **Analytics Agent** | Insight generation, anomaly detection, performance summaries |
| **Compliance Agent** | Communication compliance checks (WhatsApp, GDPR, DPDP) |
| **Re-engagement Agent** | Dormant lead reactivation campaigns |
| **Budget Optimizer Agent** | Ad spend optimization across channels |

## Agent Interface Contract

All agents implement the following interface:

```typescript
interface AIAgent {
  name: string;
  role: string;
  description: string;
  triggers: AgentTrigger[];

  execute(input: AgentInput): Promise<AgentOutput>;
}

interface AgentInput {
  tenantId: string;
  sessionId: string;
  taskType: string;
  payload: Record<string, unknown>;
  context?: AgentContext;
}

interface AgentOutput {
  success: boolean;
  agentName: string;
  taskType: string;
  result: Record<string, unknown>;
  actions: AgentAction[];
  tokensUsed: number;
  latencyMs: number;
  error?: string;
}

interface AgentAction {
  type: 'send_message' | 'update_lead' | 'create_task' | 'publish_event' | 'call_agent';
  payload: Record<string, unknown>;
  executedAt?: Date;
}
```

## Usage

```python
# Python (AI Services)
from leadai_agents import OrchestratorAgent, AgentInput

orchestrator = OrchestratorAgent()
result = await orchestrator.execute(AgentInput(
    tenant_id="uuid",
    session_id="uuid",
    task_type="qualify_lead",
    payload={"lead_id": "uuid"}
))
```

```typescript
// TypeScript (for type checking in Node.js services)
import { AgentInput, AgentOutput, AgentAction } from '@leadai/ai-agents';
```

## Kafka Integration

Agents communicate via Apache Kafka. See [ai-agent-architecture.md](../../docs/architecture/ai-agent-architecture.md#agent-communication-via-kafka) for topic definitions.

## Model Selection

The LLM used by each agent depends on the tenant's plan tier:

| Plan | Default Model |
|------|--------------|
| Free / Starter | GPT-4o Mini |
| Growth | GPT-4o |
| Professional | Claude 3.5 Sonnet |
| Agency / Enterprise | GPT-4o + Claude Opus (multi-model) |
