import pytest
from app.nlp.processor import NLPProcessor
from app.models.lead import IntentRequest


@pytest.fixture
def processor():
    return NLPProcessor()


def test_buy_inquiry_intent_detected(processor):
    req = IntentRequest(text="I want to buy your product today")
    result = processor.process(req)
    assert result.intent == "buy_inquiry"
    assert result.confidence > 0.5


def test_price_inquiry_detected(processor):
    req = IntentRequest(text="How much does it cost? What are your pricing plans?")
    result = processor.process(req)
    assert result.intent == "price_inquiry"
    assert result.confidence > 0.5


def test_positive_sentiment_on_very_interested(processor):
    req = IntentRequest(text="I am very interested and excited about this product")
    result = processor.process(req)
    assert result.sentiment == "positive"


def test_negative_sentiment_on_not_interested(processor):
    req = IntentRequest(text="I am not interested, please remove me from your list")
    result = processor.process(req)
    assert result.sentiment == "negative"


def test_email_extraction_from_text(processor):
    req = IntentRequest(text="Please contact me at john.doe@example.com for more info")
    result = processor.process(req)
    emails = [e for e in result.entities if e["type"] == "email"]
    assert len(emails) >= 1
    assert emails[0]["value"] == "john.doe@example.com"


def test_phone_number_extraction(processor):
    req = IntentRequest(text="Call me at 555-123-4567 to discuss further")
    result = processor.process(req)
    phones = [e for e in result.entities if e["type"] == "phone"]
    assert len(phones) >= 1


def test_demo_request_intent(processor):
    req = IntentRequest(text="Can I schedule a demo to see how it works?")
    result = processor.process(req)
    assert result.intent == "demo_request"


def test_unknown_intent_for_neutral_text(processor):
    req = IntentRequest(text="The weather is nice today")
    result = processor.process(req)
    assert result.intent == "unknown"
    assert result.confidence < 0.6
