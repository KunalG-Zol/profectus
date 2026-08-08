from typing import Dict, List
from pydantic import BaseModel, ConfigDict, Field


class QuestionsWithChoices(BaseModel):
    """Questions and Choices for the user"""
    questions_with_choices: Dict[str, List[str]] = Field(
        description="Dictionary with questions as keys and lists of choices as values."
    )

class QuestionCreate(BaseModel):
    text: str
    choices: List[str]


class QuestionResponse(BaseModel):
    id: int
    text: str
    choices: List[str]

    model_config = ConfigDict(from_attributes=True)


class AnswerCreate(BaseModel):
    question_id: int
    selected_choice: str


class AnswerResponse(BaseModel):
    id: int
    question_id: int
    selected_choice: str

    model_config = ConfigDict(from_attributes=True)
