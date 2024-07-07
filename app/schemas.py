from datetime import datetime
from typing import Optional,Union
from pydantic import BaseModel, EmailStr, conint


class BasePost(BaseModel):
    name:str
    alias:str

class CreatePost(BasePost):
    pass 

#  This is responce model for userenterd
class RespondToEntryOfUser(BaseModel):
    user_name : str
    email : EmailStr
    id : int
    created_at : datetime

class SendPost(BaseModel):
    id : Union[str,int]
    name : str
    alias : str
    owner_id : Union[str,int]
    owner : RespondToEntryOfUser
    # current_user : EmailStr
    # joined_on : datetime
    class Config:
        from_attributes = True

# This model will act as response model after adding likes attribute
class PostOut(BaseModel):
    Post : SendPost
    likes : int
    is_liked : bool
    class Config:
        from_attributes = True

class SendName(BaseModel):
    name:str

    class Config:
        from_attributes = True

# class SendAllPost(BaseModel):
#     heros : list[SendPost]

# This class is to validate user credentials while receiving
class UserInfo(BaseModel):
    user_name : str
    email : EmailStr
    password : str



class UserLogin(BaseModel):
    email : EmailStr
    password : str

class Token(BaseModel):
    acess_token : str
    token_type : str

class TokenData(BaseModel):
    id : Optional[int] = None

class ReturnUserId(BaseModel):
    id : str
    
class Vote(BaseModel):
    post_id : int 
    direction : bool