import logging
import re

logger = logging.getLogger(__name__)


class SentimentAgent:
    """Analyzes sentiment in lead notes/messages using rule-based logic."""

    POSITIVE_WORDS = {
        "great", "excellent", "love", "amazing", "fantastic", "wonderful", "perfect",
        "interested", "excited", "happy", "pleased", "impressed", "eager", "enthusiastic",
        "yes", "definitely", "absolutely", "ready", "forward", "keen", "good", "nice",
    }
    NEGATIVE_WORDS = {
        "bad", "terrible", "awful", "hate", "disappointed", "frustrated", "angry",
        "not interested", "no", "never", "expensive", "too much", "difficult",
        "problem", "issue", "complaint", "unhappy", "dissatisfied", "cancel", "refund",
        "worst", "poor", "fail", "wrong", "broken",
    }
    NEUTRAL_WORDS = {
        "maybe", "perhaps", "consider", "think", "possibly", "let me", "might",
        "could", "would", "check", "review", "later", "soon", "follow",
    }

    async def run(self, input_data: dict) -> dict:
        try:
            text = input_data.get("text", "") or ""
            texts = input_data.get("texts", [])
            if text:
                texts = [text] + texts

            if not texts:
                return {"sentiment": "neutral", "score": 0.0, "breakdown": {}}

            results = [self._analyze_single(t) for t in texts]
            avg_score = sum(r["score"] for r in results) / len(results)
            overall = self._score_to_label(avg_score)

            return {
                "sentiment": overall,
                "score": round(avg_score, 3),
                "breakdown": {
                    "positive": sum(1 for r in results if r["sentiment"] == "positive"),
                    "negative": sum(1 for r in results if r["sentiment"] == "negative"),
                    "neutral": sum(1 for r in results if r["sentiment"] == "neutral"),
                },
                "details": results if len(results) > 1 else results[0] if results else {},
            }
        except Exception as exc:
            logger.error("SentimentAgent failed: %s", exc)
            return {"sentiment": "neutral", "score": 0.0, "error": str(exc)}

    def _analyze_single(self, text: str) -> dict:
        words = set(re.findall(r"\b\w+\b", text.lower()))
        pos_count = len(words & self.POSITIVE_WORDS)
        neg_count = len(words & self.NEGATIVE_WORDS)
        total = pos_count + neg_count
        if total == 0:
            score = 0.0
        else:
            score = (pos_count - neg_count) / total
        return {"text": text[:100], "sentiment": self._score_to_label(score), "score": round(score, 3)}

    def _score_to_label(self, score: float) -> str:
        if score > 0.1:
            return "positive"
        if score < -0.1:
            return "negative"
        return "neutral"
