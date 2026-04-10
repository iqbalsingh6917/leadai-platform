import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

# In-memory session store (replace with Redis in production)
_session_store: Dict[str, List[dict]] = {}


class CopilotAgent:
    """Conversational assistant for sales reps with chat history context."""

    def __init__(self, llm_gateway):
        self.llm_gateway = llm_gateway

    async def run(self, input_data: dict) -> dict:
        try:
            message = input_data.get("message", "")
            session_id = input_data.get("session_id", "default")
            lead_context = input_data.get("lead_context", {})

            history = _session_store.get(session_id, [])
            prompt = self._build_prompt(message, history, lead_context)

            reply = await self.llm_gateway.complete(
                prompt,
                system=(
                    "You are LeadAI Copilot, an expert sales assistant. "
                    "Help sales reps with lead qualification, follow-up strategies, and deal coaching. "
                    "Be concise, actionable, and friendly."
                ),
                max_tokens=400,
            )

            history.append({"role": "user", "content": message})
            history.append({"role": "assistant", "content": reply})
            _session_store[session_id] = history[-20:]

            suggestions = self._extract_suggestions(reply)
            return {
                "reply": reply,
                "session_id": session_id,
                "suggestions": suggestions,
            }
        except Exception as exc:
            logger.error("CopilotAgent failed: %s", exc)
            return {
                "reply": "I'm having trouble processing your request. Please try again.",
                "session_id": input_data.get("session_id", "default"),
                "suggestions": [],
                "error": str(exc),
            }

    def _build_prompt(self, message: str, history: list, lead_context: dict) -> str:
        parts = []
        if lead_context:
            parts.append(f"Lead context: {lead_context}\n")
        if history:
            parts.append("Conversation so far:")
            for turn in history[-6:]:
                parts.append(f"{turn['role'].capitalize()}: {turn['content']}")
        parts.append(f"User: {message}")
        parts.append("Assistant:")
        return "\n".join(parts)

    def _extract_suggestions(self, reply: str) -> list:
        suggestions = []
        keywords = ["follow up", "schedule", "send email", "call", "qualify", "close", "proposal", "demo"]
        for kw in keywords:
            if kw.lower() in reply.lower():
                suggestions.append(kw.title())
            if len(suggestions) >= 3:
                break
        return suggestions
