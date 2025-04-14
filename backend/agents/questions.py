import getpass
import os
from dotenv import load_dotenv
from typing import List, Dict
from pydantic import BaseModel, Field

load_dotenv()

if not os.environ.get("GROQ_API_KEY"):
    os.environ["GROQ_API_KEY"] = getpass.getpass("Enter API key for Groq: ")

from langchain.chat_models import init_chat_model
from langchain_core.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate

class QuestionsWithChoices(BaseModel):
    """Questions and Choices for the user"""
    questions_with_choices: Dict[str, List[str]] = Field(
        description="Dictionary with questions as keys and lists of choices as values."
    )

def generate_questions(project_description: str) -> QuestionsWithChoices:
    model = init_chat_model("deepseek-r1-distill-llama-70b", model_provider='groq')
    model = model.with_structured_output(QuestionsWithChoices)

    system_prompt = SystemMessagePromptTemplate.from_template(
        "You are an expert programming instructor helping students break down project ideas."
        "The student will provide a description of their project idea, and your job is to generate clarifying questions WITH OPTIONS. "
        "For each question, provide 3-4 multiple-choice options that the student can choose from. "
        "Focus on identifying gaps or ambiguities in their project plan to help them develop a clear roadmap. "
        "Consider these aspects:\n"
        "- Technical stack and programming languages\n"
        "- Development environment and tools\n"
        "- Project scope and complexity\n"
        "- User experience and interface requirements\n"
        "- Target deployment platform(s)\n"
        "- Learning objectives for the student\n"
        "- Student's current skill level\n"
        "- Time commitment and deadlines\n\n"
        "Return your response in a format compatible with this structure:\n"
        "{{\n"
        "  \"questions_with_choices\": {{\n"
        "    \"Question 1?\": [\"Option 1\", \"Option 2\", \"Option 3\"],\n"
        "    \"Question 2?\": [\"Option A\", \"Option B\", \"Option C\"]\n"
        "  }}\n"
        "}}"
        "Return ONLY this, with no additional text, no thinking text. REMEMBER NO ADDITIONAL TEXT")

    human_prompt = HumanMessagePromptTemplate.from_template("Project Description: {project_description}")
    prompt = ChatPromptTemplate.from_messages([system_prompt, human_prompt])
    chain = prompt | model

    return chain.invoke({"project_description": project_description})