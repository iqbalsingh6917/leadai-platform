from fastapi import APIRouter
from app.scoring.engine import LeadScoringEngine
from app.nlp.processor import NLPProcessor
from app.llm.gateway import LLMGateway
from app.agents.orchestrator import OrchestratorAgent
from app.config import get_settings

router = APIRouter(prefix="/agents", tags=["Agents"])


def _get_orchestrator() -> OrchestratorAgent:
    settings = get_settings()
    return OrchestratorAgent(
        scoring_engine=LeadScoringEngine(),
        nlp_processor=NLPProcessor(),
        llm_gateway=LLMGateway(settings),
    )


@router.post("/run")
async def run_agent(task_type: str, lead_id: str, tenant_id: str, input_data: dict) -> dict:
    orchestrator = _get_orchestrator()
    result = await orchestrator.run(
        task_type=task_type, lead_id=lead_id, tenant_id=tenant_id, input_data=input_data
    )
    return {"task_type": task_type, "lead_id": lead_id, "result": result}


@router.get("/health")
async def agent_health() -> dict:
    return {
        "status": "ok",
        "agents": ["orchestrator"],
        "capabilities": ["score_lead", "analyze_intent", "generate_summary"],
    }
