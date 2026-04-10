import logging

logger = logging.getLogger(__name__)


class FollowupAgent:
    """Generates personalized follow-up message suggestions for WhatsApp/email."""

    def __init__(self, llm_gateway):
        self.llm_gateway = llm_gateway

    async def run(self, input_data: dict) -> dict:
        try:
            lead_name = input_data.get("lead_name", "there")
            channel = input_data.get("channel", "email")
            context = input_data.get("context", "")
            last_interaction = input_data.get("last_interaction", "")

            prompt = (
                f"Generate 3 personalized follow-up {channel} messages for a lead named {lead_name}.\n"
                f"Context: {context}\n"
                f"Last interaction: {last_interaction}\n"
                f"Each message should be concise, friendly, and action-oriented. "
                f"Format: numbered list with just the message text."
            )
            text = await self.llm_gateway.complete(
                prompt, system="You are an expert sales communication specialist."
            )
            lines = [l.strip().lstrip("123456789.-) ") for l in text.split("\n") if l.strip()]
            messages = [l for l in lines if len(l) > 10][:3]
            return {
                "channel": channel,
                "suggestions": messages or [
                    f"Hi {lead_name}, just checking in! Would love to connect.",
                    f"Hi {lead_name}, wanted to share some updates with you.",
                    f"Hi {lead_name}, following up on our last conversation.",
                ],
            }
        except Exception as exc:
            logger.error("FollowupAgent failed: %s", exc)
            return {
                "channel": input_data.get("channel", "email"),
                "suggestions": ["Follow up with a personalized message."],
                "error": str(exc),
            }
