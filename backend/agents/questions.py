from typing import List, Dict
from pydantic import BaseModel, Field
from pydantic_ai import Agent

from .llm_config import model

class QuestionsWithChoices(BaseModel):
    """Questions and Choices for the user"""
    questions_with_choices: Dict[str, List[str]] = Field(
        description="Dictionary with questions as keys and lists of choices as values."
    )

questions_agent = Agent(
    model,
    output_type=QuestionsWithChoices,
    system_prompt=(
        "Generate clarifying questions with multiple-choice options for a given project "
        "description, to help refine the project's scope and requirements."
    ),
)

def generate_questions(project_description: str) -> QuestionsWithChoices:
    result = questions_agent.run_sync(f"Project description: {project_description}")
    return result.output
