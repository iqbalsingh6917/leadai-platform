# 🤖 AI Agent Architecture

## Overview

LeadAI Platform's intelligence layer is built on a **multi-agent AI system** using LangChain and LangGraph. Eleven specialized agents operate autonomously or in collaboration, orchestrated by a central Orchestrator Agent. Each agent has a defined role, set of triggers, available actions, and output contracts.

The system supports multiple LLM backends (OpenAI GPT-4o, Anthropic Claude 3.5, Google Gemini Pro) and selects the appropriate model based on tenant plan tier and task complexity.

---

## Agent Orchestration Flow

```
                         ┌─────────────────────┐
                         │   External Events   │
                         │  (Kafka / Webhooks) │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │      Orchestrator Agent        │
                    │  - Route task to right agent   │
                    │  - Monitor agent progress      │
                    │  - Handle agent failures       │
                    │  - Aggregate multi-agent output│
                    └──────────────┬────────────────┘
                                   │
           ┌───────────┬───────────┼────────────┬───────────┐
           ▼           ▼           ▼            ▼           ▼
    ┌─────────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
    │ Prospector  │ │Qualifier│ │ Nurture │ │Scheduler│ │  Sales  │
    │   Agent     │ │  Agent  │ │  Agent  │ │  Agent  │ │ Copilot │
    └─────────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
           │
    ┌──────┴──────────────────────────────────┐
    ▼           ▼           ▼                 ▼
 ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
 │Support │ │Analytic│ │Compliance│ │Re-engagement │
 │ Agent  │ │  Agent │ │  Agent   │ │    Agent     │
 └────────┘ └────────┘ └──────────┘ └──────────────┘
                                         ▼
                               ┌──────────────────┐
                               │  Budget Optimizer │
                               │      Agent       │
                               └──────────────────┘
```

---

## Agent Definitions

### 1. Orchestrator Agent

| Attribute | Details |
|-----------|---------|
| **Name** | `orchestrator_agent` |
| **Role** | Central coordinator — routes tasks to specialized agents, manages workflows, aggregates results |
| **Triggers** | New lead event, workflow start, scheduled batch, manual override |
| **Actions** | Dispatch tasks to agents, monitor task queue, retry on failure, publish results to Kafka |
| **Output** | Task routing decisions, aggregated multi-agent summaries, workflow state |

---

### 2. Prospector Agent

| Attribute | Details |
|-----------|---------|
| **Name** | `prospector_agent` |
| **Role** | Discovers and enriches new leads from external sources |
| **Triggers** | Campaign launched, LinkedIn/ads webhook, manual trigger |
| **Actions** | Scrape/enrich lead data, deduplicate, create lead records, assign initial score |
| **Output** | Enriched lead object with company data, LinkedIn profile, tech stack |

---

### 3. Qualifier Agent

| Attribute | Details |
|-----------|---------|
| **Name** | `qualifier_agent` |
| **Role** | Scores and qualifies leads using BANT/MEDDIC criteria + AI |
| **Triggers** | New lead created, lead data updated, qualification requested |
| **Actions** | Analyze lead attributes, ask qualification questions via WhatsApp, update AI score |
| **Output** | AI score (0–100), qualification tier (hot/warm/cold), recommended next action |

---

### 4. Nurture Agent

| Attribute | Details |
|-----------|---------|
| **Name** | `nurture_agent` |
| **Role** | Runs personalized multi-channel nurture sequences |
| **Triggers** | Lead qualified as warm, workflow sequence triggered, time-based schedule |
| **Actions** | Send personalized WhatsApp messages, emails, manage drip sequences, track engagement |
| **Output** | Engagement score delta, next touchpoint recommendation, sequence completion status |

---

### 5. Scheduler Agent

| Attribute | Details |
|-----------|---------|
| **Name** | `scheduler_agent` |
| **Role** | Optimizes meeting and follow-up scheduling |
| **Triggers** | Lead requests callback, deal stage requires meeting, follow-up overdue |
| **Actions** | Check calendar availability, send meeting links, set reminders, reschedule on no-show |
| **Output** | Meeting confirmation, calendar event created, follow-up task assigned |

---

### 6. Sales Copilot Agent

| Attribute | Details |
|-----------|---------|
| **Name** | `sales_copilot_agent` |
| **Role** | Real-time AI assistant for sales reps during conversations |
| **Triggers** | Rep opens lead, call starts, WhatsApp conversation initiated |
| **Actions** | Suggest responses, surface objection handling tips, auto-populate deal info, draft follow-ups |
| **Output** | Response suggestions, talking points, deal probability estimate, next best action |

---

### 7. Support Agent

