from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship

from ..db import Base

class Project(Base):
    __tablename__ = "project"
    id = Column(Integer, primary_key=True, unique=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    questions = relationship("Question", back_populates="project")

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

