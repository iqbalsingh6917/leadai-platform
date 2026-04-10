from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    google_api_key: str = ""
    redis_url: str = "redis://localhost:6379"
    api_base_url: str = "http://localhost:3000/api"
    environment: str = "development"
    default_llm_provider: str = "openai"
    default_model: str = "gpt-4o-mini"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
