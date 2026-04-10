import pytest
from unittest.mock import AsyncMock, MagicMock
from app.agents.knowledge_graph_agent import KnowledgeGraphAgent


@pytest.fixture
def mock_llm():
    llm = MagicMock()
    llm.complete = AsyncMock(return_value="Mocked LLM summary.")
    return llm


@pytest.fixture
def agent(mock_llm):
    return KnowledgeGraphAgent(llm_gateway=mock_llm)


@pytest.mark.asyncio
async def test_similar_leads_empty(agent):
    result = await agent.run({"task": "similar_leads", "lead_id": "lead-001", "similar_leads": []})
    assert result["count"] == 0
    assert "No similar leads" in result["summary"]


@pytest.mark.asyncio
async def test_similar_leads_with_data(agent):
    similar = [{"id": "lead-002", "name": "Amit Sharma"}, {"id": "lead-003", "name": "Priya Patel"}]
    result = await agent.run({"task": "similar_leads", "lead_id": "lead-001", "similar_leads": similar})
    assert result["count"] == 2
    assert len(result["similar_leads"]) == 2
    assert result["summary"] == "Mocked LLM summary."


@pytest.mark.asyncio
async def test_industry_insights_empty(agent):
    result = await agent.run({"task": "industry_insights", "industry": "Fintech", "insights": []})
    assert result["industry"] == "Fintech"
    assert "No data available" in result["summary"]


@pytest.mark.asyncio
async def test_industry_insights_with_data(agent):
    insights = [{"source": "website", "leadCount": 50, "tags": ["sme", "fintech"]}]
    result = await agent.run({"task": "industry_insights", "industry": "Fintech", "insights": insights})
    assert result["industry"] == "Fintech"
    assert result["summary"] == "Mocked LLM summary."


@pytest.mark.asyncio
async def test_cross_industry_insights_empty(agent):
    result = await agent.run({"task": "cross_industry", "industry": "Healthcare", "insights": []})
    assert "Insufficient" in result["summary"]


@pytest.mark.asyncio
async def test_cross_industry_insights_with_data(agent):
    insights = [{"totalLeads": 200, "avgScore": 68.5, "source": "referral"}]
    result = await agent.run({"task": "cross_industry", "industry": "Healthcare", "insights": insights})
    assert "top_insights" in result
    assert result["summary"] == "Mocked LLM summary."


@pytest.mark.asyncio
async def test_unknown_task_returns_error(agent):
    result = await agent.run({"task": "invalid_task"})
    assert "error" in result
    assert "Unknown knowledge graph task" in result["error"]


@pytest.mark.asyncio
async def test_llm_failure_falls_back_gracefully(agent, mock_llm):
    mock_llm.complete = AsyncMock(side_effect=Exception("LLM unavailable"))
    similar = [{"id": "lead-002", "name": "Test Lead"}]
    result = await agent.run({"task": "similar_leads", "lead_id": "lead-001", "similar_leads": similar})
    assert result["count"] == 1
    # Should fall back to non-LLM summary
    assert "similar lead" in result["summary"].lower()
