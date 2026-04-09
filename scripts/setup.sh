#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# LeadAI Platform — Development Environment Setup Script
# ============================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_banner() {
  echo ""
  echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║       🚀 LeadAI Platform — Setup                    ║${NC}"
  echo -e "${BLUE}║   AI-Native Digital Marketing Platform               ║${NC}"
  echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
  echo ""
}

check_command() {
  if ! command -v "$1" &> /dev/null; then
    echo -e "${RED}✗ $1 is not installed or not in PATH${NC}"
    echo "  Please install $1 and try again."
    echo "  $2"
    exit 1
  else
    echo -e "${GREEN}✓ $1 found$(command -v "$1" | xargs -- basename --) — OK${NC}"
  fi
}

print_banner

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"
echo ""

check_command "docker" "Install from: https://docs.docker.com/get-docker/"
check_command "docker-compose" "Install from: https://docs.docker.com/compose/install/"
check_command "git" "Install from: https://git-scm.com/"

echo ""
echo -e "${YELLOW}Step 2: Setting up environment file...${NC}"
echo ""

if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env from .env.example${NC}"
    echo -e "${YELLOW}  ⚠ Please edit .env and add your API keys before running apps${NC}"
  else
    echo -e "${RED}✗ .env.example not found. Please run this script from the project root.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}✓ .env file already exists — skipping${NC}"
fi

echo ""
echo -e "${YELLOW}Step 3: Starting infrastructure services with Docker Compose...${NC}"
echo ""

COMPOSE_FILE="infrastructure/docker/docker-compose.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
  echo -e "${RED}✗ docker-compose.yml not found at $COMPOSE_FILE${NC}"
  exit 1
fi

docker-compose -f "$COMPOSE_FILE" up -d

echo ""
echo -e "${YELLOW}Step 4: Waiting for services to be healthy...${NC}"
echo ""

sleep 10

echo -e "${GREEN}Service status:${NC}"
docker-compose -f "$COMPOSE_FILE" ps

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ LeadAI Platform setup complete!                 ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Edit .env and add your API keys (OpenAI, WhatsApp, etc.)"
echo "  2. Start the API:     cd apps/api && npm install && npm run start:dev"
echo "  3. Start the Web App: cd apps/web && npm install && npm run dev"
echo "  4. Start AI Services: cd apps/ai-services && pip install -r requirements.txt && uvicorn main:app --reload"
echo ""
echo -e "${BLUE}Service endpoints:${NC}"
echo "  PostgreSQL:     localhost:5432"
echo "  MongoDB:        localhost:27017"
echo "  Redis:          localhost:6379"
echo "  Kafka:          localhost:9092"
echo "  Elasticsearch:  localhost:9200"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "  Getting Started: docs/guides/getting-started.md"
echo "  API Reference:   docs/api/README.md"
echo ""
