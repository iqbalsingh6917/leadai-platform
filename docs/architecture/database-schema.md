# 🗄️ Database Schema

## Overview

LeadAI Platform uses a polyglot persistence strategy:
- **PostgreSQL 16** — Relational data (tenants, users, leads, billing, pipelines)
- **MongoDB 7** — Document data (interactions, templates, AI logs, analytics events)
- **Redis 7** — Sessions, caching, rate limiting, pub/sub

---

## PostgreSQL Tables

### `tenants`
```sql
CREATE TABLE tenants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    plan_type       VARCHAR(50) NOT NULL DEFAULT 'free_trial',
    status          VARCHAR(50) NOT NULL DEFAULT 'active',
    settings        JSONB DEFAULT '{}',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `users`
```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email           VARCHAR(320) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    role            VARCHAR(50) NOT NULL DEFAULT 'agent',
    avatar_url      TEXT,
    phone           VARCHAR(20),
    status          VARCHAR(50) NOT NULL DEFAULT 'active',
    last_login_at   TIMESTAMPTZ,
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);
CREATE INDEX idx_users_tenant ON users(tenant_id);
```

### `leads`
```sql
CREATE TABLE leads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(255),
    email           VARCHAR(320),
    phone           VARCHAR(20),
    company         VARCHAR(255),
    source          VARCHAR(100),
    status          VARCHAR(50) NOT NULL DEFAULT 'new',
    ai_score        INTEGER CHECK (ai_score BETWEEN 0 AND 100),
    ai_score_reason TEXT,
    tags            TEXT[] DEFAULT '{}',
    custom_fields   JSONB DEFAULT '{}',
    assigned_to     UUID REFERENCES users(id),
    campaign_id     UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_leads_status ON leads(tenant_id, status);
CREATE INDEX idx_leads_score ON leads(tenant_id, ai_score DESC);
```

### `contacts`
```sql
CREATE TABLE contacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lead_id         UUID REFERENCES leads(id),
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(320),
    phone           VARCHAR(20),
    company         VARCHAR(255),
    position        VARCHAR(255),
    address         JSONB DEFAULT '{}',
    tags            TEXT[] DEFAULT '{}',
    custom_fields   JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_contacts_tenant ON contacts(tenant_id);
