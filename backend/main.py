from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine
from .routes import project

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Project Roadmap Generator")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(project.router)

@app.get("/")
def read_root():
    return {"message": "Project Roadmap Generator API"}

