from fastapi import APIRouter
from app.models.lead import ScoreRequest, ScoreResponse
from app.scoring.engine import LeadScoringEngine

router = APIRouter(prefix="/scoring", tags=["Lead Scoring"])
_engine = LeadScoringEngine()


@router.post("/score", response_model=ScoreResponse)
async def score_lead(request: ScoreRequest) -> ScoreResponse:
    return _engine.score(request.lead)


@router.post("/score/batch", response_model=list[ScoreResponse])
async def score_leads_batch(leads: list[ScoreRequest]) -> list[ScoreResponse]:
    return [_engine.score(req.lead) for req in leads]