```

### `pipelines`
```sql
CREATE TABLE pipelines (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    is_default      BOOLEAN DEFAULT FALSE,
    settings        JSONB DEFAULT '{}',
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `pipeline_stages`
```sql
CREATE TABLE pipeline_stages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id     UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    order_index     INTEGER NOT NULL,
    color           VARCHAR(7),
    probability     INTEGER CHECK (probability BETWEEN 0 AND 100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `deals`
```sql
CREATE TABLE deals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    pipeline_id     UUID NOT NULL REFERENCES pipelines(id),
    stage_id        UUID NOT NULL REFERENCES pipeline_stages(id),
    lead_id         UUID REFERENCES leads(id),
    contact_id      UUID REFERENCES contacts(id),
    title           VARCHAR(255) NOT NULL,
    value           DECIMAL(15,2),
    currency        VARCHAR(3) DEFAULT 'INR',
    status          VARCHAR(50) NOT NULL DEFAULT 'open',
    close_date      DATE,
    assigned_to     UUID REFERENCES users(id),
    notes           TEXT,
    custom_fields   JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_deals_tenant_pipeline ON deals(tenant_id, pipeline_id);
CREATE INDEX idx_deals_stage ON deals(stage_id);
```

### `campaigns`
```sql
CREATE TABLE campaigns (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    type            VARCHAR(50) NOT NULL,  -- email, whatsapp, sms, multi_channel
    status          VARCHAR(50) NOT NULL DEFAULT 'draft',
    target_audience JSONB DEFAULT '{}',
    settings        JSONB DEFAULT '{}',
    scheduled_at    TIMESTAMPTZ,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `workflows`
```sql
CREATE TABLE workflows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    trigger_type    VARCHAR(100) NOT NULL,
    trigger_config  JSONB DEFAULT '{}',
    status          VARCHAR(50) NOT NULL DEFAULT 'inactive',
    version         INTEGER NOT NULL DEFAULT 1,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `workflow_steps`
```sql
CREATE TABLE workflow_steps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id     UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    step_type       VARCHAR(100) NOT NULL,  -- send_email, send_whatsapp, wait, condition, ai_action
    order_index     INTEGER NOT NULL,
    config          JSONB DEFAULT '{}',
    on_success_id   UUID REFERENCES workflow_steps(id),
    on_failure_id   UUID REFERENCES workflow_steps(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `integrations`
```sql
CREATE TABLE integrations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider        VARCHAR(100) NOT NULL,  -- facebook_ads, google_ads, whatsapp, etc.
    status          VARCHAR(50) NOT NULL DEFAULT 'inactive',
    credentials     JSONB DEFAULT '{}',    -- encrypted
    settings        JSONB DEFAULT '{}',
    last_synced_at  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, provider)
);
```

### `subscriptions`
```sql
CREATE TABLE subscriptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    plan_type       VARCHAR(100) NOT NULL,
    service_model   VARCHAR(50) NOT NULL,  -- self_service, managed, hybrid
    status          VARCHAR(50) NOT NULL DEFAULT 'active',
    billing_cycle   VARCHAR(20) DEFAULT 'monthly',
    price_inr       DECIMAL(10,2),
    starts_at       TIMESTAMPTZ NOT NULL,
    ends_at         TIMESTAMPTZ,
    provider_sub_id VARCHAR(255),          -- Razorpay / Stripe subscription ID
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `invoices`
```sql
CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    subscription_id UUID REFERENCES subscriptions(id),
    invoice_number  VARCHAR(50) UNIQUE NOT NULL,
    status          VARCHAR(50) NOT NULL DEFAULT 'pending',
    amount_inr      DECIMAL(10,2) NOT NULL,
    tax_amount      DECIMAL(10,2) DEFAULT 0,
    total_amount    DECIMAL(10,2) NOT NULL,
    line_items      JSONB DEFAULT '[]',
    due_date        DATE NOT NULL,
    paid_at         TIMESTAMPTZ,
    provider_inv_id VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `activity_logs`
```sql
CREATE TABLE activity_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    entity_type     VARCHAR(100) NOT NULL,  -- lead, deal, contact, campaign, etc.
    entity_id       UUID NOT NULL,
    action          VARCHAR(100) NOT NULL,
    description     TEXT,
    metadata        JSONB DEFAULT '{}',
    ip_address      INET,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_activity_tenant_entity ON activity_logs(tenant_id, entity_type, entity_id);
CREATE INDEX idx_activity_created ON activity_logs(tenant_id, created_at DESC);
```

---

## MongoDB Collections

### `lead_interactions`
```json
{
  "_id": "ObjectId",
  "tenantId": "uuid",
  "leadId": "uuid",
  "type": "whatsapp_message | email | call | note | ai_action",
  "direction": "inbound | outbound",
  "channel": "whatsapp | email | phone",
  "content": {
    "text": "Hello, I'm interested in your product...",
    "mediaUrl": null,
    "subject": null
  },
  "metadata": {
    "messageId": "wam_id",
    "status": "delivered | read | failed",
    "agentUsed": "nurture_agent"
  },
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### `email_templates`
```json
{
  "_id": "ObjectId",
  "tenantId": "uuid",
  "name": "Welcome Email",
  "subject": "Welcome to {{company_name}}!",
  "htmlBody": "<html>...<p>Hi {{first_name}},</p>...</html>",
  "textBody": "Hi {{first_name}}, welcome...",
  "variables": ["first_name", "company_name"],
  "category": "onboarding | nurture | promotional",
  "isActive": true,
  "createdBy": "uuid",
  "createdAt": "ISODate"
}
```

### `whatsapp_templates`
```json
{
  "_id": "ObjectId",
  "tenantId": "uuid",
  "name": "lead_follow_up",
  "wabaTemplateId": "123456",
  "language": "en_IN",
  "category": "MARKETING | UTILITY | AUTHENTICATION",
  "components": [
    { "type": "HEADER", "format": "TEXT", "text": "Hello {{1}}" },
    { "type": "BODY", "text": "Your inquiry about {{2}} has been received..." },
    { "type": "FOOTER", "text": "Reply STOP to unsubscribe" }
  ],
  "status": "approved | pending | rejected",
  "createdAt": "ISODate"
}
```

### `workflow_templates`
```json
{
  "_id": "ObjectId",
  "name": "New Lead Welcome Sequence",
  "category": "lead_nurture | sales | re_engagement",
  "description": "Auto-welcome sequence for new leads from Facebook Ads",
  "isPublic": true,
  "steps": [
    { "order": 1, "type": "send_whatsapp", "delay": 0, "config": {} },
    { "order": 2, "type": "wait", "delay": 86400, "config": {} },
    { "order": 3, "type": "send_email", "delay": 0, "config": {} }
  ],
  "usageCount": 1420,
  "createdAt": "ISODate"
}
```

### `ai_agent_logs`
```json
{
  "_id": "ObjectId",
  "tenantId": "uuid",
  "agentName": "qualifier_agent",
  "sessionId": "uuid",
  "leadId": "uuid",
  "input": { "leadData": {}, "context": {} },
  "output": {
    "score": 82,
    "recommendation": "high_priority",
    "reasoning": "Lead from premium industry, budget confirmed via WhatsApp...",
    "actions": ["assign_to_senior_rep", "send_product_demo_link"]
  },
  "modelUsed": "gpt-4o",
  "tokensUsed": 1240,
  "latencyMs": 1850,
  "status": "success | error",
  "createdAt": "ISODate"
}
```

### `analytics_events`
```json
{
  "_id": "ObjectId",
  "tenantId": "uuid",
  "eventType": "lead_created | deal_won | email_opened | campaign_sent",
  "entityId": "uuid",
  "entityType": "lead | deal | campaign",
  "userId": "uuid",
  "sessionId": "uuid",
  "properties": {
    "source": "facebook_ads",
    "campaignId": "uuid",
    "value": 50000
  },
  "timestamp": "ISODate"
}
```

---

## Redis Usage Patterns

### Sessions
```
Key: session:{userId}:{sessionId}
Value: JSON (user data, permissions, tenant context)
TTL: 900s (15 minutes, sliding)
```

### Caching
```
Key: cache:{tenantId}:leads:list:{page}:{filters_hash}
Value: JSON serialized lead list
TTL: 60s

Key: cache:{tenantId}:dashboard:metrics
Value: JSON serialized metrics
TTL: 300s (5 minutes)
```

### Rate Limiting
```
Key: rate_limit:{tenantId}:{userId}:{endpoint}
Value: request count (integer)
TTL: 60s (rolling window)
```

### Pub/Sub Channels
```
Channel: notifications:{tenantId}        — Real-time UI notifications
Channel: lead_updates:{tenantId}         — Live lead status updates
Channel: agent_status:{tenantId}         — AI agent task progress
```

---

## Entity Relationships

```
tenants (1) ─── (N) users
tenants (1) ─── (N) leads ─── (N) lead_interactions [MongoDB]
tenants (1) ─── (N) contacts
leads   (1) ─── (1) contacts (optional conversion)
tenants (1) ─── (N) pipelines ─── (N) pipeline_stages ─── (N) deals
tenants (1) ─── (N) campaigns
tenants (1) ─── (N) workflows ─── (N) workflow_steps
tenants (1) ─── (N) integrations
tenants (1) ─── (N) subscriptions ─── (N) invoices
tenants (1) ─── (N) activity_logs
```
