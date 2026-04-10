import logging
from app.nlp.processor import NLPProcessor
from app.models.lead import IntentRequest

logger = logging.getLogger(__name__)


class IntentAnalysisAgent:
    """Wraps NLPProcessor for intent detection."""

    def __init__(self, nlp_processor: NLPProcessor):
        self.nlp_processor = nlp_processor

    async def run(self, input_data: dict) -> dict:
        try:
            request = IntentRequest(**input_data)
            result = self.nlp_processor.process(request)
            return result.model_dump()
        except Exception as exc:
            logger.error("IntentAnalysisAgent failed: %s", exc)
            return {"error": str(exc), "intent": "unknown", "confidence": 0.0}
