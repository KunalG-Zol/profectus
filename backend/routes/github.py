from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..db import get_db
from ..auth import get_current_user
from ..models.user import User
from ..services.github_service import GitHubService

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/repos")
async def get_user_repositories(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Get all repositories for the authenticated user"""
    if not current_user.github_access_token:
        raise HTTPException(status_code=400, detail="GitHub access token not found")

    github_service = GitHubService(current_user.github_access_token)
    repos = await github_service.get_user_repos()
    return repos


@router.post("/repos")
async def create_repository(
        name: str,
        description: str = "",
        private: bool = False,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """Create a new repository"""
    if not current_user.github_access_token:
        raise HTTPException(status_code=400, detail="GitHub access token not found")

    github_service = GitHubService(current_user.github_access_token)
    repo = await github_service.create_repo(name, description, private)
    return repo
