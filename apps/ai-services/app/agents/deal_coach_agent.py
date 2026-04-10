import logging

logger = logging.getLogger(__name__)

STAGE_PLAYBOOKS = {
    "lead": ["Qualify the lead using BANT framework", "Schedule initial discovery call", "Research the company"],
    "contacted": ["Send personalized value proposition", "Identify decision maker", "Understand pain points"],
    "qualified": ["Present tailored demo", "Share relevant case studies", "Get stakeholder buy-in"],
    "proposal": ["Send detailed proposal", "Address all objections", "Set a follow-up deadline"],
    "negotiation": ["Clarify final requirements", "Offer incentives if needed", "Get verbal commitment"],
    "closed_won": ["Send onboarding materials", "Schedule kick-off call", "Request referrals"],
}


class DealCoachAgent:
    """Analyzes deal health and recommends next steps."""

    def __init__(self, llm_gateway):
        self.llm_gateway = llm_gateway

    async def run(self, input_data: dict) -> dict:
        try:
            deal = input_data.get("deal", {})
            stage = deal.get("stage", "lead").lower()
            value = deal.get("value", 0) or 0
            days_in_stage = deal.get("days_in_stage", 0) or 0
            last_activity = deal.get("last_activity_days_ago", 0) or 0

            health_score = self._calculate_health(stage, days_in_stage, last_activity, value)
            next_steps = STAGE_PLAYBOOKS.get(stage, ["Review deal and determine next action"])
            risk_factors = self._identify_risks(stage, days_in_stage, last_activity)

            coaching_advice = await self._generate_coaching(deal, health_score, risk_factors)

            return {
                "health_score": health_score,
                "health_label": self._health_label(health_score),
                "next_steps": next_steps,
                "risk_factors": risk_factors,
                "coaching_advice": coaching_advice,
                "stage": stage,
            }
        except Exception as exc:
            logger.error("DealCoachAgent failed: %s", exc)
            return {"health_score": 50, "health_label": "fair", "next_steps": [], "risk_factors": [], "error": str(exc)}

    def _calculate_health(self, stage: str, days_in_stage: int, last_activity: int, value: float) -> int:
        score = 70
        if days_in_stage > 30:
            score -= 20
        elif days_in_stage > 14:
            score -= 10
        if last_activity > 14:
            score -= 20
        elif last_activity > 7:
            score -= 10
        if value > 100000:
            score += 10
        stage_bonus = {"qualified": 5, "proposal": 5, "negotiation": 10, "closed_won": 20}.get(stage, 0)
        score += stage_bonus
        return max(0, min(100, score))

    def _health_label(self, score: int) -> str:
        if score >= 75:
            return "healthy"
        if score >= 50:
            return "fair"
        if score >= 25:
            return "at_risk"
        return "critical"

    def _identify_risks(self, stage: str, days_in_stage: int, last_activity: int) -> list:
        risks = []
        if days_in_stage > 30:
            risks.append("Deal stuck in stage for over 30 days")
        if last_activity > 14:
            risks.append("No activity in the last 14 days")
        if stage in ("lead", "contacted") and days_in_stage > 14:
            risks.append("Early stage deal stagnating — needs qualification push")
        return risks

    async def _generate_coaching(self, deal: dict, health_score: int, risks: list) -> str:
        try:
            prompt = (
                f"Deal stage: {deal.get('stage', 'unknown')}, value: {deal.get('value', 0)}, "
                f"health score: {health_score}/100, risks: {risks}.\n"
                f"Provide specific coaching advice in 2-3 sentences for the sales rep."
            )
            return await self.llm_gateway.complete(prompt, system="You are an expert sales coach.")
        except Exception:
            return f"Focus on advancing this deal from {deal.get('stage', 'current')} stage. Address identified risks promptly."
