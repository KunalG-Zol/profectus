from typing import List, Dict, Any
from pydantic import BaseModel, Field
import dspy
import os


class CodeExample(BaseModel):
    language: str = Field(description="Programming language of the code")
    code: str = Field(description="Code snippet")


class Resource(BaseModel):
    title: str = Field(description="Resource title")
    url: str = Field(description="Resource URL")


class TaskHelp(BaseModel):
    overview: str = Field(description="Brief overview of how to complete the task")
    steps: List[str] = Field(description="Step-by-step instructions")
    code_examples: List[Dict[str, str]] = Field(description="Code examples with language and code")
    resources: List[Dict[str, str]] = Field(description="Helpful resources with title and url")
    tips: List[str] = Field(description="Additional tips and best practices")


class TaskHelpSignature(dspy.Signature):
    task_description: str = dspy.InputField(desc="Description of the task")
    project_context: str = dspy.InputField(desc="Context about the overall project")
    overview: str = dspy.OutputField(desc="Brief overview of the task")
    steps: List[str] = dspy.OutputField(desc="Detailed step-by-step guide")
    code_examples: List[Dict[str, str]] = dspy.OutputField(desc="Code examples")
    resources: List[Dict[str, str]] = dspy.OutputField(desc="Helpful resources")
    tips: List[str] = dspy.OutputField(desc="Pro tips")


class TaskHelperAgent(dspy.Module):
    def __init__(self):
        super().__init__()
        self.generate_help = dspy.ChainOfThought(TaskHelpSignature)

    def forward(self, task_description: str, project_context: str) -> TaskHelp:
        prediction = self.generate_help(
            task_description=task_description,
            project_context=project_context
        )

        return TaskHelp(
            overview=prediction.overview,
            steps=prediction.steps if isinstance(prediction.steps, list) else [prediction.steps],
            code_examples=prediction.code_examples if isinstance(prediction.code_examples, list) else [],
            resources=prediction.resources if isinstance(prediction.resources, list) else [],
            tips=prediction.tips if isinstance(prediction.tips, list) else []
        )


llm = dspy.LM("gemini/gemini-2.5-pro", api_key=os.environ.get("GEMINI_API_KEY"))
dspy.settings.configure(lm=llm)


def get_task_help(task_description: str, project_title: str, project_description: str) -> TaskHelp:
    """
    Generates comprehensive help for completing a specific task.
    """
    project_context = f"Project: {project_title}\nDescription: {project_description}"

    agent = TaskHelperAgent()
    return agent.forward(
        task_description=task_description,
        project_context=project_context
    )
