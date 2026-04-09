# 🏗️ System Architecture

## Overview

LeadAI Platform is built as a cloud-native, microservices-based architecture designed for high availability, horizontal scalability, and multi-tenancy. The system separates concerns across six distinct layers — from client-facing interfaces down to persistent data stores — communicating via RESTful APIs, GraphQL subscriptions, and an Apache Kafka event bus.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│    │  Web App     │  │  Mobile App  │  │  Partner API / CLI   │   │
│    │ (Next.js 14) │  │ (React Native│  │  (REST / GraphQL)    │   │
│    └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
└───────────┼─────────────────┼───────────────────────┼─────────────-┘
            │                 │                       │
            ▼                 ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                            │
│    ┌────────────────────────────────────────────────────────────┐   │
│    │          Kong / Traefik — Rate limiting, Auth, Routing     │   │
│    │          Cloudflare CDN — DDoS, TLS termination, WAF       │   │
│    └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      MICROSERVICES LAYER                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  Lead    │ │  Auth    │ │ Billing  │ │  Comms   │ │   CRM    │ │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │ │ Service  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                           │
│  │Analytics │ │Workflow  │ │Integrat. │                           │
│  │ Service  │ │ Service  │ │ Service  │                           │
│  └──────────┘ └──────────┘ └──────────┘                           │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       AI AGENT LAYER (FastAPI)                      │
│  ┌───────────────┐ ┌──────────────┐ ┌──────────────────────────┐   │
│  │  Orchestrator │ │  Prospector  │ │   Qualifier / Nurture    │   │
│  │    Agent      │ │    Agent     │ │      Agents              │   │
│  └───────────────┘ └──────────────┘ └──────────────────────────┘   │
│  ┌───────────────┐ ┌──────────────┐ ┌──────────────────────────┐   │
│  │  Analytics    │ │  Compliance  │ │  Budget Optimizer Agent  │   │
│  │    Agent      │ │    Agent     │ │                          │   │
│  └───────────────┘ └──────────────┘ └──────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        EVENT BUS LAYER                              │
│    ┌────────────────────────────────────────────────────────────┐   │
│    │              Apache Kafka (Message Broker)                 │   │
│    │   Topics: leads.created, deals.updated, campaigns.sent,   │   │
│    │           agents.completed, billing.events, etc.          │   │
│    └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                 │
│  ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ PostgreSQL │ │ MongoDB  │ │  Redis   │ │  Elastic │ │Pinecone│ │
│  │     16     │ │    7     │ │    7     │ │ search 8 │ │/Weav.  │ │
│  │(relational)│ │(documents│ │(cache/  │ │ (search) │ │(vector)│ │
│  │            │ │          │ │ sessions)│ │          │ │        │ │
│  └────────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Microservice Descriptions

| Service | Port | Responsibilities |
|---------|------|-----------------|
| **Lead Service** | 3001 | Lead ingestion, scoring, routing, deduplication, source tracking |
| **Auth Service** | 3002 | Authentication, authorization, JWT/OIDC, SSO, RBAC, API key management |
| **Billing Service** | 3003 | Subscription management, invoicing, Razorpay/Stripe integration, usage metering |
| **Communication Service** | 3004 | WhatsApp messaging, email campaigns, SMS, push notifications, template management |
| **CRM Service** | 3005 | Contacts, deals, pipelines, activity logs, notes, tasks, calendar |
| **Analytics Service** | 3006 | Event tracking, metrics aggregation, reporting, dashboard data, export |
| **Workflow Service** | 3007 | Workflow definitions, trigger evaluation, step execution, history |
| **Integration Service** | 3008 | Third-party connectors, webhooks, OAuth flows, data sync, marketplace |

---

## Multi-Tenant Architecture

LeadAI Platform uses a **shared database, schema-per-tenant** approach for PostgreSQL and **tenant-scoped document partitioning** for MongoDB.

### Data Isolation Strategy

- Every PostgreSQL table includes a `tenant_id UUID` column with row-level security (RLS) policies
- All queries are automatically scoped via middleware injecting the tenant context
- MongoDB collections use a `tenantId` field on all documents with compound indexes
- Redis keys are namespaced: `tenant:{tenantId}:{resource}:{key}`
- Kafka topics are partitioned by tenant ID for parallel processing
- File storage uses tenant-isolated S3 prefixes: `s3://{bucket}/{tenantId}/`

### Tenant Onboarding Flow

1. Tenant record created in `tenants` table
2. RLS policy activated for tenant
3. Default subscription assigned
4. Admin user created and invited
5. Welcome workflow triggered

---

## Event-Driven Patterns

The platform relies heavily on domain events for loose coupling between services.

### Key Kafka Topics

| Topic | Published By | Consumed By |
|-------|-------------|-------------|
| `leads.created` | Lead Service | AI Service, Workflow Service, Analytics Service |
| `leads.scored` | AI Service | Lead Service, CRM Service |
| `deals.stage_changed` | CRM Service | Workflow Service, Analytics Service, AI Service |
| `campaigns.sent` | Comms Service | Analytics Service |
| `billing.subscription_created` | Billing Service | Auth Service, Lead Service |
| `workflows.triggered` | Workflow Service | Comms Service, CRM Service |
| `agents.task_completed` | AI Service | Workflow Service, Analytics Service |

---

## Security Architecture

### Authentication & Authorization
- **OAuth 2.0 / OIDC** via Keycloak (self-hosted) or Auth0 (cloud)
- **JWT Bearer tokens** with short expiry (15min access, 7d refresh)
- **RBAC** — Roles: `super_admin`, `tenant_admin`, `manager`, `agent`, `viewer`, `readonly`
- **API Keys** for programmatic access with scoped permissions

### Data Security
- **Encryption at rest**: AES-256 for all databases
- **Encryption in transit**: TLS 1.3 enforced everywhere
- **Field-level encryption**: PII fields (phone, email) encrypted in PostgreSQL
- **mTLS** between internal microservices in Kubernetes

### Compliance
- GDPR-compliant data handling with right-to-delete support
- Indian DPDP Act 2023 compliance for personal data
- WhatsApp Business Policy compliance
- SOC 2 Type II target (Year 2)

---

## Scalability Considerations

- **Horizontal scaling**: All services are stateless and scale via Kubernetes HPA
- **Database scaling**: PostgreSQL read replicas, MongoDB sharding (Phase 3)
- **Cache-first**: Redis caching for frequently accessed tenant data
- **Queue-based load leveling**: Kafka buffers burst traffic from lead ingestion
- **CDN**: Static assets and API responses cached at Cloudflare edge
- **Auto-scaling**: Kubernetes HPA based on CPU/memory and custom Kafka lag metrics
- **Circuit breakers**: Resilience4j patterns for external API calls (WhatsApp, LLMs)
