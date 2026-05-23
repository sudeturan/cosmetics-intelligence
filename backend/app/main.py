import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.app.utils.recommender import get_recommender
from backend.app.api.assistant import router as assistant_router
from backend.app.api.dashboard import router as dashboard_router

# Use lifespans to load dataset and initialize recommendation engine
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[INFO] Starting FastAPI server...")
    try:
        # Pre-initialize recommender
        get_recommender()
        print("[INFO] Cosmetic Recommender initialized successfully on startup.")
    except Exception as e:
        print(f"[ERROR] Failed to load recommender on startup: {e}")
    yield
    print("[INFO] Stopping FastAPI server...")

app = FastAPI(
    title="Cosmetics Intelligence API",
    description="Backend API powering the B2C Beauty Assistant and B2B Brand Management Dashboard.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration to allow local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual frontend origins (e.g. http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(assistant_router)
app.include_router(dashboard_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the Cosmetics Intelligence API. Head to /docs for interactive documentation.",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    # Get port and host from environment variables or use default
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("backend.app.main:app", host=host, port=port, reload=True)
