import logging

logger = logging.getLogger(__name__)


class SummaryAgent:
    """Generates lead summary via LLM."""

    def __init__(self, llm_gateway):
        self.llm_gateway = llm_gateway

    async def run(self, input_data: dict) -> dict:
        try:
            context = input_data.get("context", "")
            prompt = (
                f"Summarize the following lead context and provide key points and recommended actions.\n"
                f"Context: {context}\n"
            )
            text = await self.llm_gateway.complete(prompt, system="You are a helpful CRM assistant.")
            lines = [l.strip() for l in text.split("\n") if l.strip()]
            return {
                "summary": lines[0] if lines else text,
                "key_points": lines[1:4] if len(lines) > 1 else [],
                "recommended_actions": lines[4:] if len(lines) > 4 else ["Follow up with the lead."],
            }
        except Exception as exc:
            logger.error("SummaryAgent failed: %s", exc)
            return {
                "summary": "Summary generation failed.",
                "key_points": [],
                "recommended_actions": ["Review lead manually."],
                "error": str(exc),
            }
