from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import or_
import httpx
import secrets
from typing import Optional

from .. import auth
from ..db import get_db
from ..models.user import User
from ..schemas.user import UserCreate, Token, User as UserSchema
from ..config import GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URI


FRONTEND_URL = "http://localhost:5173"


router = APIRouter(prefix="/auth", tags=["auth"])

# WARNING: This is not a production-ready solution for state management.
# In a real application, use a more persistent and secure storage like a database or a cache.
state_storage = {}


@router.get("/github/login")
async def github_login():
    state = secrets.token_urlsafe(16)
    # In a real app, you'd want to store this state in the user's session
    # or a short-lived cache to prevent CSRF attacks.
    state_storage[state] = True 
    return Response(
        status_code=status.HTTP_302_FOUND,
        headers={"Location": f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&redirect_uri={GITHUB_REDIRECT_URI}&scope=user:email&state={state}"}
    )

@router.get("/github/callback")
async def github_callback(code: str, state: str, db: Session = Depends(get_db)):
    if not state_storage.pop(state, None):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid state parameter. Please try logging in again.",
        )

    async with httpx.AsyncClient() as client:
        # Exchange the code for an access token
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            json={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": GITHUB_REDIRECT_URI,
            },
        )
        token_response.raise_for_status()
        token_data = token_response.json()
        access_token = token_data.get("access_token")

        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get access token from GitHub.",
            )

        # Fetch user profile from GitHub
        user_response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"token {access_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )
        user_response.raise_for_status()
        github_user_data = user_response.json()

        github_id = github_user_data.get("id")
        github_username = github_user_data.get("login")
        github_email = github_user_data.get("email")

        user = db.query(User).filter(User.github_id == github_id).first()

        if not user:
            # User doesn't exist, create a new one
            # Check if the GitHub username is already taken in our system
            db_user_with_username = db.query(User).filter(User.username == github_username).first()
            if db_user_with_username:
                # Handle username collision, e.g., by appending a random suffix
                github_username = f"{github_username}_{secrets.token_hex(4)}"

            user = User(
                username=github_username,
                email=github_email,
                github_id=github_id,
                github_access_token=access_token,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # User exists, update their access token
            user.github_access_token = access_token
            db.commit()

    jwt_token = auth.create_access_token(data={"sub": user.username})
    return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?token={jwt_token}")


@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    hashed_password = auth.get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(auth.get_current_user)):
    return current_user
