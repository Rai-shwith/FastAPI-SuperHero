import os
from fastapi import FastAPI,Request
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from .database import engine
from . import models
from .routers import post,user,auth,vote
from .config import settings
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.mount("/static",StaticFiles(directory="app/templates/static"))
app.mount("/signup",StaticFiles(directory="app/templates/signup",html=True),name="signup")
app.mount("/login",StaticFiles(directory="app/templates/login",html=True),name="login")
app.mount("/addhero",StaticFiles(directory="app/templates/addhero",html=True),name="addhero")


templates = Jinja2Templates(directory="app/templates")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root(request : Request):
    return templates.TemplateResponse("index.html",{"request":request})

@app.get("/favicon.ico")
def set_fevicon():
    return FileResponse("app/templates/static/images/favicon.ico",media_type="image/x-icon")

app.include_router(post.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(vote.router)