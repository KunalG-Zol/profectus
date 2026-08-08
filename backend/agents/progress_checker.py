from typing import List, Dict, Any
from pydantic import BaseModel, Field
from pydantic_ai import Agent

from .llm_config import model


class CommitAnalysis(BaseModel):
    task_completed: bool = Field(description="Whether the task appears to be completed based on commits")
    confidence: float = Field(description="Confidence level (0-1) that the task is complete")
    reasoning: str = Field(description="Explanation of why the task is or isn't complete")
    relevant_commits: List[str] = Field(description="List of relevant commit messages")


progress_agent = Agent(
    model,
    output_type=CommitAnalysis,
    system_prompt=(
        "You analyze git commit history to judge whether a described task has been "
        "completed. Report a completion verdict, a confidence level between 0 and 1, "
        "and your reasoning."
    ),
)


def check_task_progress(task_description: str, commits_data: List[Dict], files_changed: List[str]) -> CommitAnalysis:
    """
    Analyzes recent commits to determine if a task has been completed.
    """
    # Format commit messages
    commit_messages = "\n".join([
        f"- {commit['message']} (by {commit['author']} on {commit['date']})"
        for commit in commits_data
    ])

    # Format file changes
    file_changes = "\n".join([f"- {file}" for file in files_changed])

    prompt = (
        f"Task: {task_description}\n\n"
        f"Recent commits:\n{commit_messages or 'No recent commits'}\n\n"
        f"Files changed:\n{file_changes or 'No files changed'}"
    )

    result = progress_agent.run_sync(prompt)
    analysis = result.output

    # Extract relevant commit messages
    commits = [msg.strip() for msg in commit_messages.split('\n') if msg.strip()]
    analysis.relevant_commits = commits[:5]  # Top 5 most recent

    return analysis
