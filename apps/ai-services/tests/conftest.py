import pytest
from app.models.lead import LeadData, ScoreRequest, IntentRequest


@pytest.fixture
def full_lead() -> LeadData:
    return LeadData(
        id="lead-001",
        firstName="Jane",
        lastName="Smith",
        email="jane.smith@acme.com",
        phone="+1-555-123-4567",
        company="Acme Corp",
        source="referral",
        status="qualified",
        notes="Very interested in enterprise plan. Budget approved.",
        tags=["enterprise", "high-priority"],
    )


@pytest.fixture
def minimal_lead() -> LeadData:
    return LeadData(
        id="lead-002",
        firstName="John",
        lastName="",
        email=None,
        phone=None,
        company=None,
        source="other",
        status="new",
        notes=None,
        tags=[],
    )


@pytest.fixture
def referral_lead() -> LeadData:
    return LeadData(
        id="lead-003",
        firstName="Alice",
        lastName="Johnson",
        email="alice@corp.com",
        phone=None,
        company="Corp Inc",
        source="referral",
        status="new",
        notes=None,
        tags=[],
    )


@pytest.fixture
def other_source_lead() -> LeadData:
    return LeadData(
        id="lead-004",
        firstName="Bob",
        lastName="Brown",
        email="bob@example.com",
        phone=None,
        company="Example LLC",
        source="other",
        status="new",
        notes=None,
        tags=[],
    )


@pytest.fixture
def qualified_lead() -> LeadData:
    return LeadData(
        id="lead-005",
        firstName="Carol",
        lastName="White",
        email="carol@biz.com",
        phone=None,
        company="Biz Co",
        source="website",
        status="qualified",
        notes=None,
        tags=[],
    )


@pytest.fixture
def new_status_lead() -> LeadData:
    return LeadData(
        id="lead-006",
        firstName="Dave",
        lastName="Black",
        email="dave@biz.com",
        phone=None,
        company="Biz Co",
        source="website",
        status="new",
        notes=None,
        tags=[],
    )
