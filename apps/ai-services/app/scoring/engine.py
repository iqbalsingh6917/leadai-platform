from app.models.lead import LeadData, ScoreResponse


class LeadScoringEngine:
    """
    Phase 1: Rule-based BANT scoring.
    Phase 2: Will be replaced with ML model trained on conversion data.

    Scoring signals (total max MAX_SCORE pts):
    - has_company (15 pts): Lead has company name
    - has_email (10 pts): Lead has email
    - has_phone (10 pts): Lead has phone number
    - source_quality (0-20 pts): referral=20, website=15, advertisement=15, social_media=10, email=10, phone=10, other=5
    - status_progress (0-20 pts): new=0, contacted=10, qualified=20, converted=20, unqualified=0, lost=0
    - has_notes (10 pts): Lead has notes
    - has_tags (5 pts): Lead has tags
    - name_completeness (10 pts): Both first and last name present
    """

    # Maximum possible score (0-100 scale used throughout the platform)
    MAX_SCORE = 100

    # Tier thresholds: hot >= HOT_THRESHOLD, warm >= WARM_THRESHOLD, cold < WARM_THRESHOLD
    HOT_THRESHOLD = 70
    WARM_THRESHOLD = 40

    SOURCE_SCORES = {
        "referral": 20,
        "website": 15,
        "advertisement": 15,
        "social_media": 10,
        "email": 10,
        "phone": 10,
        "other": 5,
    }

    STATUS_SCORES = {
        "new": 0,
        "contacted": 10,
        "qualified": 20,
        "converted": 20,
        "unqualified": 0,
        "lost": 0,
    }

    def score(self, lead: LeadData) -> ScoreResponse:
        signals: dict[str, int] = {}

        # Signal 1: has_company
        signals["has_company"] = 15 if lead.company and lead.company.strip() else 0

        # Signal 2: has_email
        signals["has_email"] = 10 if lead.email and lead.email.strip() else 0

        # Signal 3: has_phone
        signals["has_phone"] = 10 if lead.phone and lead.phone.strip() else 0

        # Signal 4: source_quality
        signals["source_quality"] = self.SOURCE_SCORES.get(lead.source.lower(), 5)

        # Signal 5: status_progress
        signals["status_progress"] = self.STATUS_SCORES.get(lead.status.lower(), 0)

        # Signal 6: has_notes
        signals["has_notes"] = 10 if lead.notes and lead.notes.strip() else 0

        # Signal 7: has_tags
        signals["has_tags"] = 5 if lead.tags and len(lead.tags) > 0 else 0

        # Signal 8: name_completeness
        signals["name_completeness"] = (
            10
            if lead.firstName and lead.firstName.strip() and lead.lastName and lead.lastName.strip()
            else 0
        )

        total = min(sum(signals.values()), self.MAX_SCORE)

        if total >= self.HOT_THRESHOLD:
            tier = "hot"
        elif total >= self.WARM_THRESHOLD:
            tier = "warm"
        else:
            tier = "cold"

        reasoning = self._build_reasoning(lead, signals, total, tier)
        recommended_action = self._recommend_action(lead, tier)

        return ScoreResponse(
            lead_id=lead.id,
            score=total,
            tier=tier,
            reasoning=reasoning,
            signals=signals,
            recommended_action=recommended_action,
        )

    def _build_reasoning(self, lead: LeadData, signals: dict[str, int], total: int, tier: str) -> str:
        parts = [f"Lead scored {total}/100 ({tier} tier)."]
        if signals["has_company"]:
            parts.append("Has company information (+15).")
        if signals["has_email"]:
            parts.append("Has email address (+10).")
        if signals["has_phone"]:
            parts.append("Has phone number (+10).")
        source_pts = signals["source_quality"]
        parts.append(f"Source '{lead.source}' contributes {source_pts} points.")
        status_pts = signals["status_progress"]
        if status_pts > 0:
            parts.append(f"Status '{lead.status}' contributes {status_pts} points.")
        if signals["has_notes"]:
            parts.append("Has engagement notes (+10).")
        if signals["has_tags"]:
            parts.append("Has tags indicating data quality (+5).")
        if signals["name_completeness"]:
            parts.append("Full name provided (+10).")
        return " ".join(parts)

    def _recommend_action(self, lead: LeadData, tier: str) -> str:
        if tier == "hot":
            if lead.status in ("new", "contacted"):
                return "Schedule a demo or sales call immediately — high-priority lead."
            elif lead.status == "qualified":
                return "Move to proposal stage — lead is ready for a formal offer."
            else:
                return "Re-engage with a personalized outreach campaign."
        elif tier == "warm":
            if lead.status == "new":
                return "Send a personalized introduction email and schedule a discovery call."
            elif lead.status == "contacted":
                return "Follow up with targeted content and a clear call-to-action."
            elif lead.status == "qualified":
                return "Nurture with case studies and ROI data to advance pipeline."
            else:
                return "Add to nurture sequence and monitor engagement."
        else:  # cold
            if lead.status in ("unqualified", "lost"):
                return "Archive or add to long-term re-engagement sequence."
            else:
                return "Enrich lead data and add to automated nurture campaign."
