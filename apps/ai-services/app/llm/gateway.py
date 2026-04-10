import logging
from app.config import Settings

logger = logging.getLogger(__name__)


class LLMGateway:
    """
    Unified interface to OpenAI, Anthropic, Google.
    Falls back through providers if primary fails.
    """

    PROVIDER_ORDER = ["openai", "anthropic", "google"]

    # Default models per provider when no specific model is requested for that provider
    DEFAULT_MODELS = {
        "openai": "gpt-4o-mini",
        "anthropic": "claude-3-haiku-20240307",
        "google": "gemini-pro",
    }

    def __init__(self, settings: Settings):
        self.settings = settings

    async def complete(
        self,
        prompt: str,
        system: str = "",
        provider: str = None,
        model: str = None,
        max_tokens: int = 500,
    ) -> str:
        primary = provider or self.settings.default_llm_provider
        providers_to_try = [primary] + [p for p in self.PROVIDER_ORDER if p != primary]

        last_error = None
        for prov in providers_to_try:
            # Use requested model for the primary provider; fall back to provider default otherwise
            prov_model = (model or self.settings.default_model) if prov == primary else self.DEFAULT_MODELS[prov]
            try:
                if prov == "openai":
                    return await self.complete_openai(prompt, system, prov_model, max_tokens)
                elif prov == "anthropic":
                    return await self.complete_anthropic(prompt, system, prov_model, max_tokens)
                elif prov == "google":
                    return await self.complete_google(prompt, system, prov_model, max_tokens)
            except Exception as exc:
                logger.warning("Provider %s failed: %s", prov, exc)
                last_error = exc

        raise RuntimeError(f"All LLM providers failed. Last error: {last_error}") from last_error

    async def complete_openai(self, prompt: str, system: str, model: str, max_tokens: int) -> str:
        if not self.settings.openai_api_key:
            raise ValueError("OpenAI API key is not configured")
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=self.settings.openai_api_key)
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        response = await client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content or ""

    async def complete_anthropic(self, prompt: str, system: str, model: str, max_tokens: int) -> str:
        if not self.settings.anthropic_api_key:
            raise ValueError("Anthropic API key is not configured")
        import anthropic
        client = anthropic.AsyncAnthropic(api_key=self.settings.anthropic_api_key)
        kwargs = {
            "model": model,
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}],
        }
        if system:
            kwargs["system"] = system
        response = await client.messages.create(**kwargs)
        return response.content[0].text if response.content else ""

    async def complete_google(self, prompt: str, system: str, model: str, max_tokens: int) -> str:
        if not self.settings.google_api_key:
            raise ValueError("Google API key is not configured")
        import google.generativeai as genai
        genai.configure(api_key=self.settings.google_api_key)
        full_prompt = f"{system}\n\n{prompt}" if system else prompt
        gen_model = genai.GenerativeModel(model)
        response = await gen_model.generate_content_async(
            full_prompt,
            generation_config={"max_output_tokens": max_tokens},
        )
        return response.text or ""
