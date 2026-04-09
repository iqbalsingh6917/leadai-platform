# ⚙️ Environment Setup

This document describes all required environment variables for LeadAI Platform.

Copy `.env.example` to `.env` and fill in the appropriate values for your environment.

```bash
cp .env.example .env
```

---

## Environment Variable Reference

### 🗄️ Database

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://leadai:pass@localhost:5432/leadai` |
| `DATABASE_SSL` | Enable SSL for PostgreSQL | `false` (dev), `true` (prod) |
| `DATABASE_POOL_SIZE` | Connection pool size | `10` |

### 🍃 MongoDB

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://leadai:pass@localhost:27017/leadai` |
| `MONGODB_DB_NAME` | Database name | `leadai` |

### 🔴 Redis

| Variable | Description | Example |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `REDIS_PASSWORD` | Redis password | (empty for dev) |
| `REDIS_TLS` | Enable Redis TLS | `false` |

### 📨 Kafka

| Variable | Description | Example |
|----------|-------------|---------|
| `KAFKA_BROKERS` | Kafka broker list | `localhost:9092` |
| `KAFKA_CLIENT_ID` | Client identifier | `leadai-api` |
| `KAFKA_GROUP_ID` | Consumer group ID | `leadai-consumers` |

### 🔍 Elasticsearch

| Variable | Description | Example |
|----------|-------------|---------|
| `ELASTICSEARCH_URL` | Elasticsearch URL | `http://localhost:9200` |
| `ELASTICSEARCH_USERNAME` | Username | `elastic` |
| `ELASTICSEARCH_PASSWORD` | Password | (blank for dev) |

### 🔐 Authentication

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret for JWT signing | `your-super-secret-min-32-chars` |
| `JWT_ACCESS_EXPIRES` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES` | Refresh token expiry | `7d` |
| `AUTH_PROVIDER` | Auth provider | `local` \| `keycloak` \| `auth0` |
| `KEYCLOAK_URL` | Keycloak base URL | `http://localhost:8080` |
| `KEYCLOAK_REALM` | Keycloak realm | `leadai` |
| `KEYCLOAK_CLIENT_ID` | Client ID | `leadai-api` |
| `KEYCLOAK_CLIENT_SECRET` | Client secret | `...` |

### 🤖 AI / LLM APIs

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `OPENAI_MODEL` | Default model | `gpt-4o` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | `sk-ant-...` |
| `ANTHROPIC_MODEL` | Default Claude model | `claude-3-5-sonnet-20241022` |
| `GOOGLE_AI_API_KEY` | Google Gemini API key | `AIza...` |
| `GOOGLE_AI_MODEL` | Default Gemini model | `gemini-1.5-pro` |
| `PINECONE_API_KEY` | Pinecone vector DB key | `...` |
| `PINECONE_ENVIRONMENT` | Pinecone environment | `us-east-1-aws` |
| `PINECONE_INDEX_NAME` | Pinecone index | `leadai-vectors` |

### 💬 WhatsApp

| Variable | Description | Example |
|----------|-------------|---------|
| `WHATSAPP_API_TOKEN` | WhatsApp Business API token | `EAABc...` |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID from Meta | `123456789` |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | WABA ID | `987654321` |
| `WHATSAPP_WEBHOOK_SECRET` | Webhook verification token | `your-webhook-secret` |

### 📧 Email

| Variable | Description | Example |
|----------|-------------|---------|
| `SENDGRID_API_KEY` | SendGrid API key | `SG....` |
| `SENDGRID_FROM_EMAIL` | Default from address | `noreply@leadai.in` |
| `MAILGUN_API_KEY` | Mailgun API key (alternative) | `key-...` |
| `MAILGUN_DOMAIN` | Mailgun domain | `mg.leadai.in` |

### 💳 Payment

| Variable | Description | Example |
|----------|-------------|---------|
| `RAZORPAY_KEY_ID` | Razorpay key ID | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | `...` |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret | `...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_live_...` |

### ☁️ AWS

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `...` |
| `AWS_REGION` | AWS region | `ap-south-1` |
| `S3_BUCKET` | S3 bucket name | `leadai-uploads-prod` |
| `S3_CDN_URL` | CloudFront CDN URL | `https://cdn.leadai.in` |

### 🌐 Application

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_URL` | Frontend URL | `https://app.leadai.in` |
| `API_URL` | Backend API URL | `https://api.leadai.in` |
| `NODE_ENV` | Node environment | `development` \| `staging` \| `production` |
| `PORT` | API server port | `3000` |
| `LOG_LEVEL` | Log verbosity | `debug` \| `info` \| `warn` \| `error` |
| `CORS_ORIGINS` | Allowed CORS origins | `https://app.leadai.in` |

---

## Minimal Dev Setup

For local development, you only need these variables set (others use defaults):

```env
DATABASE_URL=postgresql://leadai:leadai_dev@localhost:5432/leadai
MONGODB_URI=mongodb://leadai:leadai_dev@localhost:27017/leadai
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-change-in-production-min32chars
OPENAI_API_KEY=sk-your-key-here
NODE_ENV=development
```
