import dspy
import os
from typing import List, Dict
from pydantic import BaseModel, Field

class QuestionsWithChoices(BaseModel):
    """Questions and Choices for the user"""
    questions_with_choices: Dict[str, List[str]] = Field(
        description="Dictionary with questions as keys and lists of choices as values."
    )

class GenerateQuestionsSignature(dspy.Signature):
    """Generate clarifying questions with options for a given project description."""
    project_description: str = dspy.InputField(desc="A detailed description of the project for which to generate questions.")
    # Directly use the Pydantic model as the output type
    questions: QuestionsWithChoices = dspy.OutputField(desc="The generated questions and choices, structured as a dictionary.")

class QuestionsAgent(dspy.Module):
    def __init__(self):
        super().__init__()
        self.generate_questions = dspy.Predict(GenerateQuestionsSignature)

    def forward(self, project_description: str) -> QuestionsWithChoices:
        prediction = self.generate_questions(project_description=project_description)
        # DSPy should return an object where 'questions' is already a QuestionsWithChoices instance
        return prediction.questions

# Global LLM configuration (as it was before)
llm = dspy.LM("gemini/gemini-2.5-pro", api_key=os.environ.get("GEMINI_API_KEY"))
dspy.settings.configure(lm=llm)

def generate_questions(project_description: str) -> QuestionsWithChoices:
    questions_agent = QuestionsAgent()
    return questions_agent.forward(project_description)