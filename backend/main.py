from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine
from .routes import project, auth, github  # Add github

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Project Roadmap Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(project.router)
app.include_router(auth.router)
app.include_router(github.router)  # Add this

@app.get("/")
def read_root():
    return {"message": "Project Roadmap Generator API"}
