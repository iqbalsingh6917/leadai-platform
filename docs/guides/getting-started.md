# 🚀 Getting Started

Welcome to LeadAI Platform! This guide will help you get the development environment running on your local machine.

---

## Prerequisites

Ensure the following tools are installed before proceeding:

| Tool | Minimum Version | Install |
|------|----------------|---------|
| [Docker](https://docs.docker.com/get-docker/) | 24.x | Required for infrastructure services |
| [Docker Compose](https://docs.docker.com/compose/) | 2.x | Bundled with Docker Desktop |
| [Node.js](https://nodejs.org/) | 20.x LTS | Required for frontend & API |
| [Python](https://www.python.org/downloads/) | 3.12+ | Required for AI services |
| [Git](https://git-scm.com/) | 2.x | Version control |

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/iqbalsingh6917/leadai-platform.git
cd leadai-platform
```

---

## Step 2: Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values. At minimum, you need:
- Database credentials (defaults work for local dev)
- An OpenAI API key for AI features
- A WhatsApp Business API token (optional for initial setup)

---

## Step 3: Start Infrastructure Services

```bash
docker-compose -f infrastructure/docker/docker-compose.yml up -d
```

This starts:
- PostgreSQL 16 on port `5432`
- MongoDB 7 on port `27017`
- Redis 7 on port `6379`
- Apache Kafka on port `9092`
- Elasticsearch 8 on port `9200`

Wait ~60 seconds for all services to be healthy, then verify:

```bash
docker-compose -f infrastructure/docker/docker-compose.yml ps
```

All services should show `healthy` status.

---

## Step 4: Set Up the Backend API (NestJS)

```bash
cd apps/api
npm install
npm run db:migrate    # Run PostgreSQL migrations
npm run db:seed       # Seed demo data (optional)
npm run start:dev     # Start in watch mode
```

The API will be available at: `http://localhost:3000`
Swagger docs at: `http://localhost:3000/api/docs`

---

## Step 5: Set Up the Frontend (Next.js)

```bash
cd apps/web
npm install
npm run dev
```

The web app will be available at: `http://localhost:3001`

---

## Step 6: Set Up AI Services (Python/FastAPI)

```bash
cd apps/ai-services
python -m venv .venv
source .venv/bin/activate      # macOS/Linux
# .\.venv\Scripts\activate     # Windows

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

AI services will be available at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

## Step 7: Seed Demo Data (Optional)

```bash
chmod +x scripts/seed-data.sh
./scripts/seed-data.sh
```

This creates:
- A demo tenant
- An admin user (`admin@demo.leadai.in` / `demo123`)
- Sample leads and pipeline data

---

## Verify Everything is Working

| Service | URL | Expected |
|---------|-----|---------|
| Web App | `http://localhost:3001` | Login page |
| API | `http://localhost:3000/health` | `{"status":"ok"}` |
| API Docs | `http://localhost:3000/api/docs` | Swagger UI |
| AI Services | `http://localhost:8000/health` | `{"status":"ok"}` |
| AI Docs | `http://localhost:8000/docs` | FastAPI Swagger |

---

## Troubleshooting

### Docker services not starting
```bash
# Check logs
docker-compose -f infrastructure/docker/docker-compose.yml logs postgres
docker-compose -f infrastructure/docker/docker-compose.yml logs kafka
```

### Port conflicts
If you have other services using default ports, edit `infrastructure/docker/docker-compose.yml` to change port mappings.

### Database migration errors
```bash
cd apps/api
npm run db:reset    # Reset and re-run all migrations
```

---

## Next Steps

- [Environment Setup](environment-setup.md) — Full environment variable reference
- [Deployment Guide](deployment.md) — Deploy to staging/production
- [API Reference](../api/README.md) — Explore API endpoints
