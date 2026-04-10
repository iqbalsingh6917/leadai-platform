import re
from app.models.lead import IntentRequest, IntentResponse


class NLPProcessor:
    """
    Rule-based NLP for Phase 1.
    Phase 2 will add spaCy NER and transformer-based models.
    """

    INTENT_PATTERNS = {
        "buy_inquiry": [
            r"\b(want|would like|interested in|looking to|ready to)\s+(buy|purchase|order|get|acquire)\b",
            r"\b(how (do|can) i (buy|purchase|order|get))\b",
            r"\b(place an? order)\b",
            r"\b(sign up|sign me up|let's go|let's do it|move forward)\b",
            r"\b(purchase|buy|order|acquire|procure)\s+(now|today|this|your)\b",
        ],
        "price_inquiry": [
            r"\b(how much|what('s| is) the (cost|price|pricing|rate|fee|charge))\b",
            r"\b(cost[s]?|pric(e|ing)|rate[s]?|fee[s]?|plan[s]?)\b",
            r"\b(do you (have|offer) (a )?(free|trial|discount|promo))\b",
            r"\b(what (are|is) your (plan|tier|package|option))\b",
            r"\b(affordable|budget|cheap|expensive|value)\b",
        ],
        "demo_request": [
            r"\b(schedule|book|set up|arrange|request)\s+a?\s*(demo|demonstration|call|meeting|walkthrough)\b",
            r"\b(can (i|we) see|show me|show us)\s+(a |the )?(demo|product|platform|tool)\b",
            r"\b(demo|walkthrough|tour|live (demo|presentation))\b",
            r"\b(see (it|the product|how it works) in action)\b",
            r"\b(free (demo|trial|consultation))\b",
        ],
        "support": [
            r"\b(help|support|assist|assistance|trouble|problem|issue|error|bug|broken)\b",
            r"\b(not working|doesn't work|can't (log in|access|use|connect))\b",
            r"\b(how (do|does|can|to))\s+\w+\s+(work|use|set up|configure)\b",
            r"\b(documentation|docs|guide|tutorial|FAQ|knowledge base)\b",
            r"\b(technical (support|help|issue)|customer service|helpdesk)\b",
        ],
        "objection": [
            r"\b(too expensive|out of (my |our )budget|can't afford|overpriced)\b",
            r"\b(already (have|using|use)|have a (solution|system|tool|product))\b",
            r"\b(not sure|uncertain|hesitant|need to think|need more time)\b",
            r"\b(concerned about|worried about|issue with|problem with)\b",
            r"\b(competitor|alternative|other (option|solution|vendor|product))\b",
        ],
        "not_interested": [
            r"\b(not interested|no thanks|no thank you|pass|decline)\b",
            r"\b(remove (me|us)|unsubscribe|stop (emailing|contacting|calling))\b",
            r"\b(don't (contact|call|email|reach out) (me|us))\b",
            r"\b(not (relevant|applicable|a fit|for us|what we need))\b",
            r"\b(please (stop|don't|do not) (contact|email|call))\b",
        ],
    }

    POSITIVE_WORDS = {
        "interested", "excited", "love", "great", "excellent", "perfect", "amazing",
        "fantastic", "wonderful", "impressive", "helpful", "yes", "absolutely",
        "definitely", "certainly", "happy", "pleased", "eager", "ready", "keen",
        "enthusiastic", "positive", "good", "nice", "superb", "outstanding",
    }

    NEGATIVE_WORDS = {
        "not", "no", "never", "hate", "terrible", "awful", "bad", "poor",
        "disappointed", "unhappy", "frustrated", "annoyed", "angry", "worse",
        "worst", "horrible", "useless", "waste", "expensive", "overpriced",
        "difficult", "confusing", "confused", "boring", "slow", "broken",
    }

    EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
    PHONE_PATTERN = re.compile(
        r"(\+?1?\s?)?(\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4})"
    )
    MONEY_PATTERN = re.compile(
        r"\$\s?\d+(?:[.,]\d+)*(?:\s?[kKmMbB])?|\d+(?:[.,]\d+)?\s?(?:dollars?|USD|EUR|GBP)"
    )

    def detect_intent(self, text: str) -> tuple[str, float]:
        text_lower = text.lower()
        scores: dict[str, int] = {}
        for intent, patterns in self.INTENT_PATTERNS.items():
            count = sum(1 for p in patterns if re.search(p, text_lower))
            if count > 0:
                scores[intent] = count

        if not scores:
            return "unknown", 0.3

        best_intent = max(scores, key=lambda k: scores[k])
        best_count = scores[best_intent]
        total_patterns = len(self.INTENT_PATTERNS[best_intent])
        raw_confidence = min(best_count / max(total_patterns * 0.4, 1), 1.0)
        confidence = 0.5 + raw_confidence * 0.5
        return best_intent, round(confidence, 2)

    def analyze_sentiment(self, text: str) -> str:
        words = set(re.findall(r"\b\w+\b", text.lower()))
        positive_hits = len(words & self.POSITIVE_WORDS)
        negative_hits = len(words & self.NEGATIVE_WORDS)

        # Negation check: words like "not interested" should swing negative
        negation_pattern = re.compile(
            r"\b(not|no|never|don't|doesn't|isn't|aren't|won't|can't)\s+(\w+)"
        )
        for match in negation_pattern.finditer(text.lower()):
            following_word = match.group(2)
            if following_word in self.POSITIVE_WORDS:
                positive_hits = max(positive_hits - 1, 0)
                negative_hits += 1

        if positive_hits > negative_hits:
            return "positive"
        elif negative_hits > positive_hits:
            return "negative"
        return "neutral"

    def extract_entities(self, text: str) -> list[dict]:
        entities = []
        for match in self.EMAIL_PATTERN.finditer(text):
            entities.append(
                {"type": "email", "value": match.group(), "start": match.start(), "end": match.end()}
            )
        for match in self.PHONE_PATTERN.finditer(text):
            val = match.group().strip()
            if len(re.sub(r"\D", "", val)) >= 10:
                entities.append(
                    {"type": "phone", "value": val, "start": match.start(), "end": match.end()}
                )
        for match in self.MONEY_PATTERN.finditer(text):
            entities.append(
                {"type": "money", "value": match.group(), "start": match.start(), "end": match.end()}
            )
        return entities

    def process(self, request: IntentRequest) -> IntentResponse:
        text = request.text
        if request.context:
            combined = f"{request.context}\n{text}"
        else:
            combined = text

        intent, confidence = self.detect_intent(combined)
        sentiment = self.analyze_sentiment(combined)
        entities = self.extract_entities(combined)

        return IntentResponse(
            intent=intent,
            confidence=confidence,
            sentiment=sentiment,
            entities=entities,
        )
