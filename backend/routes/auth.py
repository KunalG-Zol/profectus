import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from .. import auth
from ..db import get_db
from ..models.user import User
from ..schemas.user import Token, User as UserSchema

router = APIRouter(prefix="/auth", tags=["auth"])

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


@router.get("/github/callback")
async def github_callback(
        code: str = Query(...),
        state: str = Query(None),
        db: Session = Depends(get_db)
):
    """Handle GitHub OAuth callback and redirect to frontend"""

    try:
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": GITHUB_CLIENT_ID,
                    "client_secret": GITHUB_CLIENT_SECRET,
                    "code": code,
                }
            )

            if token_response.status_code != 200:
                return RedirectResponse(
                    url=f"{FRONTEND_URL}/login?error=token_exchange_failed"
                )

            token_data = token_response.json()
            github_access_token = token_data.get("access_token")

            if not github_access_token:
                return RedirectResponse(
                    url=f"{FRONTEND_URL}/login?error=no_access_token"
                )

            # Get user information from GitHub
            user_response = await client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {github_access_token}",
                    "Accept": "application/json"
                }
            )

            if user_response.status_code != 200:
                return RedirectResponse(
                    url=f"{FRONTEND_URL}/login?error=failed_to_get_user"
                )

            github_user = user_response.json()

            # Get user email
            email = github_user.get("email")
            if not email:
                email_response = await client.get(
                    "https://api.github.com/user/emails",
                    headers={
                        "Authorization": f"Bearer {github_access_token}",
                        "Accept": "application/json"
                    }
                )
                if email_response.status_code == 200:
                    emails = email_response.json()
                    primary_email = next((e for e in emails if e.get("primary")), None)
                    if primary_email:
                        email = primary_email.get("email")

            # Check if user exists
            user = db.query(User).filter(User.github_id == str(github_user["id"])).first()

            if not user:
                # Create new user
                user = User(
                    github_id=str(github_user["id"]),
                    username=github_user["login"],
                    email=email,
                    name=github_user.get("name"),
                    avatar_url=github_user.get("avatar_url"),
                    github_access_token=github_access_token  # Save the token
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            else:
                # Update user information and token
                user.username = github_user["login"]
                user.email = email or user.email
                user.name = github_user.get("name") or user.name
                user.avatar_url = github_user.get("avatar_url") or user.avatar_url
                user.github_access_token = github_access_token  # Update token
                db.commit()
                db.refresh(user)

            # Create JWT access token
            access_token = auth.create_access_token(data={"sub": user.username})

            import json
            import urllib.parse
            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": user.name,
                "avatar_url": user.avatar_url
            }
            user_json = urllib.parse.quote(json.dumps(user_data))

            frontend_url = state if state else FRONTEND_URL
            return RedirectResponse(
                url=f"{frontend_url}/login?token={access_token}&user={user_json}"
            )

    except Exception as e:
        print(f"GitHub OAuth error: {e}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=authentication_failed"
        )


@router.get("/users/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(auth.get_current_user)):
    return current_user
