from fastapi import APIRouter, Depends
from app.models.lead import IntentRequest, IntentResponse, SummaryRequest, SummaryResponse
from app.nlp.processor import NLPProcessor
from app.llm.gateway import LLMGateway
from app.config import get_settings

router = APIRouter(prefix="/nlp", tags=["NLP"])
_processor = NLPProcessor()


def get_gateway() -> LLMGateway:
    return LLMGateway(get_settings())


@router.post("/intent", response_model=IntentResponse)
async def detect_intent(request: IntentRequest) -> IntentResponse:
    return _processor.process(request)


@router.post("/summarize", response_model=SummaryResponse)
async def summarize(
    request: SummaryRequest, gateway: LLMGateway = Depends(get_gateway)
) -> SummaryResponse:
    prompt = (
        f"Summarize the following lead context and provide key points and recommended actions.\n"
        f"Context: {request.context}\n"
    )
    system = f"You are a helpful CRM assistant. Use a {request.tone} tone."
    try:
        raw = await gateway.complete(prompt, system=system)
        lines = [line.strip() for line in raw.split("\n") if line.strip()]
        summary = lines[0] if lines else raw
        key_points = lines[1:4] if len(lines) > 1 else []
        recommended_actions = lines[4:] if len(lines) > 4 else ["Follow up with the lead."]
    except Exception:
        summary = "Unable to generate summary at this time. Please try again later."
        key_points = []
        recommended_actions = ["Review lead context manually."]
    return SummaryResponse(
        summary=summary, key_points=key_points, recommended_actions=recommended_actions
    )
