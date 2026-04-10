import logging
import re

logger = logging.getLogger(__name__)

OBJECTION_PATTERNS = {
    "price": [r"\btoo expensive\b", r"\bcost too much\b", r"\bcan't afford\b", r"\bout of budget\b", r"\bprice(ing)?\b", r"\btoo pricey\b"],
    "timing": [r"\bnot now\b", r"\bnot ready\b", r"\bmaybe later\b", r"\bnot the right time\b", r"\bbusy\b", r"\bnext quarter\b"],
    "competitor": [r"\balready using\b", r"\bcurrently using\b", r"\bhappy with\b", r"\bstick with\b"],
    "value": [r"\bnot sure\b", r"\bdon't see the value\b", r"\bdon't need\b", r"\bnot convinced\b", r"\bdon't understand\b"],
    "authority": [r"\bneed to check\b", r"\bneed approval\b", r"\bnot my decision\b", r"\bask my (boss|manager|team)\b"],
}

RESPONSES = {
    "price": "Acknowledge the concern and offer a ROI breakdown, flexible payment options, or a scaled-down package.",
    "timing": "Ask about their timeline and schedule a follow-up. Offer a limited-time incentive.",
    "competitor": "Highlight your unique differentiators and ask about pain points with their current solution.",
    "value": "Offer a personalized demo or case study. Ask discovery questions to understand their specific needs.",
    "authority": "Offer to schedule a call with the decision maker or provide executive summary materials.",
}


class ObjectionHandlerAgent:
    """Identifies objections and suggests responses."""

    def __init__(self, llm_gateway):
        self.llm_gateway = llm_gateway

    async def run(self, input_data: dict) -> dict:
        try:
            text = input_data.get("text", "") or ""
            objections = self._detect_objections(text)
            responses = {obj: RESPONSES.get(obj, "Address this concern empathetically.") for obj in objections}

            if objections:
                tailored = await self._generate_tailored_responses(text, objections)
                for obj, resp in tailored.items():
                    responses[obj] = resp

            return {
                "objections_detected": objections,
                "responses": responses,
                "has_objections": len(objections) > 0,
                "severity": "high" if len(objections) >= 2 else "medium" if objections else "low",
            }
        except Exception as exc:
            logger.error("ObjectionHandlerAgent failed: %s", exc)
            return {"objections_detected": [], "responses": {}, "has_objections": False, "error": str(exc)}

    def _detect_objections(self, text: str) -> list:
        found = []
        text_lower = text.lower()
        for objection_type, patterns in OBJECTION_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    found.append(objection_type)
                    break
        return found

    async def _generate_tailored_responses(self, text: str, objections: list) -> dict:
        try:
            prompt = (
                f"A prospect said: '{text[:300]}'\n"
                f"Objection types detected: {', '.join(objections)}.\n"
                f"For each objection type, provide a single tailored response sentence. "
                f"Format: objection_type: response"
            )
            response = await self.llm_gateway.complete(
                prompt, system="You are an expert sales objection handling coach.", max_tokens=300
            )
            result = {}
            for line in response.split("\n"):
                if ":" in line:
                    parts = line.split(":", 1)
                    key = parts[0].strip().lower().replace(" ", "_")
                    if key in objections:
                        result[key] = parts[1].strip()
            return result
        except Exception:
            return {}
