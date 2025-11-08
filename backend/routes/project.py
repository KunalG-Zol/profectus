from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..db import get_db
from ..models.project import Project, Question, Answer, Module, Task
from ..models.user import User
from ..agents.questions import generate_questions
from ..agents.roadmap import generate_roadmap
from ..agents.idea_generator import generate_project_idea
from ..schemas.project import (
    ProjectCreate, ProjectResponse, ModuleCreate, ModuleResponse,
    TaskCreate, TaskResponse, ProjectStatusResponse, ProjectIdea, AnswerCreate
)
from ..schemas.question import QuestionsWithChoices, QuestionResponse
from ..auth import get_current_user
from ..services.github_service import GitHubService

# Import the service to update completion status
from ..services.completion_tracker import mark_completed

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.post("/generate-idea", response_model=ProjectIdea)
def get_project_idea():
    return generate_project_idea()


@router.post("/", response_model=ProjectResponse)
async def create_project(
        project: ProjectCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Create GitHub repository
    if not current_user.github_access_token:
        raise HTTPException(status_code=400, detail="GitHub access token not found")

    github = GitHubService(current_user.github_access_token)

    try:
        # Create repo on GitHub
        repo = await github.create_repo(
            name=project.repo_name,
            description=project.repo_desc or project.description,
            private=project.repo_private
        )

        # Create project in database with repo info
        db_project = Project(
            title=project.title,
            description=project.description,
            user_id=current_user.id,
            repo_name=repo['name'],
            repo_url=repo['html_url']
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=f"Failed to create GitHub repository: {e.detail}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating project: {str(e)}")


@router.get("/", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    return projects


@router.post("/{project_id}/generate-questions", response_model=List[QuestionResponse])
def get_questions(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    questions_data = generate_questions(project.description)

    # Save the questions to the database
    new_questions = []
    for q_text, q_choices in questions_data.questions_with_choices.items():
        question = Question(
            project_id=project_id,
            text=q_text,
            choices=q_choices
        )
        db.add(question)
        new_questions.append(question)
    db.commit()

    # Refresh the new_questions to get their IDs
    for question in new_questions:
        db.refresh(question)

    return new_questions


@router.post("/{project_id}/answers", status_code=201)
def submit_answers(project_id: int, answers: List[AnswerCreate], db: Session = Depends(get_db)):
    # First, check if the project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Now, iterate through the answers and save them
    for answer_data in answers:
        # Verify that the question exists and belongs to the project
        question = db.query(Question).filter(
            Question.id == answer_data.question_id,
            Question.project_id == project_id
        ).first()

        if not question:
            raise HTTPException(
                status_code=404,
                detail=f"Question with id {answer_data.question_id} not found for this project."
            )

        # Create and save the answer
        answer = Answer(
            question_id=answer_data.question_id,
            selected_choice=answer_data.selected_choice
        )
        db.add(answer)

    db.commit()
    return {"message": "Answers submitted successfully"}


@router.post("/{project_id}/modules", response_model=ModuleResponse)
def create_module(project_id: int, module_data: ModuleCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    module = Module(name=module_data.name, project_id=project_id)
    db.add(module)
    db.commit()
    db.refresh(module)
    return module


@router.get("/{project_id}/modules", response_model=List[ModuleResponse])
def get_modules(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    modules = db.query(Module).filter(Module.project_id == project_id).all()
    return modules


@router.post("/modules/{module_id}/tasks", response_model=TaskResponse)
def create_task(module_id: int, task_data: TaskCreate, db: Session = Depends(get_db)):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    task = Task(description=task_data.description, module_id=module_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/modules/{module_id}/tasks", response_model=List[TaskResponse])
def get_tasks(module_id: int, db: Session = Depends(get_db)):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    tasks = db.query(Task).filter(Task.module_id == module_id).all()
    return tasks


@router.put("/tasks/{task_id}/complete")
def complete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    success = mark_completed(db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to mark task as completed")

    return {"message": "Task completed successfully"}


@router.post("/{project_id}/generate-roadmap", response_model=ProjectStatusResponse)
def generate_project_roadmap(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Fetch answers for the project
    answers = db.query(Answer).join(Question).filter(Question.project_id == project_id).all()
    if not answers:
        qa_pairs = {}
    else:
        qa_pairs = {ans.question.text: ans.selected_choice for ans in answers}

    # Generate the roadmap
    roadmap_data = generate_roadmap(project.description, qa_pairs)

    # Save the roadmap to the database
    for module_name, tasks in roadmap_data.modules.items():
        # Create and save the module
        module = Module(name=module_name, project_id=project_id)
        db.add(module)
        db.commit()
        db.refresh(module)

        # Create and save the tasks for the module
        for task_desc in tasks:
            task = Task(description=task_desc, module_id=module.id)
            db.add(task)
        db.commit()

    # Return the updated project status
    return get_project_status(project_id, db)


@router.get("/{project_id}/status", response_model=ProjectStatusResponse)
def get_project_status(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    modules = db.query(Module).filter(Module.project_id == project_id).all()
    modules_status = []

    for module in modules:
        tasks = db.query(Task).filter(Task.module_id == module.id).all()
        task_status = [
            {"id": task.id, "description": task.description, "completed": task.completed}
            for task in tasks
        ]

        modules_status.append({
            "id": module.id,
            "name": module.name,
            "completed": module.completed,
            "tasks": task_status
        })

    return {
        "id": project.id,
        "title": project.title,
        "completed": project.completed,
        "modules": modules_status
    }
