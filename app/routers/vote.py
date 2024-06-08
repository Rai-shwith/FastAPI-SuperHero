from typing import List
from fastapi import Depends, status,HTTPException,APIRouter
from psycopg2 import IntegrityError
from ..database import get_db
from sqlalchemy.orm import session
from .. import schemas,models,utils
from . import oauth2

router = APIRouter(
    prefix="/vote",
    tags=["Vote"]
)

@router.post("/",status_code=status.HTTP_200_OK)
def vote(vote_data : schemas.Vote,db : session = Depends(get_db),current_user = Depends(oauth2.get_current_user)):
    vote_query = db.query(models.Vote).filter(models.Vote.post_id == vote_data.post_id,models.Vote.user_id==current_user.id)
    found_vote = vote_query.first()
    post = db.query(models.Post).filter(models.Post.id == vote_data.post_id).first()
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"No hero with id = {vote_data.post_id}")
    if vote_data.direction:
        if found_vote:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail=f"You can't vote twice")
        new_vote = models.Vote(post_id = vote_data.post_id,user_id=current_user.id)
        db.add(new_vote)
        db.commit()
        return {"message":"You succesfully liked"}
    else:
        if not found_vote:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"You didn't like this post")
        vote_query.delete()
        db.commit()
        return {"message": "sucessfully deleted vote"}