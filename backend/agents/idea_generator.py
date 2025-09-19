import dspy
import os
import random
from pydantic import BaseModel, Field

# List of diverse topics to seed the idea generation
TOPICS = [
    "sustainable energy solutions", "mental health and wellness apps", "gamified education platforms",
    "community-based social networks", "AI-powered creative tools", "blockchain for supply chain transparency",
    "personalized healthcare assistants", "smart home automation for accessibility", "virtual reality travel experiences",
    "decentralized finance (DeFi) applications", "e-commerce for local artisans", "cybersecurity for small businesses",
    "language learning through storytelling", "augmented reality for interior design", "fitness apps with personalized plans",
    "recipe generators for dietary restrictions", "music composition with AI", "automated gardening systems",
    "chatbot for customer support", "disaster relief coordination platform"
]

class ProjectIdea(BaseModel):
    """A project idea with a title and description."""
    title: str = Field(description="The title of the project idea.")
    description: str = Field(description="A brief description of the project idea.")

class GenerateIdeaSignature(dspy.Signature):
    """Generate a project idea with a title and a description on a given topic."""
    topic: str = dspy.InputField(desc="The topic for the project idea.")
    title: str = dspy.OutputField(desc="The title of the project idea.")
    description: str = dspy.OutputField(desc="A brief description of the project idea.")

class IdeaGeneratorAgent(dspy.Module):
    def __init__(self):
        super().__init__()
        self.generate_idea = dspy.Predict(GenerateIdeaSignature)

    def forward(self, topic: str) -> ProjectIdea:
        prediction = self.generate_idea(topic=topic)
        return ProjectIdea(title=prediction.title, description=prediction.description)

# Global LLM configuration
llm = dspy.LM("gemini/gemini-2.5-pro", api_key=os.environ.get("GEMINI_API_KEY"))
dspy.settings.configure(lm=llm)

def generate_project_idea() -> ProjectIdea:
    """Generates a project idea based on a randomly selected topic."""
    idea_generator_agent = IdeaGeneratorAgent()
    random_topic = random.choice(TOPICS)
    return idea_generator_agent.forward(topic=random_topic)