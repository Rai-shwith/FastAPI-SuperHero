from typing import List
from fastapi import Depends, status,HTTPException,APIRouter
from psycopg2 import IntegrityError
from ..database import get_db
from sqlalchemy.orm import session
from .. import schemas,models,utils
from . import oauth2

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/",response_model =List[schemas.RespondToEntryOfUser])
def  give_all_users(db:session=Depends(get_db)):
    users = db.query(models.Users).all()
    return users

# This block is used to create a new user in table users
@router.post("/",status_code=status.HTTP_201_CREATED,response_model=schemas.RespondToEntryOfUser)
def create_user(user:schemas.UserInfo,db:session= Depends(get_db)):
    user.password = utils.hash(user.password)
    try:
        new_user = models.Users(**user.model_dump())
        db.add(new_user)
        db.commit()
    except Exception as e:
        # Check if the error message contains "already exists"
        if '(psycopg2.errors.UniqueViolation)' in str(e):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Email {user.email} already exists with id = ")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")
    
    db.refresh(new_user)
    return new_user

@router.get("/id",response_model=schemas.ReturnUserId)
def get_user_id(current_user = Depends(oauth2.get_current_user)):
    user = current_user
    if user is None :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="You are not logged in")
    return user

@router.get("/{id}",response_model=schemas.RespondToEntryOfUser)
def get_user(id : int , db : session = Depends(get_db)):
    user_query = db.query(models.Users).filter(models.Users.id == id)
    user = user_query.first()
    db.commit()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"No user with {id = :}")
    return user

@router.delete("/{id}",status_code=status.HTTP_204_NO_CONTENT)
def remove_user(id : int,db:session = Depends(get_db),current_user : int = Depends(oauth2.get_current_user)):
    if current_user.id != id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You can't delete others account ")
    user = db.query(models.Users).filter(models.Users.id == id)
    user.delete()
    db.commit()

    

