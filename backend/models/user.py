from ..db import Base
from sqlalchemy import String, Column, Integer, Text
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    github_id = Column(String, unique=True, nullable=True, index=True)
    github_access_token = Column(Text, nullable=True)  # Store GitHub token
    avatar_url = Column(String, nullable=True)
    name = Column(String, nullable=True)
    projects = relationship("Project", back_populates="user")
