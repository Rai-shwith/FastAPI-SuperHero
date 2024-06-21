from datetime import datetime, timedelta
from fastapi import Depends,HTTPException,status
from jose import JWTError,jwt
from .. import schemas, database,models
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import session
from ..config import settings

oauth_schema = OAuth2PasswordBearer(tokenUrl='login')

SECRETE_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACESS_TOKEN_EXPIRE_TIME = settings.acess_token_expire_time


def create_acess_tokens(data:dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACESS_TOKEN_EXPIRE_TIME)
    to_encode.update({"exp":expire})
    encoded_jwt = jwt.encode(to_encode,SECRETE_KEY,algorithm=ALGORITHM,)
    return encoded_jwt

def verify_acess_tokens(token:str,credential_exceptions):
    try:
        payload = jwt.decode(token,SECRETE_KEY,algorithms=[ALGORITHM])
        id = payload.get("user_id")
        if id is None:
            raise credential_exceptions
        token_data = schemas.TokenData(id=id)
    except JWTError:
        raise credential_exceptions
    return token_data
    
def  get_current_user(token:str = Depends(oauth_schema),db: session = Depends(database.get_db) ):
    credential_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail=f"Could not Validate credentials",headers={"WWW-Authentication":"Bearer"})
    token = verify_acess_tokens(token=token,credential_exceptions=credential_exception)
    user = db.query(models.Users).filter(models.Users.id == token.id).first()
    return user
