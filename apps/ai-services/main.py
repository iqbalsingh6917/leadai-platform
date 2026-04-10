from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import scoring, nlp, agents

app = FastAPI(
    title="LeadAI AI Services",
    description="AI/ML microservice for LeadAI Platform",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

app.include_router(scoring.router, prefix=API_PREFIX)
app.include_router(nlp.router, prefix=API_PREFIX)
app.include_router(agents.router, prefix=API_PREFIX)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "leadai-ai-services"}
