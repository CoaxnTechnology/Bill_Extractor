import re
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import DATABASE_URL

_db_url = DATABASE_URL
if _db_url and not _db_url.startswith("postgresql+psycopg://"):
    _db_url = re.sub(
        r"^postgres(ql)?(\+[^+]+)?://",
        "postgresql+psycopg://",
        _db_url,
    )

engine = create_engine(_db_url)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()