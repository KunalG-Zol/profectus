import httpx
from fastapi import HTTPException
from typing import List, Dict, Any
from datetime import datetime, timedelta


class GitHubService:
    BASE_URL = "https://api.github.com"

    def __init__(self, access_token: str):
        self.access_token = access_token
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }

    async def get_user_repos(self, per_page: int = 30) -> List[Dict[str, Any]]:
        """Get all repositories for the authenticated user"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/user/repos",
                headers=self.headers,
                params={"per_page": per_page, "sort": "updated"}
            )
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch repositories")
            return response.json()

    async def get_repo(self, owner: str, repo: str) -> Dict[str, Any]:
        """Get a specific repository"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/repos/{owner}/{repo}",
                headers=self.headers
            )
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch repository")
            return response.json()

    async def create_repo(self, name: str, description: str = "", private: bool = False) -> Dict[str, Any]:
        """Create a new repository"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/user/repos",
                headers=self.headers,
                json={
                    "name": name,
                    "description": description,
                    "private": private,
                    "auto_init": True
                }
            )
            if response.status_code != 201:
                raise HTTPException(status_code=response.status_code, detail="Failed to create repository")
            return response.json()

    async def create_file(self, owner: str, repo: str, path: str, content: str, message: str, branch: str = "main") -> \
            Dict[str, Any]:
        """Create or update a file in a repository"""
        import base64
        encoded_content = base64.b64encode(content.encode()).decode()

        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{self.BASE_URL}/repos/{owner}/{repo}/contents/{path}",
                headers=self.headers,
                json={
                    "message": message,
                    "content": encoded_content,
                    "branch": branch
                }
            )
            if response.status_code not in [200, 201]:
                raise HTTPException(status_code=response.status_code, detail="Failed to create file")
            return response.json()

    async def create_issue(self, owner: str, repo: str, title: str, body: str = "", labels: List[str] = None) -> Dict[
        str, Any]:
        """Create an issue in a repository"""
        async with httpx.AsyncClient() as client:
            data = {"title": title, "body": body}
            if labels:
                data["labels"] = labels

            response = await client.post(
                f"{self.BASE_URL}/repos/{owner}/{repo}/issues",
                headers=self.headers,
                json=data
            )
            if response.status_code != 201:
                raise HTTPException(status_code=response.status_code, detail="Failed to create issue")
            return response.json()

    async def get_recent_commits(self, owner: str, repo: str, since_days: int = 7, per_page: int = 30) -> List[
        Dict[str, Any]]:
        """Get recent commits from a repository"""
        since_date = (datetime.now() - timedelta(days=since_days)).isoformat()

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/repos/{owner}/{repo}/commits",
                headers=self.headers,
                params={
                    "since": since_date,
                    "per_page": per_page
                }
            )
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch commits")

            commits = response.json()

            # Format commits for easier processing
            formatted_commits = []
            for commit in commits:
                formatted_commits.append({
                    "sha": commit["sha"],
                    "message": commit["commit"]["message"],
                    "author": commit["commit"]["author"]["name"],
                    "date": commit["commit"]["author"]["date"],
                    "url": commit["html_url"]
                })

            return formatted_commits

    async def get_commit_files(self, owner: str, repo: str, sha: str) -> List[str]:
        """Get files changed in a specific commit"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/repos/{owner}/{repo}/commits/{sha}",
                headers=self.headers
            )
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch commit details")

            commit_data = response.json()
            files = [file["filename"] for file in commit_data.get("files", [])]
            return files
