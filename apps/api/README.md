# ⚙️ Backend API — LeadAI Platform

The core backend REST API built with NestJS, TypeORM, and multiple data stores.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [NestJS](https://nestjs.com/) | Node.js framework for scalable APIs |
| [TypeORM](https://typeorm.io/) | PostgreSQL ORM |
| [Mongoose](https://mongoosejs.com/) | MongoDB ODM |
| [ioredis](https://github.com/luin/ioredis) | Redis client |
| [KafkaJS](https://kafka.js.org/) | Kafka producer/consumer |
| [Passport.js](https://www.passportjs.org/) | Authentication strategies |
| [class-validator](https://github.com/typestack/class-validator) | DTO validation |
| [Swagger](https://swagger.io/) | API documentation |

## Modules

| Module | Description |
|--------|-------------|
| **AuthModule** | JWT authentication, refresh tokens, API keys, RBAC guards |
| **LeadsModule** | Lead CRUD, bulk import, scoring triggers, assignment |
| **ContactsModule** | Contact management, deduplication, activity tracking |
| **PipelinesModule** | Pipeline and stage management |
| **DealsModule** | Deal creation, stage transitions, win/loss tracking |
| **CampaignsModule** | Campaign lifecycle, scheduling, audience targeting |
| **WorkflowsModule** | Workflow definitions, trigger evaluation, step execution |
| **IntegrationsModule** | Third-party connectors, OAuth, data sync |
| **BillingModule** | Subscriptions, Razorpay/Stripe webhooks, invoices |
| **AnalyticsModule** | Metrics aggregation, dashboard data, export |
| **NotificationsModule** | Real-time notifications via WebSocket + Redis pub/sub |
| **WebhooksModule** | Inbound webhook processing (WhatsApp, payment, forms) |

## Getting Started

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed development data
npm run db:seed

# Start development server (with hot reload)
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test
npm run test:e2e
npm run test:coverage
```

## API Documentation

Swagger UI available at: `http://localhost:3000/api/docs`

## Project Structure

```
apps/api/
├── src/
│   ├── modules/            # Feature modules
│   │   ├── auth/
│   │   ├── leads/
│   │   ├── contacts/
│   │   ├── pipelines/
│   │   ├── deals/
│   │   ├── campaigns/
│   │   ├── workflows/
│   │   ├── integrations/
│   │   ├── billing/
│   │   ├── analytics/
│   │   ├── notifications/
│   │   └── webhooks/
│   ├── common/             # Shared decorators, guards, interceptors
│   ├── config/             # Configuration modules
│   ├── database/           # Migrations, seeds
│   └── main.ts             # Application entry point
├── test/                   # E2E tests
└── nest-cli.json
```
