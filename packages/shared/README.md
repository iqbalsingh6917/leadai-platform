# 📦 @leadai/shared — Shared TypeScript Package

Shared TypeScript types, interfaces, constants, utilities, and validation schemas used across all LeadAI Platform packages and apps.

## Contents

### Type Definitions & Interfaces

```typescript
// Lead types
interface Lead { id: string; tenantId: string; name?: string; email?: string; ... }
interface LeadWithScore extends Lead { aiScore: number; aiScoreReason: string; }

// Contact types
interface Contact { id: string; tenantId: string; name: string; ... }

// Pipeline & Deal types
interface Pipeline { id: string; name: string; stages: PipelineStage[]; }
interface Deal { id: string; pipelineId: string; stageId: string; value: number; }

// Campaign types
interface Campaign { id: string; type: CampaignType; status: CampaignStatus; ... }

// User & Auth types
interface User { id: string; tenantId: string; email: string; role: UserRole; }
interface Tenant { id: string; slug: string; planType: PlanType; }
```

### Enums

```typescript
enum LeadStatus { NEW = 'new', CONTACTED = 'contacted', QUALIFIED = 'qualified',
  CONVERTED = 'converted', DISQUALIFIED = 'disqualified' }

enum LeadSource { FACEBOOK = 'facebook', GOOGLE = 'google', WHATSAPP = 'whatsapp',
  EMAIL = 'email', MANUAL = 'manual', API = 'api', WEBSITE = 'website' }

enum PipelineStage { LEAD = 'lead', PROSPECT = 'prospect', PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation', WON = 'won', LOST = 'lost' }

enum CampaignType { EMAIL = 'email', WHATSAPP = 'whatsapp', SMS = 'sms',
  MULTI_CHANNEL = 'multi_channel' }

enum CampaignStatus { DRAFT = 'draft', SCHEDULED = 'scheduled', RUNNING = 'running',
  PAUSED = 'paused', COMPLETED = 'completed', FAILED = 'failed' }

enum UserRole { SUPER_ADMIN = 'super_admin', TENANT_ADMIN = 'tenant_admin',
  MANAGER = 'manager', AGENT = 'agent', VIEWER = 'viewer', READONLY = 'readonly' }

enum PlanType { FREE_TRIAL = 'free_trial', STARTER = 'starter', GROWTH = 'growth',
  PROFESSIONAL = 'professional', AGENCY = 'agency', ENTERPRISE = 'enterprise' }

enum ServiceModel { SELF_SERVICE = 'self_service', MANAGED = 'managed', HYBRID = 'hybrid' }
```

### Constants

```typescript
export const LEAD_SCORE_TIERS = { HOT: 80, WARM: 50, COLD: 0 } as const;
export const MAX_LEADS_PER_IMPORT = 10000;
export const DEFAULT_PAGINATION = { page: 1, perPage: 20 };
export const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'] as const;
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'ta', 'te', 'bn'] as const;
```

### Validation Schemas (Zod)

```typescript
import { z } from 'zod';

export const CreateLeadSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  source: z.nativeEnum(LeadSource),
  tags: z.array(z.string()).default([]),
  customFields: z.record(z.unknown()).default({}),
});

export const CreateDealSchema = z.object({
  title: z.string().min(1).max(255),
  value: z.number().positive().optional(),
  currency: z.string().length(3).default('INR'),
  pipelineId: z.string().uuid(),
  stageId: z.string().uuid(),
});
```

### Utility Functions

```typescript
export function formatCurrency(amount: number, currency: string): string;
export function calculateLeadScore(lead: Lead, weights: ScoreWeights): number;
export function generateSlug(name: string): string;
export function maskEmail(email: string): string;  // user@example.com → u***@example.com
export function maskPhone(phone: string): string;  // +919876543210 → +91987****210
export function paginate<T>(items: T[], page: number, perPage: number): PaginatedResult<T>;
```

## Installation

```bash
# From within the monorepo
npm install @leadai/shared
```

## Usage

```typescript
import { Lead, LeadStatus, LeadSource, CreateLeadSchema } from '@leadai/shared';

const lead: Lead = { id: '...', tenantId: '...', status: LeadStatus.NEW, ... };
const validated = CreateLeadSchema.parse(incomingData);
```
