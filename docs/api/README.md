# 🔌 API Reference

## Overview

The LeadAI Platform REST API provides programmatic access to all platform features. All endpoints are versioned, JSON-based, and secured with JWT or API key authentication.

**Base URL:** `https://api.leadai.in/v1`

---

## REST API Conventions

### Authentication

All API requests require an `Authorization` header:

```http
Authorization: Bearer <jwt_token>
```

Or for programmatic access:
```http
X-API-Key: <your_api_key>
```

### Request Format

- Content-Type: `application/json`
- All timestamps: ISO 8601 (`2026-01-15T10:30:00Z`)
- Currency amounts: integer paise (INR) or cents (USD)

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Format

```json
{
  "success": false,
  "error": {
    "code": "LEAD_NOT_FOUND",
    "message": "Lead with id abc123 was not found",
    "details": {}
  }
}
```

### Pagination

```http
GET /v1/leads?page=2&perPage=50&sortBy=createdAt&sortOrder=desc
```

### Versioning

API versioning uses URL prefixes: `/v1/`, `/v2/`, etc.

---

## Endpoint Groups

### 🔐 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/auth/login` | Email + password login |
| POST | `/v1/auth/refresh` | Refresh access token |
| POST | `/v1/auth/logout` | Invalidate token |
| POST | `/v1/auth/register` | Register new tenant + admin |
| GET | `/v1/auth/me` | Get current user |
| POST | `/v1/auth/api-keys` | Generate API key |
| DELETE | `/v1/auth/api-keys/:id` | Revoke API key |

### 👥 Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/leads` | List all leads (paginated, filterable) |
| POST | `/v1/leads` | Create a new lead |
| GET | `/v1/leads/:id` | Get lead details |
| PATCH | `/v1/leads/:id` | Update lead |
| DELETE | `/v1/leads/:id` | Delete lead |
| POST | `/v1/leads/import` | Bulk import leads (CSV/JSON) |
| POST | `/v1/leads/:id/score` | Trigger AI scoring |
| GET | `/v1/leads/:id/interactions` | Get lead interaction history |
| POST | `/v1/leads/:id/assign` | Assign lead to user |

### 📋 Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/contacts` | List contacts |
| POST | `/v1/contacts` | Create contact |
| GET | `/v1/contacts/:id` | Get contact |
| PATCH | `/v1/contacts/:id` | Update contact |
| DELETE | `/v1/contacts/:id` | Delete contact |
| GET | `/v1/contacts/:id/deals` | Get contact's deals |
| GET | `/v1/contacts/:id/activities` | Get contact activity log |

### 📊 Pipelines
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/pipelines` | List pipelines |
| POST | `/v1/pipelines` | Create pipeline |
| GET | `/v1/pipelines/:id` | Get pipeline with stages |
| PATCH | `/v1/pipelines/:id` | Update pipeline |
| DELETE | `/v1/pipelines/:id` | Delete pipeline |
| GET | `/v1/pipelines/:id/stages` | List stages |
| POST | `/v1/pipelines/:id/stages` | Create stage |
| PATCH | `/v1/pipelines/:id/stages/:stageId` | Update stage |
| DELETE | `/v1/pipelines/:id/stages/:stageId` | Delete stage |

### 💰 Deals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/deals` | List deals |
| POST | `/v1/deals` | Create deal |
| GET | `/v1/deals/:id` | Get deal |
| PATCH | `/v1/deals/:id` | Update deal |
| DELETE | `/v1/deals/:id` | Delete deal |
| POST | `/v1/deals/:id/move` | Move deal to stage |
| GET | `/v1/deals/:id/activities` | Deal activity log |

### 📧 Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/campaigns` | List campaigns |
| POST | `/v1/campaigns` | Create campaign |
| GET | `/v1/campaigns/:id` | Get campaign |
| PATCH | `/v1/campaigns/:id` | Update campaign |
| DELETE | `/v1/campaigns/:id` | Delete campaign |
| POST | `/v1/campaigns/:id/launch` | Launch campaign |
| POST | `/v1/campaigns/:id/pause` | Pause campaign |
| GET | `/v1/campaigns/:id/stats` | Campaign performance stats |

### ⚙️ Workflows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/workflows` | List workflows |
| POST | `/v1/workflows` | Create workflow |
| GET | `/v1/workflows/:id` | Get workflow |
| PATCH | `/v1/workflows/:id` | Update workflow |
| DELETE | `/v1/workflows/:id` | Delete workflow |
| POST | `/v1/workflows/:id/activate` | Activate workflow |
| POST | `/v1/workflows/:id/deactivate` | Deactivate workflow |
| GET | `/v1/workflows/:id/runs` | Get workflow execution history |

### 🔌 Integrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/integrations` | List available integrations |
| GET | `/v1/integrations/connected` | List connected integrations |
| POST | `/v1/integrations/:provider/connect` | Connect integration |
| DELETE | `/v1/integrations/:provider` | Disconnect integration |
| POST | `/v1/integrations/:provider/sync` | Trigger manual sync |

### 📈 Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/analytics/dashboard` | Dashboard summary metrics |
| GET | `/v1/analytics/leads` | Lead analytics |
| GET | `/v1/analytics/campaigns` | Campaign analytics |
| GET | `/v1/analytics/pipeline` | Pipeline analytics |
| GET | `/v1/analytics/revenue` | Revenue analytics |
| POST | `/v1/analytics/export` | Export report (CSV/PDF) |

### 💳 Billing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/billing/subscription` | Get current subscription |
| POST | `/v1/billing/subscription` | Create/upgrade subscription |
| DELETE | `/v1/billing/subscription` | Cancel subscription |
| GET | `/v1/billing/invoices` | List invoices |
| GET | `/v1/billing/invoices/:id` | Get invoice |
| GET | `/v1/billing/usage` | Current usage metrics |

---

> 📌 Full interactive API documentation will be available at `https://api.leadai.in/docs` (Swagger/OpenAPI 3.1).
