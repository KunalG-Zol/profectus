import os
from typing import Dict, List
from pydantic import BaseModel, Field
from langchain.chat_models import init_chat_model
from langchain_core.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate

class Roadmap(BaseModel):
    """Project roadmap with modules and steps"""
    modules: Dict[str, List[str]] = Field(
        description="Dictionary with module names as keys and lists of steps as values."
    )

def generate_roadmap(project_description: str, question_answer_pairs: Dict[str, str]) -> Roadmap:
    model = init_chat_model("deepseek-r1-distill-llama-70b", model_provider='groq')
    model = model.with_structured_output(Roadmap)

    # Format the question-answer pairs for the prompt
    qa_formatted = "\n".join([f"Question: {q}\nAnswer: {a}" for q, a in question_answer_pairs.items()])

    system_prompt = SystemMessagePromptTemplate.from_template(
        "You are an expert software development planner specializing in creating detailed project roadmaps."
            "Based on the project description and the answers to clarifying questions, create a comprehensive "
            "development roadmap organized into modules (phases)."
            "The roadmap should cover the entire project lifecycle, from initial setup to final deployment."
            "Each module should contain specific, actionable steps that guide the developer."
            "For each module, include detailed steps such as:\n"
            "- Setting up the environment (e.g., installing dependencies, configuring tools).\n"
            "- Creating specific modules or components (e.g., 'Create a module for user authentication').\n"
            "- Implementing features (e.g., 'Develop the API for user management').\n"
            "- Testing and debugging (e.g., 'Write unit tests for the authentication module').\n"
            "- Deployment tasks (e.g., 'Set up CI/CD pipelines, deploy to production').\n"
            "Consider these modules (but customize as needed for this specific project):\n"
            "- Initial Setup (environment configuration, repository setup)\n"
            "- Backend Development\n"
            "- Frontend Development\n"
            "- Database Design and Implementation\n"
            "- Authentication and Authorization\n"
            "- Core Features Implementation\n"
            "- Testing\n"
            "- Deployment\n"
            "- Documentation\n\n"
            "Return your response in this structured format:\n"
            "{{\n"
            "  \"modules\": {{\n"
            "    \"Module 1 Name\": [\"Step 1: Detailed description\", \"Step 2: Detailed description\", \"Step 3: Detailed description\"],\n"
            "    \"Module 2 Name\": [\"Step 1: Detailed description\", \"Step 2: Detailed description\", \"Step 3: Detailed description\"]\n"
            "  }}\n"
            "}}"
            "Provide only the structured output with no additional explanations."
        )

    human_prompt = HumanMessagePromptTemplate.from_template(
        "Project Description: {project_description}\n\n"
        "Clarifying Questions and Answers:\n{qa_pairs}"
    )

    prompt = ChatPromptTemplate.from_messages([system_prompt, human_prompt])
    chain = prompt | model

    return chain.invoke({"project_description": project_description, "qa_pairs": qa_formatted})