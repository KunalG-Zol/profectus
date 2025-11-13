from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, project, github
from .db import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Configuration - ADD THIS
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative React dev server
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(auth.router)
app.include_router(project.router)
app.include_router(github.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Profectus API"}
    