import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class RevenueForecastAgent:
    """Predicts monthly revenue from pipeline data."""

    def __init__(self, llm_gateway):
        self.llm_gateway = llm_gateway

    async def run(self, input_data: dict) -> dict:
        try:
            pipeline = input_data.get("pipeline", [])
            historical = input_data.get("historical_revenue", [])

            forecast = self._rule_based_forecast(pipeline, historical)
            explanation = await self._generate_explanation(pipeline, forecast)

            return {
                "monthly_forecast": forecast,
                "explanation": explanation,
                "confidence": self._calculate_confidence(pipeline, historical),
                "generated_at": datetime.utcnow().isoformat(),
            }
        except Exception as exc:
            logger.error("RevenueForecastAgent failed: %s", exc)
            return {"monthly_forecast": 0, "explanation": "Forecast unavailable.", "confidence": 0, "error": str(exc)}

    def _rule_based_forecast(self, pipeline: list, historical: list) -> float:
        if not pipeline:
            if historical:
                return round(sum(historical) / len(historical), 2)
            return 0.0

        stage_probabilities = {
            "lead": 0.05, "contacted": 0.10, "qualified": 0.25,
            "proposal": 0.50, "negotiation": 0.75, "closed_won": 1.0,
        }

        weighted_total = 0.0
        for deal in pipeline:
            value = deal.get("value", 0) or 0
            stage = deal.get("stage", "lead").lower()
            prob = stage_probabilities.get(stage, 0.1)
            weighted_total += value * prob

        if historical:
            hist_avg = sum(historical) / len(historical)
            return round((weighted_total + hist_avg) / 2, 2)
        return round(weighted_total, 2)

    async def _generate_explanation(self, pipeline: list, forecast: float) -> str:
        try:
            n = len(pipeline)
            total_value = sum(d.get("value", 0) or 0 for d in pipeline)
            prompt = (
                f"Based on {n} active deals with total potential value of {total_value}, "
                f"the revenue forecast for next month is {forecast}. "
                f"Give a 2-sentence explanation of this forecast and key assumptions."
            )
            return await self.llm_gateway.complete(prompt, system="You are a revenue analyst.")
        except Exception:
            return f"Forecast of {forecast} based on {len(pipeline)} pipeline deals with weighted probability scoring."

    def _calculate_confidence(self, pipeline: list, historical: list) -> float:
        if not pipeline and not historical:
            return 0.1
        base = 0.5
        if len(pipeline) >= 5:
            base += 0.2
        if len(historical) >= 3:
            base += 0.2
        return round(min(base, 0.95), 2)
