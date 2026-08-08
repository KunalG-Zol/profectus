import os

from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider

OLLAMA_CLOUD_MODEL = os.environ.get("OLLAMA_MODEL", "gpt-oss:120b-cloud")

model = OpenAIChatModel(
    OLLAMA_CLOUD_MODEL,
    provider=OpenAIProvider(
        base_url="https://ollama.com/v1",
        api_key=os.environ.get("OLLAMA_API_KEY"),
    ),
)
