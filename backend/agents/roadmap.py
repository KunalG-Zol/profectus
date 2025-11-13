from typing import Dict, List, Any
from pydantic import BaseModel, Field
import dspy
import os


class RoadmapModule(BaseModel):
    name: str = Field(description="The name of the module or major step.")
    description: str = Field(description="A detailed description for the module.")
    tasks: List[str] = Field(description="A list of actionable subtasks for this module.")


class RoadmapSignature(dspy.Signature):
    description: str = dspy.InputField(desc="Description of the project.")
    modules: List[Dict[str, Any]] = dspy.OutputField(
        desc="List of modules. Each module has a name, a description, and a list of subtasks ('tasks').")


class RoadmapAgent(dspy.Module):
    def __init__(self):
        super().__init__()
        self.generate_roadmap = dspy.Predict(RoadmapSignature)

    def forward(self, description: str) -> List[RoadmapModule]:
        prediction = self.generate_roadmap(description=description)
        # If coming as dict, validate/parse into Pydantic objects:
        all_modules = []
        for mod in prediction.modules:
            all_modules.append(RoadmapModule(**mod))
        return all_modules


llm = dspy.LM("gemini/gemini-2.5-pro", api_key=os.environ.get("GEMINI_API_KEY"))
dspy.settings.configure(lm=llm)


def generate_roadmap(description: str, qa_pairs: dict = None):
    """
    Generates a roadmap with multiple modules, each with a name, a detailed description,
    and a list of actionable subtasks/tasks.
    """
    agent = RoadmapAgent()
    return agent.forward(description=description)
