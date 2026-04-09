# ☸️ Kubernetes Deployment

> **Status:** Planned for Phase 2 (Month 5+)

This directory will contain Kubernetes manifests for deploying LeadAI Platform to production.

## Planned Structure

```
infrastructure/kubernetes/
├── namespaces/
│   ├── leadai-production.yaml
│   └── leadai-staging.yaml
├── configmaps/
│   ├── api-config.yaml
│   ├── web-config.yaml
│   └── ai-services-config.yaml
├── secrets/
│   ├── db-credentials.yaml       # Sealed with Sealed Secrets
│   ├── api-keys.yaml
│   └── tls-certs.yaml
├── deployments/
│   ├── web-deployment.yaml
│   ├── api-deployment.yaml
│   ├── ai-services-deployment.yaml
│   └── redis-deployment.yaml
├── services/
│   ├── web-service.yaml
│   ├── api-service.yaml
│   └── ai-services-service.yaml
├── ingress/
│   └── leadai-ingress.yaml       # Traefik or Kong ingress
└── hpa/
    ├── api-hpa.yaml              # Horizontal Pod Autoscaler
    └── ai-services-hpa.yaml
```

## Cluster Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| Kubernetes | 1.28+ | 1.29+ |
| Nodes | 3 | 5+ |
| CPU per node | 4 vCPU | 8 vCPU |
| RAM per node | 8 GB | 16 GB |
| Storage | 100 GB | 500 GB |

## Cloud Provider Targets

- **Primary:** AWS EKS (ap-south-1 — Mumbai)
- **Secondary:** AWS EKS (us-east-1 — Virginia, Phase 4)
- **Alternative:** GKE, AKS (evaluated in Phase 3)

## Managed Services (Production)

In production, the following are **not** deployed in Kubernetes but use managed cloud services:

| Service | AWS Managed |
|---------|------------|
| PostgreSQL | Amazon RDS for PostgreSQL |
| MongoDB | Amazon DocumentDB or MongoDB Atlas |
| Redis | Amazon ElastiCache |
| Kafka | Amazon MSK |
| Elasticsearch | Amazon OpenSearch Service |

## GitOps with ArgoCD

All deployments will be managed via ArgoCD for GitOps-style CD:
- Staging: Auto-sync on `develop` branch updates
- Production: Manual approval via ArgoCD UI + Slack notification

## Secrets Management

All Kubernetes secrets will be encrypted using:
- **AWS Secrets Manager** for cloud-stored secrets
- **Sealed Secrets** (Bitnami) for GitOps-safe secret storage
