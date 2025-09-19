from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from .db import Base, engine
from .routes import project, auth

# Update database schema
inspector = inspect(engine)
try:
    columns = [col['name'] for col in inspector.get_columns('project')]
    if 'user_id' not in columns:
        with engine.connect() as connection:
            connection.execute(text('ALTER TABLE project ADD COLUMN user_id INTEGER REFERENCES "user"(id)'))
            connection.commit()
except Exception as e:
    print(f"Error inspecting table or adding column: {e}")

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
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Project Roadmap Generator API"}

