import logging
from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END

logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    tenant_id: str
    lead_id: str
    task_type: str  # "score_lead" | "analyze_intent" | "generate_summary"
    input_data: dict
    output_data: Optional[dict]
    error: Optional[str]
    retry_count: int


class OrchestratorAgent:
    """Routes tasks to appropriate specialist agents."""

    def __init__(self, scoring_engine, nlp_processor, llm_gateway):
        self.scoring_engine = scoring_engine
        self.nlp_processor = nlp_processor
        self.llm_gateway = llm_gateway
        self.graph = self.build_graph()

    def build_graph(self) -> StateGraph:
        workflow = StateGraph(AgentState)

        workflow.add_node("route_task", self._route_task)
        workflow.add_node("score_lead", self._score_lead)
        workflow.add_node("analyze_intent", self._analyze_intent)
        workflow.add_node("generate_summary", self._generate_summary_async)
        workflow.add_node("format_output", self._format_output)
        workflow.add_node("handle_error", self._handle_error)

        workflow.set_entry_point("route_task")

        workflow.add_conditional_edges(
            "route_task",
            self._select_handler,
            {
                "score_lead": "score_lead",
                "analyze_intent": "analyze_intent",
                "generate_summary": "generate_summary",
                "handle_error": "handle_error",
            },
        )

        workflow.add_edge("score_lead", "format_output")
        workflow.add_edge("analyze_intent", "format_output")
        workflow.add_edge("generate_summary", "format_output")
        workflow.add_edge("format_output", END)
        workflow.add_edge("handle_error", END)

        return workflow.compile()

    def _select_handler(self, state: AgentState) -> str:
        if state.get("error"):
            return "handle_error"
        task_type = state.get("task_type", "")
        if task_type == "score_lead":
            return "score_lead"
        elif task_type == "analyze_intent":
            return "analyze_intent"
        elif task_type == "generate_summary":
            return "generate_summary"
        return "handle_error"

    def _route_task(self, state: AgentState) -> AgentState:
        valid_tasks = {"score_lead", "analyze_intent", "generate_summary"}
        if state.get("task_type") not in valid_tasks:
            state["error"] = f"Unknown task_type: {state.get('task_type')}"
        return state

    def _score_lead(self, state: AgentState) -> AgentState:
        try:
            from app.models.lead import LeadData
            lead_data = state["input_data"].get("lead", {})
            lead = LeadData(**lead_data)
            result = self.scoring_engine.score(lead)
            state["output_data"] = result.model_dump()
        except Exception as exc:
            logger.error("Score lead failed: %s", exc)
            state["error"] = str(exc)
        return state

    def _analyze_intent(self, state: AgentState) -> AgentState:
        try:
            from app.models.lead import IntentRequest
            request = IntentRequest(**state["input_data"])
            result = self.nlp_processor.process(request)
            state["output_data"] = result.model_dump()
        except Exception as exc:
            logger.error("Analyze intent failed: %s", exc)
            state["error"] = str(exc)
        return state

    async def _generate_summary_async(self, state: AgentState) -> AgentState:
        try:
            context = state["input_data"].get("context", "")
            prompt = (
                f"Summarize the following lead context and provide key points and recommended actions.\n"
                f"Context: {context}\n"
            )
            summary_text = await self.llm_gateway.complete(
                prompt, system="You are a helpful CRM assistant."
            )
            lines = [line.strip() for line in summary_text.split("\n") if line.strip()]
            state["output_data"] = {
                "summary": lines[0] if lines else summary_text,
                "key_points": lines[1:4] if len(lines) > 1 else [],
                "recommended_actions": lines[4:] if len(lines) > 4 else ["Follow up with the lead."],
            }
        except Exception as exc:
            logger.error("Generate summary failed: %s", exc)
            state["error"] = str(exc)
            state["output_data"] = {
                "summary": "Summary generation failed.",
                "key_points": [],
                "recommended_actions": ["Review lead manually."],
            }
        return state

    def _format_output(self, state: AgentState) -> AgentState:
        if not state.get("output_data"):
            state["output_data"] = {}
        return state

    def _handle_error(self, state: AgentState) -> AgentState:
        logger.error("Agent error for task %s: %s", state.get("task_type"), state.get("error"))
        state["output_data"] = {"error": state.get("error", "Unknown error")}
        return state

    async def run(self, task_type: str, lead_id: str, tenant_id: str, input_data: dict) -> dict:
        initial_state: AgentState = {
            "tenant_id": tenant_id,
            "lead_id": lead_id,
            "task_type": task_type,
            "input_data": input_data,
            "output_data": None,
            "error": None,
            "retry_count": 0,
        }
        result = await self.graph.ainvoke(initial_state)
        return result.get("output_data", {})
