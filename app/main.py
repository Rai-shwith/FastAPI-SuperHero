from fastapi import FastAPI
from .database import engine
from . import models
from .routers import post,user,auth,vote
from .config import settings

from fastapi.middleware.cors import CORSMiddleware

# models.Base.metadata.create_all(bind=engine)

app=FastAPI()

# origins: list[str] = 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message":"Welcome to Super Hero team"}

app.include_router(post.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(vote.router)