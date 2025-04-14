from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, List, Optional
from pydantic import BaseModel

from ..db import get_db
from ..models.project import Project, Question, Answer
from ..agents.questions import generate_questions
from ..agents.roadmap import generate_roadmap

router = APIRouter(prefix="/api/projects", tags=["projects"])

class ProjectCreate(BaseModel):
    title: str
    description: str

class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str

    class Config:
        orm_mode = True

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

class RoadmapResponse(BaseModel):
    modules: Dict[str, List[str]]

@router.post("/", response_model=ProjectResponse)
def create_project(project_data: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(title=project_data.title, description=project_data.description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/{project_id}/generate-questions", response_model=List[QuestionResponse])
def create_questions(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Generate questions using the LLM
    questions_with_choices = generate_questions(project.description)

    # Store questions in the database
    db_questions = []
    for question_text, choices in questions_with_choices.questions_with_choices.items():
        question = Question(
            project_id=project_id,
            text=question_text,
            choices=choices
        )
        db.add(question)
        db_questions.append(question)

    db.commit()
    for question in db_questions:
        db.refresh(question)

    return db_questions

@router.post("/{project_id}/answers", response_model=List[AnswerResponse])
def create_answers(project_id: int, answers: List[AnswerCreate], db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db_answers = []
    for answer_data in answers:
        # Verify question belongs to this project
        question = db.query(Question).filter(
            Question.id == answer_data.question_id,
            Question.project_id == project_id
        ).first()

        if not question:
            raise HTTPException(status_code=404, detail=f"Question {answer_data.question_id} not found for this project")

        # Verify selected choice is valid
        if answer_data.selected_choice not in question.choices:
            raise HTTPException(status_code=400, detail=f"Invalid choice for question {question.id}")

        answer = Answer(
            question_id=answer_data.question_id,
            selected_choice=answer_data.selected_choice
        )
        db.add(answer)
        db_answers.append(answer)

    db.commit()
    for answer in db_answers:
        db.refresh(answer)

    return db_answers

@router.get("/{project_id}/roadmap", response_model=RoadmapResponse)
def get_roadmap(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Get all questions and answers for this project
    questions = db.query(Question).filter(Question.project_id == project_id).all()

    if not questions:
        raise HTTPException(status_code=400, detail="No questions found for this project")

    question_answer_pairs = {}
    for question in questions:
        answer = db.query(Answer).filter(Answer.question_id == question.id).first()
        if answer:
            question_answer_pairs[question.text] = answer.selected_choice

    if not question_answer_pairs:
        raise HTTPException(status_code=400, detail="No answers found for this project")

    # Generate roadmap using the LLM
    roadmap = generate_roadmap(project.description, question_answer_pairs)

    return roadmap