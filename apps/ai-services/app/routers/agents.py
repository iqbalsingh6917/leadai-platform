from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import Optional
from app.scoring.engine import LeadScoringEngine
from app.nlp.processor import NLPProcessor
from app.llm.gateway import LLMGateway
from app.agents.orchestrator import OrchestratorAgent, VALID_TASKS
from app.config import get_settings

router = APIRouter(prefix="/agents", tags=["Agents"])


class AgentRunRequest(BaseModel):
    task_type: str
    lead_id: str = ""
    tenant_id: str = ""
    input_data: dict = {}


def _get_orchestrator() -> OrchestratorAgent:
    settings = get_settings()
    return OrchestratorAgent(
        scoring_engine=LeadScoringEngine(),
        nlp_processor=NLPProcessor(),
        llm_gateway=LLMGateway(settings),
    )


@router.post("/run")
async def run_agent(request: AgentRunRequest = Body(...)) -> dict:
    orchestrator = _get_orchestrator()
    result = await orchestrator.run(
        task_type=request.task_type,
        lead_id=request.lead_id,
        tenant_id=request.tenant_id,
        input_data=request.input_data,
    )
    return {"task_type": request.task_type, "lead_id": request.lead_id, "result": result}


@router.get("/health")
async def agent_health() -> dict:
    return {
        "status": "ok",
        "agents": list(VALID_TASKS),
        "capabilities": sorted(VALID_TASKS),
    }
