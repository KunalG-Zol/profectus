from typing import List, Dict
from pydantic import BaseModel, Field
from pydantic_ai import Agent

from .llm_config import model


class TaskHelp(BaseModel):
    overview: str = Field(description="Brief overview of how to complete the task")
    steps: List[str] = Field(description="Step-by-step instructions")
    code_examples: List[Dict[str, str]] = Field(description="Code examples with language and code")
    resources: List[Dict[str, str]] = Field(description="Helpful resources with title and url")
    tips: List[str] = Field(description="Additional tips and best practices")


task_helper_agent = Agent(
    model,
    output_type=TaskHelp,
    system_prompt=(
        "You help developers complete specific tasks within a larger project. Given a "
        "task description and project context, provide an overview, step-by-step "
        "instructions, relevant code examples, helpful resources, and practical tips."
    ),
)


def get_task_help(task_description: str, project_title: str, project_description: str) -> TaskHelp:
    """
    Generates comprehensive help for completing a specific task.
    """
    project_context = f"Project: {project_title}\nDescription: {project_description}"
    prompt = f"Task: {task_description}\n\nProject context:\n{project_context}"

    result = task_helper_agent.run_sync(prompt)
    return result.output
