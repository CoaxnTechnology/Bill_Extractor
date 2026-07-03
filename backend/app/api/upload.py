from sqlalchemy.orm import Session
from typing import List
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

@router.post("/upload/multiple")
def upload_multiple(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    results = []

    for file in files:
        try:
            bill = save_upload(db, file)

            results.append({
                "filename": file.filename,
                "status": "success",
                "bill": bill,
            })

        except HTTPException as e:
            results.append({
                "filename": file.filename,
                "status": "failed",
                "error": e.detail,
            })

    return {
        "total": len(files),
        "success": sum(r["status"] == "success" for r in results),
        "failed": sum(r["status"] == "failed" for r in results),
        "results": results,
    }