from typing import List, Dict, Any
from pydantic import BaseModel, Field
import dspy
import os


class CommitAnalysis(BaseModel):
    task_completed: bool = Field(description="Whether the task appears to be completed based on commits")
    confidence: float = Field(description="Confidence level (0-1) that the task is complete")
    reasoning: str = Field(description="Explanation of why the task is or isn't complete")
    relevant_commits: List[str] = Field(description="List of relevant commit messages")


class ProgressCheckSignature(dspy.Signature):
    task_description: str = dspy.InputField(desc="Description of the task to check")
    commit_messages: str = dspy.InputField(desc="Recent commit messages from the repository")
    file_changes: str = dspy.InputField(desc="Summary of files changed in recent commits")
    task_completed: bool = dspy.OutputField(desc="Whether the task is completed")
    confidence: float = dspy.OutputField(desc="Confidence level (0-1)")
    reasoning: str = dspy.OutputField(desc="Explanation for the decision")


class ProgressCheckerAgent(dspy.Module):
    def __init__(self):
        super().__init__()
        self.check_progress = dspy.ChainOfThought(ProgressCheckSignature)

    def forward(self, task_description: str, commit_messages: str, file_changes: str) -> CommitAnalysis:
        prediction = self.check_progress(
            task_description=task_description,
            commit_messages=commit_messages,
            file_changes=file_changes
        )

        # Extract relevant commit messages
        commits = [msg.strip() for msg in commit_messages.split('\n') if msg.strip()]

        return CommitAnalysis(
            task_completed=prediction.task_completed,
            confidence=float(prediction.confidence) if isinstance(prediction.confidence, (int, float)) else 0.5,
            reasoning=prediction.reasoning,
            relevant_commits=commits[:5]  # Top 5 most recent
        )


llm = dspy.LM("gemini/gemini-2.5-pro", api_key=os.environ.get("GEMINI_API_KEY"))
dspy.settings.configure(lm=llm)


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

    agent = ProgressCheckerAgent()
    return agent.forward(
        task_description=task_description,
        commit_messages=commit_messages or "No recent commits",
        file_changes=file_changes or "No files changed"
    )
