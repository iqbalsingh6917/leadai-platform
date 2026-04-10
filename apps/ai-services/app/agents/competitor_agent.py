import logging
import re

logger = logging.getLogger(__name__)

COMMON_COMPETITORS = [
    "salesforce", "hubspot", "pipedrive", "zoho", "freshsales", "monday",
    "close", "outreach", "salesloft", "apollo", "lemlist", "activecampaign",
    "marketo", "pardot", "dynamics", "copper", "insightly", "keap", "nimble",
]


class CompetitorAgent:
    """Extracts competitor mentions from notes and messages."""

    def __init__(self, llm_gateway):
        self.llm_gateway = llm_gateway

    async def run(self, input_data: dict) -> dict:
        try:
            text = input_data.get("text", "") or ""
            texts = input_data.get("texts", [])
            if text:
                texts = [text] + texts
            combined = " ".join(texts).lower()

            rule_based = self._extract_rule_based(combined)
            llm_mentions = await self._extract_with_llm(combined)

            all_competitors = list({c.lower() for c in (rule_based + llm_mentions)})

            return {
                "competitors_mentioned": all_competitors,
                "count": len(all_competitors),
                "has_competitor_mention": len(all_competitors) > 0,
                "risk_level": "high" if len(all_competitors) >= 2 else "medium" if all_competitors else "low",
            }
        except Exception as exc:
            logger.error("CompetitorAgent failed: %s", exc)
            return {"competitors_mentioned": [], "count": 0, "has_competitor_mention": False, "error": str(exc)}

    def _extract_rule_based(self, text: str) -> list:
        found = []
        for competitor in COMMON_COMPETITORS:
            if re.search(r"\b" + re.escape(competitor) + r"\b", text, re.IGNORECASE):
                found.append(competitor.title())
        return found

    async def _extract_with_llm(self, text: str) -> list:
        if not text or len(text) < 20:
            return []
        try:
            prompt = (
                f"Extract any CRM software or sales tool competitor names mentioned in this text. "
                f"Return only a comma-separated list of names, or 'none' if no competitors mentioned.\n"
                f"Text: {text[:500]}"
            )
            response = await self.llm_gateway.complete(prompt, system="You are a competitive intelligence analyst.", max_tokens=100)
            if "none" in response.lower():
                return []
            return [c.strip().title() for c in response.split(",") if c.strip() and len(c.strip()) < 50]
        except Exception:
            return []
