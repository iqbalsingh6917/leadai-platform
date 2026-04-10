import logging
from app.scoring.engine import LeadScoringEngine
from app.models.lead import LeadData

logger = logging.getLogger(__name__)


class LeadScoringAgent:
    """Wraps LeadScoringEngine and adds LLM reasoning explanation."""

    def __init__(self, scoring_engine: LeadScoringEngine, llm_gateway):
        self.scoring_engine = scoring_engine
        self.llm_gateway = llm_gateway

    async def run(self, input_data: dict) -> dict:
        try:
            lead_data = input_data.get("lead", {})
            lead = LeadData(**lead_data)
            result = self.scoring_engine.score(lead)
            score_dict = result.model_dump()

            reasoning = await self._generate_reasoning(lead, score_dict)
            score_dict["reasoning"] = reasoning
            return score_dict
        except Exception as exc:
            logger.error("LeadScoringAgent failed: %s", exc)
            return {"error": str(exc), "score": 0, "tier": "cold", "reasoning": "Scoring failed."}

    async def _generate_reasoning(self, lead: LeadData, score_dict: dict) -> str:
        try:
            prompt = (
                f"A lead has been scored {score_dict.get('score', 0)}/100 (tier: {score_dict.get('tier', 'cold')}).\n"
                f"Lead details: company={lead.company}, source={lead.source}, status={lead.status}, "
                f"has_email={bool(lead.email)}, has_phone={bool(lead.phone)}, tags={lead.tags}.\n"
                f"Score breakdown: {score_dict.get('breakdown', {})}.\n"
                f"In 2-3 sentences, explain why this lead received this score and what could improve it."
            )
            return await self.llm_gateway.complete(prompt, system="You are an expert CRM sales analyst.")
        except Exception:
            return f"Score of {score_dict.get('score', 0)} based on lead completeness and engagement signals."
