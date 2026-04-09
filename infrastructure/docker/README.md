# 🐳 Docker Infrastructure

Docker Compose configuration for running all LeadAI Platform infrastructure services locally.

## Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| **postgres** | postgres:16 | 5432 | Primary relational database |
| **mongodb** | mongo:7 | 27017 | Document store for interactions/templates |
| **redis** | redis:7-alpine | 6379 | Cache, sessions, pub/sub |
| **zookeeper** | confluentinc/cp-zookeeper:7.5.0 | 2181 | Kafka cluster coordinator |
| **kafka** | confluentinc/cp-kafka:7.5.0 | 9092 | Event streaming / message broker |
| **elasticsearch** | elasticsearch:8.12.0 | 9200 | Full-text search |

## Usage

```bash
# Start all services
docker-compose up -d

# View service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (full reset)
docker-compose down -v
```

## Health Checks

All services include health checks. Wait for all to show `healthy` status:

```bash
docker-compose ps
# Should show (healthy) for all services
```

## Data Persistence

Data is persisted in named Docker volumes:
- `postgres_data` — PostgreSQL data files
- `mongodb_data` — MongoDB data files
- `redis_data` — Redis data files
- `elasticsearch_data` — Elasticsearch indices

Volumes persist across `docker-compose down` but are removed with `docker-compose down -v`.
