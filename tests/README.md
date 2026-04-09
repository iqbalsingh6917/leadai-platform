# 🧪 Testing Strategy

## Overview

LeadAI Platform follows a comprehensive testing strategy to ensure reliability, correctness, and regression prevention across all services.

---

## Test Types

### Unit Tests
- **Node.js / NestJS**: [Jest](https://jestjs.io/) with `@nestjs/testing`
- **Python / FastAPI**: [pytest](https://docs.pytest.org/) with `pytest-asyncio`
- **Coverage target**: ≥ 80%

### Integration Tests
- **API integration**: Supertest (NestJS) + test database instance
- **Python integration**: pytest with `httpx` and test fixtures

### End-to-End Tests
- **Web app**: [Playwright](https://playwright.dev/) (preferred) or [Cypress](https://www.cypress.io/)
- **API**: Supertest-based E2E test suites

---

## Directory Structure

```
tests/
├── e2e/                    # End-to-end tests (Playwright)
│   ├── auth.spec.ts
│   ├── leads.spec.ts
│   ├── pipeline.spec.ts
│   └── campaigns.spec.ts
├── integration/            # API integration tests
│   ├── leads.integration.ts
│   └── billing.integration.ts
└── fixtures/               # Shared test data and helpers
    ├── tenant.fixture.ts
    └── lead.fixture.ts

apps/api/src/**/*.spec.ts   # Unit tests co-located with source
apps/ai-services/tests/     # Python unit tests
```

---

## Coverage Requirements

| Layer | Minimum Coverage |
|-------|-----------------|
| API Services (NestJS) | ≥ 80% |
| AI Services (Python) | ≥ 75% |
| Shared Packages | ≥ 90% |
| Critical paths (auth, billing) | ≥ 95% |

---

## Running Tests

### Node.js (NestJS API)

```bash
cd apps/api

# Run all unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

### Python (FastAPI AI Services)

```bash
cd apps/ai-services

# Activate virtual environment
source .venv/bin/activate

# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/ --cov-report=html

# Run specific test file
pytest tests/test_lead_scoring.py

# Run with verbose output
pytest -v
```

### End-to-End (Playwright)

```bash
# Install Playwright browsers (first time)
npx playwright install

# Run all E2E tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# Run specific spec
npx playwright test tests/e2e/leads.spec.ts
```

---

## Test Conventions

### Naming
```typescript
// Good test names — describe the behavior
it('should return 404 when lead does not exist', ...);
it('should score lead as hot when AI score is above 80', ...);
it('should reject unauthorized requests with 401', ...);
```

### Test Structure (Arrange-Act-Assert)
```typescript
it('should create a lead successfully', async () => {
  // Arrange
  const createLeadDto = { name: 'John Doe', email: 'john@example.com' };

  // Act
  const response = await request(app).post('/v1/leads').send(createLeadDto);

  // Assert
  expect(response.status).toBe(201);
  expect(response.body.data.email).toBe('john@example.com');
});
```

### Test Isolation
- Each test should be independent and not rely on other tests
- Use `beforeEach` / `afterEach` to set up and clean up state
- Mock external services (WhatsApp API, LLMs, payment providers)

---

## CI Integration

Tests run automatically in GitHub Actions on every PR and push to `main`. See `.github/workflows/ci.yml`.
