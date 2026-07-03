from fastapi import APIRouter
from fastapi import Depends
from fastapi.responses import StreamingResponse

from sqlalchemy.orm import Session

from io import BytesIO
from app.core.config import CSV_FILENAME
from app.core.database import get_db
from app.services.csv_service import CSVService

router = APIRouter(
    prefix="/api/export",
    tags=["Export"],
)


@router.get("/csv")
def export_csv(
    db: Session = Depends(get_db),
):

    csv_data = CSVService.generate_csv(db)

    return StreamingResponse(
        BytesIO(csv_data.encode("utf-8")),
        media_type="text/csv",
        headers={
        "Content-Disposition":
        f"attachment; filename={CSV_FILENAME}"
        },
    )