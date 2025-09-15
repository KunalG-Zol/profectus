from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models.project import Project, Question, Answer, Module, Task
from ..agents.questions import generate_questions
from ..agents.roadmap import generate_roadmap
from ..schemas.project import *
from ..schemas.question import *

# Import the service to update completion status
from ..services.completion_tracker import mark_completed

router = APIRouter(prefix="/api/projects", tags=["projects"])


# ... your existing routes ...

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


@router.get("/{project_id}/status", response_model=ProjectStatusResponse)
def get_project_status(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    modules = db.query(Module).filter(Module.project_id == project_id).all()
    modules_status = []

    for module in modules:
        tasks = db.query(Task).filter(Task.module_id == module.id).all()
        task_status = [{"id": task.id, "description": task.description, "completed": task.completed}
                       for task in tasks]

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