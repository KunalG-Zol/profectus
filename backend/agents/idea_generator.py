import dspy
import os
import random
from pydantic import BaseModel, Field

TOPICS = {
    "beginner": [
        "basic to-do app", "recipe finder", "habit tracker", "weather dashboard", "personal blog"
    ],
    "intermediate": [
        "chatbot for customer support", "budgeting/expense app", "multi-user blogging platform",
        "quiz or flashcard app", "project management board"
    ],
    "advanced": [
        "AI-powered creative tools", "VR experience platform", "DeFi app", "collaborative code editor",
        "custom recommender system"
    ]
}

class ProjectIdea(BaseModel):
    title: str = Field(description="The title of the project idea.")
    description: str = Field(description="A brief description of the project idea.")

class GenerateIdeaSignature(dspy.Signature):
    topic: str = dspy.InputField(desc="The topic for the project idea.")
    level: str = dspy.InputField(desc="The difficulty level: beginner, intermediate, or advanced.")
    title: str = dspy.OutputField(desc="The title of the project idea.")
    description: str = dspy.OutputField(desc="A brief description of the project idea.")

class IdeaGeneratorAgent(dspy.Module):
    def __init__(self):
        super().__init__()
        self.generate_idea = dspy.Predict(GenerateIdeaSignature)

    def forward(self, topic: str, level: str) -> ProjectIdea:
        prediction = self.generate_idea(topic=topic, level=level)
        return ProjectIdea(title=prediction.title, description=prediction.description)

llm = dspy.LM("gemini/gemini-2.5-pro", api_key=os.environ.get("GEMINI_API_KEY"))
dspy.settings.configure(lm=llm)

def generate_project_idea(level: str = "beginner") -> ProjectIdea:
    """Generate a project idea based on level."""
    idea_generator_agent = IdeaGeneratorAgent()
    topic = random.choice(TOPICS.get(level, TOPICS["beginner"]))
    return idea_generator_agent.forward(topic=topic, level=level)
