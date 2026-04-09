# 🚢 Deployment Guide

## Deployment Environments

| Environment | Branch | Purpose |
|-------------|--------|---------|
| **Development** | `feature/*`, `bugfix/*` | Local development |
| **Staging** | `develop` | QA, integration testing, stakeholder demos |
| **Production** | `main` | Live customer-facing environment |

---

## Docker Deployment (Recommended for Staging)

### Build and Run with Docker Compose

```bash
# Build all services
docker-compose -f infrastructure/docker/docker-compose.yml \
               -f infrastructure/docker/docker-compose.staging.yml build

# Start all services
docker-compose -f infrastructure/docker/docker-compose.yml \
               -f infrastructure/docker/docker-compose.staging.yml up -d

# View logs
docker-compose logs -f --tail=100
```

### Staging Overrides (`docker-compose.staging.yml`)
The staging override file sets:
- Production-like resource limits
- External database connections (RDS instead of local Postgres)
- Staging environment variables

---

## Kubernetes Deployment (Production)

> See [infrastructure/kubernetes/README.md](../../infrastructure/kubernetes/README.md) for full K8s setup.

### Namespace Structure
```
leadai-production
├── apps/        — web, api, ai-services
├── infra/       — kafka, redis (or use managed services)
└── monitoring/  — prometheus, grafana
```

### Deploy to Kubernetes
```bash
# Apply all manifests
kubectl apply -f infrastructure/kubernetes/namespaces/
kubectl apply -f infrastructure/kubernetes/configmaps/
kubectl apply -f infrastructure/kubernetes/secrets/
kubectl apply -f infrastructure/kubernetes/deployments/
kubectl apply -f infrastructure/kubernetes/services/
kubectl apply -f infrastructure/kubernetes/ingress/

# Verify deployments
kubectl get pods -n leadai-production
```

### Rolling Updates
```bash
# Update image tag (ArgoCD handles this automatically in CD pipeline)
kubectl set image deployment/leadai-api \
  api=ghcr.io/iqbalsingh6917/leadai-api:v1.2.0 \
  -n leadai-production
```

---

## CI/CD Pipeline

### Overview

```
Developer Push
     │
     ▼
GitHub Actions (CI)
  ├── Lint (ESLint, Ruff)
  ├── Unit Tests
  ├── Integration Tests
  ├── Build Docker Images
  ├── Push to GHCR (GitHub Container Registry)
  └── Trigger ArgoCD Sync
          │
          ▼
     ArgoCD (CD)
       ├── Staging: Auto-sync on develop branch
       └── Production: Manual approval required
```

### GitHub Actions Workflows

| Workflow | Trigger | Action |
|----------|---------|--------|
| `ci.yml` | PR to main | Lint, Test, Build |
| `deploy-staging.yml` | Push to develop | Build + deploy to staging |
| `deploy-prod.yml` | Tag `v*.*.*` | Build + deploy to production (manual approval) |

---

## Environment Variables

Critical environment variables per environment:

| Variable | Dev | Staging | Prod |
|----------|-----|---------|------|
| `NODE_ENV` | `development` | `staging` | `production` |
| `DATABASE_URL` | Local Postgres | RDS (staging) | RDS (prod) |
| `REDIS_URL` | Local Redis | ElastiCache | ElastiCache |
| `LOG_LEVEL` | `debug` | `info` | `warn` |
| `RATE_LIMIT_ENABLED` | `false` | `true` | `true` |

See [environment-setup.md](environment-setup.md) for the full list.

---

## Health Checks and Monitoring

All services expose health check endpoints:

```
GET /health          → { "status": "ok", "version": "1.0.0" }
GET /health/ready    → Readiness probe (DB + Redis connected)
GET /health/live     → Liveness probe (process running)
```

Monitoring stack:
- **Prometheus** — Metrics collection
- **Grafana** — Dashboards
- **OpenTelemetry** — Distributed tracing
- **PagerDuty** — On-call alerting (production)

---

## Rollback Procedure

```bash
# Kubernetes rollback
kubectl rollout undo deployment/leadai-api -n leadai-production

# Or roll back to specific revision
kubectl rollout undo deployment/leadai-api --to-revision=3 -n leadai-production

# Check rollout history
kubectl rollout history deployment/leadai-api -n leadai-production
```
