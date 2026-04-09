# 🏗️ Terraform Infrastructure as Code

> **Status:** Planned for Phase 2 (Month 5+)

This directory will contain Terraform configurations for provisioning all AWS cloud infrastructure for LeadAI Platform.

## Planned Infrastructure

```
infrastructure/terraform/
├── environments/
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   └── production/
│       ├── main.tf
│       ├── variables.tf
│       └── terraform.tfvars
├── modules/
│   ├── vpc/                    # VPC, subnets, NAT gateways
│   ├── eks/                    # EKS cluster, node groups
│   ├── rds/                    # RDS PostgreSQL
│   ├── elasticache/            # ElastiCache Redis
│   ├── msk/                    # Amazon MSK (Kafka)
│   ├── s3/                     # S3 buckets + policies
│   ├── cloudfront/             # CloudFront distributions
│   ├── route53/                # DNS records
│   └── iam/                    # IAM roles and policies
└── README.md
```

## AWS Resources to be Provisioned

| Resource | Service | Purpose |
|----------|---------|---------|
| **VPC** | AWS VPC | Isolated network with public/private subnets |
| **EKS Cluster** | Amazon EKS | Kubernetes cluster for application workloads |
| **Node Groups** | EC2 Auto Scaling | Worker nodes (on-demand + spot instances) |
| **PostgreSQL** | Amazon RDS | Primary relational database |
| **Redis** | Amazon ElastiCache | Cache and session store |
| **Kafka** | Amazon MSK | Event streaming |
| **File Storage** | Amazon S3 | Media, exports, backups |
| **CDN** | Amazon CloudFront | Static asset delivery |
| **DNS** | Amazon Route 53 | Domain management |
| **Container Registry** | Amazon ECR | Docker image storage |
| **Secrets** | AWS Secrets Manager | Credential management |
| **Load Balancer** | AWS ALB | Ingress traffic distribution |
| **IAM** | AWS IAM | Role-based cloud access control |

## Prerequisites

- [Terraform](https://www.terraform.io/) >= 1.6
- [AWS CLI](https://aws.amazon.com/cli/) configured
- [kubectl](https://kubernetes.io/docs/tasks/tools/) for K8s management
- S3 bucket for Terraform remote state
- DynamoDB table for state locking

## Usage (Future)

```bash
# Initialize Terraform
cd infrastructure/terraform/environments/staging
terraform init

# Plan changes
terraform plan -var-file="terraform.tfvars"

# Apply changes
terraform apply -var-file="terraform.tfvars"

# Destroy (staging only!)
terraform destroy -var-file="terraform.tfvars"
```

## Cost Estimates (Monthly, USD)

| Environment | Estimate |
|-------------|---------|
| Development (local Docker) | $0 |
| Staging (minimal cluster) | ~$200–300/mo |
| Production (initial) | ~$800–1,200/mo |
| Production (scaled, 1000+ tenants) | ~$3,000–5,000/mo |
