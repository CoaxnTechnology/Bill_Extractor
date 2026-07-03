from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from datetime import date
from fastapi import Query
from app.schemas.bill import BillListResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.bill import BillResponse
from app.services.bill_service import BillService

router = APIRouter(
    prefix="/api/bills",
    tags=["Bills"],
)


@router.get(
    "",
    response_model=BillListResponse,
)
def get_bills(
    db: Session = Depends(get_db),
):

    return BillService.get_all_bills(db)


@router.get(
    "",
    response_model=BillListResponse,
)
def get_bills(
    search: str | None = None,
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort: str = Query("created_at"),
    order: str = Query("desc"),
    db: Session = Depends(get_db),
):

    return BillService.get_all_bills(
        db=db,
        search=search,
        start_date=start_date,
        end_date=end_date,
        page=page,
        page_size=page_size,
        sort=sort,
        order=order,
    )

@router.delete("/{bill_id}")
def delete_bill(
    bill_id: UUID,
    db: Session = Depends(get_db),
):

    bill = BillService.get_bill(
    db,
    bill_id,
    )

    if bill is None:
        raise HTTPException(
            status_code=404,
            detail="Bill not found",
        )

    BillService.delete_bill(
        db,
        bill,
    )

    return {
        "message": "Bill deleted successfully"
    }