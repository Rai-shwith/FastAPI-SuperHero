from fastapi import FastAPI,Request
from .database import engine
from . import models
from .routers import post,user,auth,vote
from .config import settings
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# models.Base.metadata.create_all(bind=engine)

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))


app = FastAPI()
app.mount("/static",StaticFiles(directory=os.path.join(BASE_DIR,"templates/static")))

# origins: list[str] = 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root(request : Request):
    return templates.TemplateResponse("index.html",{"request":request,"message":"Welcome to my SuperHERO team!"})

app.include_router(post.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(vote.router)