# 🤖 AI Services — LeadAI Platform

Python-based AI/ML microservices built with FastAPI and LangChain/LangGraph.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [FastAPI](https://fastapi.tiangolo.com/) | High-performance async API framework |
| [LangChain](https://www.langchain.com/) | LLM orchestration and chains |
| [LangGraph](https://langchain-ai.github.io/langgraph/) | Multi-agent state machine orchestration |
| [OpenAI SDK](https://platform.openai.com/docs) | GPT-4o and embedding APIs |
| [Anthropic SDK](https://docs.anthropic.com/) | Claude 3.5 APIs |
| [Google Generative AI](https://ai.google.dev/) | Gemini APIs |
| [scikit-learn](https://scikit-learn.org/) | Traditional ML for scoring models |
| [spaCy](https://spacy.io/) | NLP processing (NER, intent detection) |
| [Pinecone](https://www.pinecone.io/) | Vector database client |
| [Pydantic](https://docs.pydantic.dev/) | Data validation and settings |
| [Celery](https://docs.celeryq.dev/) | Async task queue for agent jobs |

## Services

| Service | Description |
|---------|-------------|
| **AI Agent Orchestrator** | Manages the 11-agent system via LangGraph state machines |
| **Lead Scoring Engine** | Hybrid ML+LLM scoring (BANT, engagement, behavior signals) |
| **NLP Processing** | Intent detection, entity extraction, sentiment analysis on conversations |
| **LLM Gateway** | Unified interface to OpenAI/Claude/Gemini with fallback and cost tracking |
| **Vector Search** | Semantic search over lead data, templates, and knowledge base |
| **Campaign Optimizer** | AI-driven content and timing optimization for campaigns |
| **Voice AI Processor** | Call transcript processing, sentiment, follow-up generation |

## Getting Started

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
# .\.venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn main:app --reload --port 8000

# Run tests
pytest

# Run with coverage
pytest --cov=app tests/ --cov-report=html
```

## API Documentation

FastAPI auto-generated docs available at: `http://localhost:8000/docs`

## Project Structure

```
apps/ai-services/
├── app/
│   ├── agents/             # LangGraph agent definitions
│   │   ├── orchestrator.py
│   │   ├── qualifier.py
│   │   ├── nurture.py
│   │   └── ...
│   ├── scoring/            # Lead scoring models
│   ├── nlp/                # NLP processing pipelines
│   ├── llm/                # LLM gateway and prompt templates
│   ├── vector/             # Vector search utilities
│   ├── routers/            # FastAPI route handlers
│   ├── models/             # Pydantic models
│   └── config.py           # Settings and configuration
├── tests/                  # pytest test suites
├── requirements.txt
└── main.py                 # FastAPI app entry point
```

## AI Agents

See [docs/architecture/ai-agent-architecture.md](../../docs/architecture/ai-agent-architecture.md) for full details on all 11 agents.
