from typing import Dict, List, Optional, Any
from pydantic import BaseModel

class ProjectIdea(BaseModel):
    title: str
    description: str

class ProjectCreate(BaseModel):
    title: str
    description: str

class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    completed: bool = False

    class Config:
        orm_mode = True


class AnswerCreate(BaseModel):
    question_id: int
    selected_choice: str


class RoadmapResponse(BaseModel):
    modules: Dict[str, List[str]]

class ModuleCreate(BaseModel):
    name: str

class ModuleResponse(BaseModel):
    id: int
    name: str
    project_id: int
    completed: bool = False

    class Config:
        orm_mode = True

class TaskCreate(BaseModel):
    description: str

class TaskResponse(BaseModel):
    id: int
    description: str
    module_id: int
    completed: bool = False

    class Config:
        orm_mode = True

class TaskStatus(BaseModel):
    id: int
    description: str
    completed: bool

class ModuleStatus(BaseModel):
    id: int
    name: str
    completed: bool
    tasks: List[TaskStatus]

class ProjectStatusResponse(BaseModel):
    id: int
    title: str
    completed: bool
    modules: List[ModuleStatus]