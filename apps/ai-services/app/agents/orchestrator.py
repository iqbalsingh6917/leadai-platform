import logging
from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END

logger = logging.getLogger(__name__)

VALID_TASKS = {
    "score_lead",
    "score_lead_advanced",
    "analyze_intent",
    "generate_summary",
    "generate_followup",
    "optimize_budget",
    "copilot_chat",
    "forecast_revenue",
    "analyze_sentiment",
    "detect_competitors",
    "handle_objections",
    "coach_deal",
}


class AgentState(TypedDict):
    tenant_id: str
    lead_id: str
    task_type: str
    input_data: dict
    output_data: Optional[dict]
    error: Optional[str]
    retry_count: int


class OrchestratorAgent:
    """Routes tasks to all 11 specialist agents."""

    def __init__(self, scoring_engine, nlp_processor, llm_gateway):
        self.scoring_engine = scoring_engine
        self.nlp_processor = nlp_processor
        self.llm_gateway = llm_gateway
        self._init_agents()
        self.graph = self.build_graph()

    def _init_agents(self):
        from app.agents.lead_scoring_agent import LeadScoringAgent
        from app.agents.intent_analysis_agent import IntentAnalysisAgent
        from app.agents.summary_agent import SummaryAgent
        from app.agents.followup_agent import FollowupAgent
        from app.agents.budget_optimizer_agent import BudgetOptimizerAgent
        from app.agents.copilot_agent import CopilotAgent
        from app.agents.revenue_forecast_agent import RevenueForecastAgent
        from app.agents.sentiment_agent import SentimentAgent
        from app.agents.competitor_agent import CompetitorAgent
        from app.agents.objection_handler_agent import ObjectionHandlerAgent
        from app.agents.deal_coach_agent import DealCoachAgent

        self.agents = {
            "score_lead": LeadScoringAgent(self.scoring_engine, self.llm_gateway),
            "score_lead_advanced": LeadScoringAgent(self.scoring_engine, self.llm_gateway),
            "analyze_intent": IntentAnalysisAgent(self.nlp_processor),
            "generate_summary": SummaryAgent(self.llm_gateway),
            "generate_followup": FollowupAgent(self.llm_gateway),
            "optimize_budget": BudgetOptimizerAgent(self.llm_gateway),
            "copilot_chat": CopilotAgent(self.llm_gateway),
            "forecast_revenue": RevenueForecastAgent(self.llm_gateway),
            "analyze_sentiment": SentimentAgent(),
            "detect_competitors": CompetitorAgent(self.llm_gateway),
            "handle_objections": ObjectionHandlerAgent(self.llm_gateway),
            "coach_deal": DealCoachAgent(self.llm_gateway),
        }

    def build_graph(self) -> StateGraph:
        workflow = StateGraph(AgentState)

        workflow.add_node("route_task", self._route_task)
        workflow.add_node("dispatch_agent", self._dispatch_agent)
        workflow.add_node("format_output", self._format_output)
        workflow.add_node("handle_error", self._handle_error)

        workflow.set_entry_point("route_task")

        workflow.add_conditional_edges(
            "route_task",
            self._select_handler,
            {
                "dispatch_agent": "dispatch_agent",
                "handle_error": "handle_error",
            },
        )

        workflow.add_edge("dispatch_agent", "format_output")
        workflow.add_edge("format_output", END)
        workflow.add_edge("handle_error", END)

        return workflow.compile()

    def _select_handler(self, state: AgentState) -> str:
        if state.get("error"):
            return "handle_error"
        return "dispatch_agent"

    def _route_task(self, state: AgentState) -> AgentState:
        if state.get("task_type") not in VALID_TASKS:
            state["error"] = f"Unknown task_type: {state.get('task_type')}"
        return state

    async def _dispatch_agent(self, state: AgentState) -> AgentState:
        task_type = state["task_type"]
        agent = self.agents.get(task_type)
        if not agent:
            state["error"] = f"No agent registered for task_type: {task_type}"
            state["output_data"] = {"error": state["error"]}
            return state
        try:
            result = await agent.run(state["input_data"])
            state["output_data"] = result
        except Exception as exc:
            logger.error("Agent dispatch failed for %s: %s", task_type, exc)
            state["error"] = str(exc)
            state["output_data"] = {"error": str(exc)}
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
