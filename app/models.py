from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, String, text,ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Post(Base):
    __tablename__ = "heros"
    id = Column(Integer,primary_key=True,nullable=False)
    name = Column(String,nullable=False)
    alias = Column(String,nullable=False)
    is_alive= Column(Boolean,nullable=False,server_default="TRUE")
    joined_on = Column(TIMESTAMP(timezone=True),nullable=False,server_default=text('now()'))
    owner_id = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),nullable=False)
    owner = relationship("Users")


class Users(Base):
    __tablename__ = "users"
    email = Column(String,nullable=False,unique=True)
    password = Column(String,nullable=False)
    id = Column(Integer,nullable=False,primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True),nullable=False,server_default=text('now()'))
    phone_number: str = Column(String,unique=True)



class Vote(Base):
    __tablename__ = "votes"
    post_id = Column(Integer,ForeignKey("heros.id",ondelete="CASCADE"),primary_key=True,nullable=False)
    user_id = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),primary_key=True,nullable=False)


