import httpx
from fastapi import HTTPException, status

class GitHubService:
    def __init__(self, access_token: str):
        self.headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github.v3+json",
        }
        self.base_url = "https://api.github.com"

    async def create_repository(self, repo_name: str, description: str = None):
        url = f"{self.base_url}/user/repos"
        payload = {
            "name": repo_name,
            "description": description,
            "private": False,  # Or True, depending on desired default
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=self.headers, json=payload)
            if response.status_code == 201:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to create GitHub repository: {response.json().get('message', 'Unknown error')}"
                )
