from pydantic import BaseModel
from typing import Optional


class LeadData(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    source: str  # website|referral|social_media|email|phone|advertisement|other
    status: str  # new|contacted|qualified|unqualified|converted|lost
    notes: Optional[str] = None
    tags: list[str] = []


class ScoreRequest(BaseModel):
    lead: LeadData
    tenant_id: str


class ScoreResponse(BaseModel):
    lead_id: str
    score: int  # 0-100
    tier: str   # hot|warm|cold
    reasoning: str
    signals: dict[str, int]
    recommended_action: str


class IntentRequest(BaseModel):
    text: str
    context: Optional[str] = None


class IntentResponse(BaseModel):
    intent: str
    confidence: float
    sentiment: str
    entities: list[dict]


class SummaryRequest(BaseModel):
    lead_id: str
    context: str
    tone: str = "professional"


class SummaryResponse(BaseModel):
    summary: str
    key_points: list[str]
    recommended_actions: list[str]
