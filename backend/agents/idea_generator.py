import random
from pydantic import BaseModel, Field
from pydantic_ai import Agent

from .llm_config import model

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

idea_agent = Agent(
    model,
    output_type=ProjectIdea,
    system_prompt=(
        "You generate creative software project ideas. Given a topic and a difficulty "
        "level, produce a project title and a brief description."
    ),
)

def generate_project_idea(level: str = "beginner") -> ProjectIdea:
    """Generate a project idea based on level."""
    topic = random.choice(TOPICS.get(level, TOPICS["beginner"]))
    result = idea_agent.run_sync(f"Topic: {topic}\nLevel: {level}")
    return result.output
