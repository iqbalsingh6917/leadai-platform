# 🛠️ Scripts

Utility scripts for setting up and managing the LeadAI Platform development environment.

## Available Scripts

| Script | Description |
|--------|-------------|
| `setup.sh` | Initial project setup — checks dependencies, creates `.env`, starts Docker services |
| `seed-data.sh` | Seeds demo data into the database for development and testing |

## Usage

```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Initial setup
./scripts/setup.sh

# Seed demo data
./scripts/seed-data.sh
```
