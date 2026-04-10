import pytest
from app.scoring.engine import LeadScoringEngine
from app.models.lead import LeadData


@pytest.fixture
def engine():
    return LeadScoringEngine()


def make_lead(**kwargs) -> LeadData:
    defaults = dict(
        id="test-id",
        firstName="Test",
        lastName="User",
        email="test@example.com",
        phone=None,
        company="Test Co",
        source="website",
        status="new",
        notes=None,
        tags=[],
    )
    defaults.update(kwargs)
    return LeadData(**defaults)


def test_full_lead_scores_higher_than_minimal(engine):
    full = make_lead(
        email="full@example.com",
        phone="555-123-4567",
        company="BigCorp",
        source="referral",
        status="qualified",
        notes="Very interested",
        tags=["hot"],
    )
    minimal = make_lead(
        email=None,
        phone=None,
        company=None,
        source="other",
        status="new",
        notes=None,
        tags=[],
    )
    assert engine.score(full).score > engine.score(minimal).score


def test_referral_source_scores_higher_than_other(engine):
    referral = make_lead(source="referral", status="new")
    other = make_lead(source="other", status="new")
    assert engine.score(referral).signals["source_quality"] > engine.score(other).signals["source_quality"]


def test_qualified_status_scores_higher_than_new(engine):
    qualified = make_lead(status="qualified")
    new = make_lead(status="new")
    assert engine.score(qualified).signals["status_progress"] > engine.score(new).signals["status_progress"]


def test_hot_tier_threshold(engine):
    hot_lead = make_lead(
        email="hot@example.com",
        phone="555-000-0000",
        company="HotCorp",
        source="referral",
        status="qualified",
        notes="Very interested",
        tags=["enterprise"],
    )
    result = engine.score(hot_lead)
    assert result.score >= 70
    assert result.tier == "hot"


def test_cold_tier_threshold(engine):
    cold_lead = make_lead(
        email=None,
        phone=None,
        company=None,
        source="other",
        status="new",
        notes=None,
        tags=[],
        firstName="X",
        lastName="",
    )
    result = engine.score(cold_lead)
    assert result.score < 40
    assert result.tier == "cold"


def test_score_between_0_and_100(engine):
    for source in ["referral", "website", "other", "social_media"]:
        for status in ["new", "contacted", "qualified", "converted", "lost"]:
            lead = make_lead(source=source, status=status)
            result = engine.score(lead)
            assert 0 <= result.score <= 100, (
                f"Score {result.score} out of range for source={source}, status={status}"
            )


def test_warm_tier_range(engine):
    warm_lead = make_lead(
        email="warm@example.com",
        phone=None,
        company="WarmCorp",
        source="website",
        status="contacted",
        notes=None,
        tags=[],
    )
    result = engine.score(warm_lead)
    assert 40 <= result.score < 70
    assert result.tier == "warm"
