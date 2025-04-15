from typing import Dict, List

from pydantic import BaseModel

class ProjectCreate(BaseModel):
    title: str
    description: str

class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str

    class Config:
        orm_mode = True

class RoadmapResponse(BaseModel):
    modules: Dict[str, List[str]]