from fastapi import APIRouter,Depends,HTTPException,Response,status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import schemas,models,utils
from ..database import get_db
from . import oauth2



router = APIRouter(
    tags=["Authentication"]
)

@router.post("/login",response_model=schemas.Token)
def login(user_credentials : OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
# def login(user_credentials : schemas.UserLogin,db: Session = Depends(get_db)):
# in oauth2password  there are only 2 fields username and pass word so instesd  of .email now i use .username
    user = db.query(models.Users).filter(models.Users.email == user_credentials.username).first()
    if user is None:
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN,detail = f"Invalid Credentials ")
    if not utils.verify(user_credentials.password,user.password):
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN,detail = f"Invalid Credentials")
    acess_token = oauth2.create_acess_tokens(data={"user_id": user.id})

    return {"acess_token":acess_token, "token_type":"bearer"}