import dspy
import os
from typing import Dict, List
from pydantic import BaseModel, Field

class Roadmap(BaseModel):
    """Project roadmap with modules and steps"""
    modules: Dict[str, List[str]] = Field(
        description="Dictionary with module names as keys and lists of steps as values."
    )

class GenerateRoadmapSignature(dspy.Signature):
    """Generate a detailed project roadmap based on a project description and clarifying questions and answers."""
    project_description: str = dspy.InputField(desc="A detailed description of the project.")
    qa_pairs: str = dspy.InputField(desc="Formatted string of clarifying questions and their answers.")
    # Directly use the Pydantic model as the output type
    roadmap: Roadmap = dspy.OutputField(desc="The generated roadmap, structured as a dictionary of modules and steps.")

class RoadmapAgent(dspy.Module):
    def __init__(self):
        super().__init__()
        self.generate_roadmap = dspy.Predict(GenerateRoadmapSignature)

    def forward(self, project_description: str, qa_pairs: str) -> Roadmap:
        prediction = self.generate_roadmap(project_description=project_description, qa_pairs=qa_pairs)
        # DSPy should return an object where 'roadmap' is already a Roadmap instance
        return prediction.roadmap

# Global LLM configuration (as it was before)
llm = dspy.LM("gemini/gemini-2.5-pro", api_key=os.environ.get("GEMINI_API_KEY"))
dspy.settings.configure(lm=llm)

def generate_roadmap(project_description: str, question_answer_pairs: Dict[str, str]) -> Roadmap:
    qa_formatted = "\n".join([f"Question: {q}\nAnswer: {a}" for q, a in question_answer_pairs.items()])
    roadmap_agent = RoadmapAgent()
    return roadmap_agent.forward(project_description, qa_formatted)