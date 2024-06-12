from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings


# SQL_ALCHEMY_DATABASE_URL ="postgresql://postgres:109737@localhost/postgres"
SQL_ALCHEMY_DATABASE_URL =f"{settings.database_protocol}://{settings.database_username}:{settings.database_password}@{settings.database_host}:{settings.database_port}/{settings.database_name}?{settings.database_connection_parameter}"
# use below line to connect to cocroachdb without certificate
# SQL_ALCHEMY_DATABASE_URL =f"{settings.database_protocol}://{settings.database_username}:{settings.database_password}@{settings.database_host}:{settings.database_port}/{settings.database_name}?sslmode=require"
engine = create_engine(SQL_ALCHEMY_DATABASE_URL)
sessionlocal=sessionmaker(autoflush=False,bind=engine)

Base=declarative_base()

def get_db():
    db = sessionlocal()
    try:
        yield db
    finally:
        db.close()
