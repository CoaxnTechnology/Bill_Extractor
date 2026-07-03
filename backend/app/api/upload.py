from sqlalchemy.orm import Session

from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    HTTPException,
)
from app.core.logger import logger
from app.core.database import get_db
from app.schemas.bill import BillResponse
from app.services.upload_service import save_upload

router = APIRouter(
    prefix="/api",
    tags=["Upload"],
)


@router.post(
    "/upload",
    response_model=BillResponse,
)
def upload(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    return save_upload(db, file)