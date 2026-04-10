import logging
from typing import Optional

logger = logging.getLogger(__name__)


class KnowledgeGraphAgent:
    """
    Generates cross-industry insights and lead similarity analysis
    by querying the Neo4j knowledge graph via the LeadAI REST API.
    Also produces natural-language summaries of graph insights using an LLM.
    """

    def __init__(self, llm_gateway, api_client=None):
        self.llm_gateway = llm_gateway
        self.api_client = api_client  # Optional HTTP client for calling NestJS API

    async def run(self, input_data: dict) -> dict:
        task = input_data.get("task", "industry_insights")
        try:
            if task == "similar_leads":
                return await self._similar_leads(input_data)
            elif task == "industry_insights":
                return await self._industry_insights(input_data)
            elif task == "cross_industry":
                return await self._cross_industry_insights(input_data)
            else:
                return {"error": f"Unknown knowledge graph task: {task}"}
        except Exception as exc:
            logger.error("KnowledgeGraphAgent failed: %s", exc)
            return {"error": str(exc)}

    async def _similar_leads(self, data: dict) -> dict:
        lead_id = data.get("lead_id")
        similar = data.get("similar_leads", [])  # Pre-fetched by caller

        if not similar:
            return {"similar_leads": [], "summary": "No similar leads found in the knowledge graph.", "count": 0}

        summary = await self._summarize_similar(lead_id, similar)
        return {"similar_leads": similar, "summary": summary, "count": len(similar)}

    async def _industry_insights(self, data: dict) -> dict:
        industry = data.get("industry", "unknown")
        insights = data.get("insights", [])

        if not insights:
            return {"industry": industry, "insights": [], "summary": "No data available for this industry."}

        summary = await self._summarize_industry(industry, insights)
        return {"industry": industry, "insights": insights, "summary": summary}

    async def _cross_industry_insights(self, data: dict) -> dict:
        industry = data.get("industry", "unknown")
        raw_insights = data.get("insights", [])

        if not raw_insights:
            return {"summary": "Insufficient cross-tenant data for this industry."}

        top = sorted(raw_insights, key=lambda x: x.get("totalLeads", 0), reverse=True)[:5]
        summary = await self._summarize_cross_industry(industry, top)
        return {"top_insights": top, "summary": summary}

    # ── LLM summarization helpers ─────────────────────────────────────────────

    async def _summarize_similar(self, lead_id: Optional[str], similar: list) -> str:
        try:
            names = ", ".join(s.get("name", s.get("id", "?")) for s in similar[:5])
            prompt = (
                f"Based on the knowledge graph, lead {lead_id} shares connections with: {names}.\n"
                f"There are {len(similar)} similar leads in total.\n"
                "In 2 sentences, explain what these leads have in common and how this insight "
                "can help prioritize outreach."
            )
            return await self.llm_gateway.complete(
                prompt, system="You are an expert B2B sales intelligence analyst."
            )
        except Exception:
            return f"Found {len(similar)} similar leads connected via shared companies, tags, or industries."

    async def _summarize_industry(self, industry: str, insights: list) -> str:
        try:
            total_leads = sum(i.get("leadCount", 0) for i in insights)
            sources = list({i.get("source", "unknown") for i in insights if i.get("source")})
            prompt = (
                f"Industry: {industry}. Total leads: {total_leads}. "
                f"Lead sources: {', '.join(sources)}.\n"
                "In 2-3 sentences, summarize the lead generation patterns in this industry "
                "and recommend the best channels for lead acquisition."
            )
            return await self.llm_gateway.complete(
                prompt, system="You are an expert B2B marketing analyst specializing in Indian SMBs."
            )
        except Exception:
            return f"{industry} industry has {sum(i.get('leadCount', 0) for i in insights)} leads in the graph."

    async def _summarize_cross_industry(self, industry: str, insights: list) -> str:
        try:
            total = sum(i.get("totalLeads", 0) for i in insights)
            avg_score = sum(float(i.get("avgScore", 0)) for i in insights) / max(len(insights), 1)
            prompt = (
                f"Cross-tenant anonymized data for industry '{industry}': "
                f"{total} total leads, average AI score: {avg_score:.1f}/100.\n"
                "In 2 sentences, describe what this benchmark means for companies operating in this industry "
                "and what score range indicates a high-quality lead."
            )
            return await self.llm_gateway.complete(
                prompt, system="You are a senior data scientist specializing in CRM benchmarking."
            )
        except Exception:
            return f"Anonymized cross-tenant data shows {sum(i.get('totalLeads', 0) for i in insights)} total leads for the '{industry}' industry."
