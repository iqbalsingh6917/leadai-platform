# 🚀 LeadAI Platform

<div align="center">

<!-- Logo placeholder -->
<img src="docs/assets/logo-placeholder.png" alt="LeadAI Platform Logo" width="200" />

**The world's first AI-native, transparent digital marketing platform where businesses pay for software, not hidden margins on their marketing spend.**

[![Build Status](https://github.com/iqbalsingh6917/leadai-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/iqbalsingh6917/leadai-platform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## 🌟 Vision

> **"The world's first AI-native, transparent digital marketing platform where businesses pay for software, not hidden margins on their marketing spend."**

LeadAI Platform replaces expensive, opaque, and complex marketing tools with an affordable, transparent, AI-first solution built for Indian SMBs — and scalable globally.

---

## 🧭 Core Principles

| # | Principle | Description |
|---|-----------|-------------|
| 🤖 | **AI-First** | AI is the core of every feature, not an add-on bolted on later |
| 🔍 | **Transparent Bridge** | Zero markup on third-party costs — clients see real invoices |
| 🤝 | **Trust Over Profit** | Low margins early, earn trust, grow together |
| ⚡ | **Automation Over Manual** | 80% automated workflows, 20% human decisions |
| 🇮🇳 | **India-First, World-Ready** | WhatsApp-native, Indian languages, UPI payments |
| ✨ | **Simplicity Over Complexity** | 15-minute onboarding, no consultants needed |

---

## ✨ Key Features

### Phase 1 — MVP (Months 1–4)
- 📥 **Unified Lead Inbox** — All leads from all sources in one place
- 🎯 **AI Lead Scoring** — Auto-rank leads by conversion probability
- 💬 **WhatsApp Automation** — Drip campaigns, auto-replies, broadcast
- 📧 **Email Automation** — Sequences, templates, tracking
- 📊 **Visual Pipeline** — Drag-and-drop deal management
- 📈 **Performance Dashboard** — Real-time ROI and campaign metrics

### Phase 2 — Intelligence (Months 5–8)
- 🤖 **Multi-Agent AI System** — 10+ specialized AI agents working in parallel
- 🔄 **Visual Workflow Builder** — No-code automation canvas
- 💰 **Smart Budget AI** — Auto-optimize ad spend across channels
- 🎙️ **Voice AI** — AI-powered call analysis and follow-ups
- 🔮 **Predictive Analytics** — Revenue forecasting and churn prediction

### Phase 3 — Scale (Months 9–14)
- 🏷️ **White-Label** — Full rebrandable platform for agencies
- 🔌 **Integration Marketplace** — 50+ connectors
- 🚀 **Campaign Autopilot** — Fully autonomous campaign management
- 🧠 **Knowledge Graph** — Cross-tenant industry insights

### Phase 4 — Global (Months 15+)
- 🌍 **Multi-Region** — US, EU, SEA deployments
- 🔧 **BYOAI** — Bring Your Own AI model
- 🛒 **Conversational Commerce** — WhatsApp checkout integration
- 📱 **Mobile App** — iOS & Android

---

## 💼 Three Service Models

### 1. 🧑‍💻 Self-Service (₹499–₹4,999/mo)
Full control of your marketing. AI Copilot suggests, you decide. Perfect for growth-stage startups and SMBs.

### 2. 🤝 Managed Service (₹9,999–₹24,999/mo)
Our team handles all campaigns, content, and optimization. Client gets a read-only live dashboard. Transparent cost pass-through — you see exactly what we spend on ads.

### 3. ⚡ Hybrid (₹1,499–₹3,499/mo)
Per-channel toggle between self-service and managed. You control SEO, we run your paid ads. Mix and match as needed.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14+ (React) + Tailwind CSS |
| **Backend API** | Node.js (NestJS) |
| **AI/ML Services** | Python (FastAPI) |
| **AI Orchestration** | LangChain / LangGraph |
| **LLM APIs** | OpenAI + Claude + Gemini |
| **Primary Database** | PostgreSQL 16 |
| **Document Store** | MongoDB 7 |
| **Cache** | Redis 7 |
| **Search** | Elasticsearch 8 |
| **Vector Database** | Pinecone / Weaviate |
| **Knowledge Graph** | Neo4j (Phase 3) |
| **Message Broker** | Apache Kafka |
| **Auth** | Keycloak / Auth0 |
| **API Gateway** | Kong / Traefik |
| **Containerization** | Docker + Kubernetes |
| **CI/CD** | GitHub Actions + ArgoCD |
| **Monitoring** | OpenTelemetry + Prometheus + Grafana |
| **CDN** | Cloudflare |
| **Cloud** | AWS (primary) |
| **Payment** | Razorpay (India) + Stripe (Global) |
| **WhatsApp** | Official WhatsApp Business API |
| **Email** | SendGrid / Mailgun |

---

## 📁 Project Structure

```
leadai-platform/
├── apps/
│   ├── web/                    # Next.js 14+ frontend
│   ├── api/                    # NestJS backend API
│   ├── ai-services/            # Python FastAPI AI/ML services
│   └── mobile/                 # React Native / Flutter (Phase 4)
├── packages/
│   ├── shared/                 # Shared TypeScript types & utilities
│   ├── ui/                     # Shared React UI component library
│   └── ai-agents/              # AI Agent definitions & interfaces
├── infrastructure/
│   ├── docker/                 # Docker Compose configurations
│   ├── kubernetes/             # K8s manifests (Phase 2+)
│   └── terraform/              # IaC for cloud infrastructure
├── docs/
│   ├── architecture/           # System, DB, AI agent architecture
│   ├── api/                    # API documentation
│   ├── guides/                 # Getting started, deployment guides
│   └── business/               # Pricing, roadmap, competitive analysis
├── scripts/                    # Setup and utility scripts
├── tests/                      # Test suites
├── .github/
│   ├── workflows/              # GitHub Actions CI/CD
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js 20+](https://nodejs.org/)
- [Python 3.12+](https://www.python.org/)
- [Git](https://git-scm.com/)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/iqbalsingh6917/leadai-platform.git
cd leadai-platform

# 2. Run the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. Or manually start infrastructure services
cp .env.example .env
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# 4. Verify all services are running
docker-compose -f infrastructure/docker/docker-compose.yml ps
```

For detailed setup instructions, see [docs/guides/getting-started.md](docs/guides/getting-started.md).

---

## 💰 Pricing Summary

| Plan | Price | Leads/mo | Users | Best For |
|------|-------|----------|-------|----------|
| Free Trial | ₹0 | 100 | 1 | Testing |
| Starter | ₹499/mo | 500 | 2 | Solopreneurs |
| Growth | ₹999/mo | 2,000 | 5 | Small Teams |
| Professional | ₹1,999/mo | 10,000 | 15 | Growing Biz |
| Agency | ₹4,999/mo | Unlimited | 50 | Agencies |
| Managed Basic | ₹9,999/mo | Included | — | Hands-off |
| Managed Pro | ₹24,999/mo | Included | — | Full Service |
| Hybrid Starter | ₹1,499/mo | 2,000 | 5 | Flexible |

See full pricing details in [docs/business/pricing-strategy.md](docs/business/pricing-strategy.md).

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for Indian SMBs and global businesses**

[Website](https://leadai.in) · [Documentation](docs/README.md) · [Issues](https://github.com/iqbalsingh6917/leadai-platform/issues)

</div>