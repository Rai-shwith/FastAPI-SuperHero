from typing import List, Optional
from fastapi import Depends, status,HTTPException,APIRouter
from sqlalchemy import func
from ..database import get_db
from sqlalchemy.orm import session
from .. import schemas,models
from . import oauth2


router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

# @router.get("/",response_model=List[schemas.SendPost])
@router.get("/",response_model=List[schemas.PostOut])
# @router.get("/")
def get_all(db:session=Depends(get_db),limit:int =10,skip:int = 0,search : Optional[str]=""):
    # heros = db.query(models.Post).filter(models.Post.alias.contains(search)).limit(limit).offset(skip).all()
    results = db.query(models.Post,func.count(models.Vote.post_id).label("likes")).filter(models.Post.alias.contains(search)).join(models.Vote,models.Vote.post_id == models.Post.id,isouter=True).group_by(models.Post.id).limit(limit).offset(skip).all()
    # data = [{"post":{**post.__dict__}, "likes": int(value)} for post, value in results]
    return results



@router.post("/",status_code=status.HTTP_201_CREATED,response_model=schemas.SendPost)
def post_hero(post:schemas.CreatePost,db :session=Depends(get_db),current_user : int = Depends(oauth2.get_current_user)):
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Please Log in to build a team")
    new_hero = models.Post(**post.model_dump())
    new_hero.owner_id = current_user.id
    db.add(new_hero)
    db.commit()
    db.refresh(new_hero)
    # return {"message": f"{post.alias} is added to the Team "}
    return new_hero
    

@router.get("/{id}",response_model=schemas.PostOut)
def get_a_hero(id:int,db:session=Depends(get_db),current_user : int = Depends(oauth2.get_current_user)):
    # hero = db.query(models.Post).filter(models.Post.id == id).first()
    hero = db.query(models.Post,func.count(models.Vote.user_id).label("likes")).filter(models.Post.id == id).join(models.Vote,models.Vote.post_id == models.Post.id,isouter = True).group_by(models.Post.id).first()
    # hero = db.query(models.Post,func.count(models.Vote.post_id).label("likes")).filter(models.Post.alias.contains(search)).join(models.Vote,models.Vote.post_id == models.Post.id,isouter=True).group_by(models.Post.id).limit(limit).offset(skip).all()

    if hero:
        return hero
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"No such Hero with {id = :}")
    

@router.get('/get-name/{hero}',response_model=schemas.SendName)
def get_name_from_hero(hero:str, db : session = Depends(get_db)):
    # cursor.execute("SELECT name from heros   WHERE  alias = %s",(hero,))
    # name = cursor.fetchone()
    name = db.query(models.Post).filter(models.Post.alias == hero).first()
    if name is None :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"No Hero named {hero} in your team")
    return name

@router.delete("/{id}",status_code=status.HTTP_204_NO_CONTENT)
def remove_a_hero(id:int,db:session=Depends(get_db),current_user : int = Depends(oauth2.get_current_user)):
    hero = db.query(models.Post).filter(models.Post.id == id)
    owner_id = hero.first().owner_id
    if not hero.first() :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"No Hero with {id = :}")
    elif current_user.id != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You can't remove heros from other\'s team")
    hero.delete()
    db.commit()

@router.put("/{id}",response_model=schemas.SendPost)
def update_hero(id:int,post:schemas.CreatePost,db : session = Depends(get_db),current_user = Depends(oauth2.get_current_user)):
    hero_query = db.query(models.Post).filter(models.Post.id == id)
    hero = hero_query.first()
    owner_id = hero.owner_id
    if not hero:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"No Hero with {id = :}")
    elif current_user.id != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You can't update heros from other\'s team")

    hero_query.update(post.model_dump(),synchronize_session = False)
    return hero_query.first()