| Attribute | Details |
|-----------|---------|
| **Name** | `support_agent` |
| **Role** | Handles post-sale customer support inquiries automatically |
| **Triggers** | Support ticket created, WhatsApp message from existing customer |
| **Actions** | Classify issue, retrieve knowledge base answers, escalate complex issues, send resolution |
| **Output** | Issue classification, resolution attempt, escalation flag, satisfaction prediction |

---

### 8. Analytics Agent

| Attribute | Details |
|-----------|---------|
| **Name** | `analytics_agent` |
| **Role** | Generates insights, anomaly detection, and performance summaries |
| **Triggers** | Daily schedule, significant metric change detected, report requested |
| **Actions** | Aggregate metrics, detect anomalies, generate natural language summaries, identify trends |
| **Output** | Dashboard summaries, anomaly alerts, actionable recommendations, forecast updates |

---

### 9. Compliance Agent

| Attribute | Details |
|-----------|---------|
| **Name** | `compliance_agent` |
| **Role** | Ensures all communications comply with WhatsApp, GDPR, and DPDP policies |
| **Triggers** | Before any outbound communication is sent, opt-out received |
| **Actions** | Check consent status, validate message templates, enforce opt-out, flag violations |
| **Output** | Compliance approval/rejection, opt-out processed, violation report |

---

### 10. Re-engagement Agent

| Attribute | Details |
|-----------|---------|
| **Name** | `reengagement_agent` |
| **Role** | Identifies and re-activates cold or dormant leads |
| **Triggers** | Lead inactive for N days (configurable), deal closed-lost |
| **Actions** | Classify reactivation potential, craft personalized re-engagement messages, A/B test approaches |
| **Output** | Reactivation probability, message sent, lead status updated, re-engagement campaign assigned |

---

### 11. Budget Optimizer Agent

| Attribute | Details |
|-----------|---------|
| **Name** | `budget_optimizer_agent` |
| **Role** | Optimizes ad spend allocation across channels for maximum ROI |
| **Triggers** | Daily budget review, performance threshold breach, manual optimization request |
| **Actions** | Analyze channel performance, suggest budget reallocation, auto-adjust bids (with approval), generate spend reports |
| **Output** | Budget reallocation recommendations, projected ROI improvement, actual vs. target spend |

---

## AI Model Strategy by Plan Tier

| Plan | LLM Used | Rationale |
|------|----------|-----------|
| **Free / Starter** | GPT-4o Mini | Lightweight and cost-effective for basic scoring and templates |
| **Growth** | GPT-4o / Claude Haiku | Mid-tier for nurture sequences and analytics summaries |
| **Professional** | GPT-4o / Claude Sonnet 3.5 | Premium quality for copilot, compliance, budget optimizer |
| **Agency / Enterprise** | GPT-4o + Claude Opus / Gemini Pro | Full premium, multi-model redundancy |
| **Enterprise (BYOAI)** | Self-hosted Llama 3 / Mistral | Data sovereignty, on-premise deployment |

---

## Agent Communication via Kafka

Each agent communicates via Kafka topics following a standard event schema:

```json
{
  "eventId": "uuid",
  "timestamp": "ISODate",
  "tenantId": "uuid",
  "agentName": "qualifier_agent",
  "taskType": "qualify_lead",
  "status": "started | completed | failed",
  "payload": {
    "leadId": "uuid",
    "input": {},
    "output": {},
    "error": null
  },
  "tokensUsed": 840,
  "latencyMs": 1200
}
```

### Kafka Topics for Agent Layer

| Topic | Purpose |
|-------|---------|
| `agents.tasks.inbox` | Tasks dispatched by Orchestrator |
| `agents.tasks.completed` | Completed task results |
| `agents.tasks.failed` | Failed tasks for retry/alert |
| `agents.events.lead_scored` | Qualifier agent score results |
| `agents.events.message_approved` | Compliance agent approvals |
| `agents.events.budget_updated` | Budget optimizer decisions |

---

## Agent State Management

Each agent session maintains state using LangGraph's state graph:

```python
class AgentState(TypedDict):
    tenant_id: str
    lead_id: str
    messages: List[BaseMessage]
    tool_calls: List[ToolCall]
    intermediate_steps: List[Tuple]
    final_output: Optional[dict]
    error: Optional[str]
    retry_count: int
```

Long-term memory is stored in:
- **Redis**: Short-term session context (TTL: 1 hour)
- **Pinecone/Weaviate**: Vector embeddings for lead/contact context retrieval
- **MongoDB**: Agent execution logs and output history
- **Neo4j** (Phase 3): Knowledge graph of cross-tenant industry patterns
