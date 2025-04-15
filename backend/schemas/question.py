from typing import Dict, List
from pydantic import BaseModel


class QuestionCreate(BaseModel):
    text: str
    choices: List[str]


class QuestionResponse(BaseModel):
    id: int
    text: str
    choices: List[str]

    class Config:
        orm_mode = True


class AnswerCreate(BaseModel):
    question_id: int
    selected_choice: str


class AnswerResponse(BaseModel):
    id: int
    question_id: int
    selected_choice: str

    class Config:
        orm_mode = True
