from typing import List
from pydantic import BaseModel, Field
from pydantic_ai import Agent

from .llm_config import model


class SubModule(BaseModel):
    name: str = Field(description="The name of the sub-module.")
    description: str = Field(description="A detailed description for the sub-module.")
    tasks: List[str] = Field(description="A list of actionable subtasks for this sub-module.")

class RoadmapModule(BaseModel):
    name: str = Field(description="The name of the module or major step.")
    description: str = Field(description="A detailed description for the module.")
    sub_modules: List[SubModule] = Field(default=[], description="Optional list of sub-modules.")
    tasks: List[str] = Field(default=[], description="A list of actionable subtasks for this module.")


roadmap_agent = Agent(
    model,
    output_type=List[RoadmapModule],
    system_prompt=(
        "Generate a structured project roadmap made of modules, each with a name, "
        "description, and actionable tasks. Break large modules into sub-modules where useful."
    ),
)


def generate_roadmap(description: str, qa_pairs: dict = None) -> List[RoadmapModule]:
    """
    Generates a roadmap with multiple modules, each with a name, a detailed description,
    and a list of actionable subtasks/tasks.
    """
    prompt = f"Project description: {description}"
    if qa_pairs:
        qa_text = "\n".join(f"- {q}: {a}" for q, a in qa_pairs.items())
        prompt += f"\n\nClarifying Q&A:\n{qa_text}"

    result = roadmap_agent.run_sync(prompt)
    return result.output
