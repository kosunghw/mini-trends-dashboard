from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.services.reddit_service import reddit_service

app = FastAPI(title="Mini Trends Dashboard")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
async def root():
  return {"message": "Welcome to Mini Trends Dashboard API"}

@app.get("/api/trends")
async def get_trends(subreddit: str = "popular", limit: int = 10):
  trends = reddit_service.get_trends(subreddit, limit)
  return {"trends": trends}

if __name__ == "__main__":
  uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)