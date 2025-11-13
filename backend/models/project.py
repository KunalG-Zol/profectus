from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship

from ..db import Base

class Project(Base):
    __tablename__ = "project"
    id = Column(Integer, primary_key=True, unique=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    repo_name = Column(String)  # New: Repository name
    repo_url = Column(String)  # New: Repository URL
    completed = Column(Boolean, default=False, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="projects")
    questions = relationship("Question", back_populates="project")
    modules = relationship("Module", back_populates="project")

class Question(Base):
    __tablename__ = "question"
    id = Column(Integer, primary_key=True, unique=True, index=True)
    project_id = Column(Integer, ForeignKey("project.id"), index=True)
    text = Column(String, index=True)
    choices = Column(JSON)
    project = relationship("Project", back_populates="questions")
    answers = relationship("Answer", back_populates="question")

class Answer(Base):
    __tablename__ = "answer"
    id = Column(Integer, primary_key=True, unique=True, index=True)
    question_id = Column(Integer, ForeignKey("question.id"), index=True)
    selected_choice = Column(String)
    question = relationship("Question", back_populates="answers")

class Module(Base):
    __tablename__ = "module"
    id = Column(Integer, primary_key=True, unique=True, index=True)
    name = Column(String, index=True)
    description = Column(String, default="")
    project_id = Column(Integer, ForeignKey("project.id"), index=True)
    project = relationship("Project", back_populates="modules")
    completed = Column(Boolean, default=False, index=True)
    tasks = relationship("Task", back_populates="module")

class Task(Base):
    __tablename__ = "task"
    id = Column(Integer, unique=True, primary_key=True, index=True)
    description = Column(String, index=True)
    module_id = Column(Integer, ForeignKey("module.id"), index=True)
    module = relationship("Module", back_populates="tasks")
    completed = Column(Boolean, index=True, default=False)

