from ..db import Base
from sqlalchemy import String, Column, Integer
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=True)
    github_id = Column(Integer, unique=True, nullable=True)
    github_access_token = Column(String, nullable=True)
    projects = relationship("Project", back_populates="user")
