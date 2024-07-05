from passlib.context import CryptContext
from fastapi import Depends
from sqlalchemy import func
from .database import get_db
from sqlalchemy.orm import session
from . import models


pwd_context = CryptContext(schemes=["bcrypt"],deprecated = "auto")


def hash(password : str):
    return pwd_context.hash(password)

def verify(plain_pwd,hashed_pwd):
    return pwd_context.verify(plain_pwd,hashed_pwd)

def add_is_liked(result:list[dict],user_liked_heros:list[int]):
    temp=[]
    for i in result:
        tempdict={
            "Post":i[0],
            "likes":i[1],
            "is_liked":False
            }
        if i[0].id in user_liked_heros:
            tempdict["is_liked"]=True
        temp.append(tempdict)
    return temp