import logging

logger = logging.getLogger(__name__)


class BudgetOptimizerAgent:
    """Analyzes campaign spend and suggests reallocation using rule-based logic and LLM."""

    def __init__(self, llm_gateway):
        self.llm_gateway = llm_gateway

    async def run(self, input_data: dict) -> dict:
        try:
            campaigns = input_data.get("campaigns", [])
            if not campaigns:
                return {"recommendations": [], "totalBudget": 0, "projectedImprovement": 0}

            total_budget = sum(c.get("spend", 0) for c in campaigns)
            recommendations = self._rule_based_optimize(campaigns, total_budget)

            rationale_text = await self._generate_rationale(campaigns, recommendations)

            for i, rec in enumerate(recommendations):
                if i < len(rationale_text):
                    rec["rationale"] = rationale_text[i]

            projected = self._calculate_improvement(campaigns, recommendations)
            return {
                "recommendations": recommendations,
                "totalBudget": total_budget,
                "projectedImprovement": projected,
            }
        except Exception as exc:
            logger.error("BudgetOptimizerAgent failed: %s", exc)
            return {"recommendations": [], "totalBudget": 0, "projectedImprovement": 0, "error": str(exc)}

    def _rule_based_optimize(self, campaigns: list, total_budget: float) -> list:
        scored = []
        for c in campaigns:
            spend = c.get("spend", 1)
            leads = c.get("leads", 0)
            conversions = c.get("conversions", 0)
            cpl = spend / leads if leads > 0 else float("inf")
            conv_rate = conversions / leads if leads > 0 else 0
            efficiency = conv_rate / (cpl / 1000) if cpl > 0 and cpl != float("inf") else 0
            scored.append({**c, "_efficiency": efficiency, "_cpl": cpl, "_conv_rate": conv_rate})

        avg_efficiency = sum(c["_efficiency"] for c in scored) / len(scored) if scored else 1
        recommendations = []
        for c in scored:
            current_spend = c.get("spend", 0)
            eff = c["_efficiency"]
            if avg_efficiency > 0:
                ratio = eff / avg_efficiency
            else:
                ratio = 1.0
            ratio = max(0.5, min(2.0, ratio))
            suggested = round(current_spend * ratio, 2)
            recommendations.append({
                "campaignId": c.get("id"),
                "campaignName": c.get("name", ""),
                "currentSpend": current_spend,
                "suggestedSpend": suggested,
                "rationale": f"Efficiency score: {eff:.2f}",
            })
        return recommendations

    async def _generate_rationale(self, campaigns: list, recommendations: list) -> list:
        try:
            summary = "\n".join(
                f"- {c.get('name', c.get('id'))}: spend={c.get('spend')}, leads={c.get('leads')}, conversions={c.get('conversions')}"
                for c in campaigns
            )
            prompt = (
                f"Given these campaigns:\n{summary}\n\n"
                f"Provide a one-sentence rationale for each budget change recommendation. "
                f"Return as a numbered list."
            )
            text = await self.llm_gateway.complete(prompt, system="You are a digital marketing budget analyst.")
            lines = [l.strip().lstrip("123456789.-) ") for l in text.split("\n") if l.strip() and len(l.strip()) > 10]
            return lines
        except Exception:
            return []

    def _calculate_improvement(self, campaigns: list, recommendations: list) -> float:
        try:
            total_conversions = sum(c.get("conversions", 0) for c in campaigns)
            if total_conversions == 0:
                return 5.0
            return round(
                sum(
                    (r["suggestedSpend"] - r["currentSpend"]) / r["currentSpend"] * 10
                    for r in recommendations
                    if r["currentSpend"] > 0
                ),
                1,
            )
        except Exception:
            return 0.0
