from typing import List
from fastapi import Depends, status,HTTPException,APIRouter,Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import func
from ..database import get_db
from sqlalchemy.orm import session
from .. import schemas,models,utils
from . import oauth2
from sqlalchemy.exc import IntegrityError
from psycopg2.errors import UniqueViolation

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

templates = Jinja2Templates(directory="app/templates/")
# router.mount("/signup",StaticFiles(directory="app\\templates\signup",html=True),name="signup")

@router.get("/", response_model =List[schemas.RespondToEntryOfUser])
def  give_all_users(request: Request,db:session=Depends(get_db)):
    users = db.query(models.Users).all()
    return templates.TemplateResponse('getallusers/index.html',{"request":request,"users":users})
    # return users

# This block is used to create a new user in table users
@router.post("/api/token",status_code=status.HTTP_201_CREATED,response_model=schemas.RespondToEntryOfUser)
def create_user(user:schemas.UserInfo,db:session= Depends(get_db)):
    user.password = utils.hash(user.password)
    # try:
    #     new_user = models.Users(**user.model_dump())
    #     db.add(new_user)
    #     db.commit()
    # except Exception as e:
    #     # Check if the error message contains "already exists"
    #     if '(psycopg2.errors.UniqueViolation)' in str(e):
    #         raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Email {user.email} already exists")
    #     else:
    #         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")
        
    try:
        new_user = models.Users(**user.model_dump())
        db.add(new_user)
        db.commit()
    except (IntegrityError, UniqueViolation) as e:
        # Check if the error message contains "already exists" for email or phone number
        if 'duplicate key value violates unique constraint' in str(e).lower():
            # if "uq_phone_number" in str(e):
            #     raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Phone number {user.phone_number} already exists")
            if 'users_email_key' in str(e).lower():
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Email {user.email} already exists")
            else:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unique constraint violation")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")
    # except Exception as e:
    #     print("eee",e)
        
    db.refresh(new_user)
    return new_user

@router.get("/id",response_model=schemas.ReturnUserId)
def get_user_id(current_user = Depends(oauth2.get_current_user)):
    user = current_user
    user = str(user.id) #js cannot handle long integers so iam converting it to int 
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

    
# This code is to give the heros for specific users
@router.get("/posts/{id}",response_model=List[schemas.PostOut])
def get_users_heros(request:Request,id:int,db :session = Depends(get_db)):
    user_heros = db.query(models.Post,func.count(models.Vote.post_id).label("likes")).filter(models.Post.owner_id == id).join(models.Vote,models.Vote.post_id == models.Post.id,isouter=True).group_by(models.Post.id).all()
    return templates.TemplateResponse("getuserheros/index.html",{"request":request,"hero_pack": user_heros})

