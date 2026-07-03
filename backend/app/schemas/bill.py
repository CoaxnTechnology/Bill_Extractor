from datetime import date, datetime
from uuid import UUID
from typing import List
from pydantic import BaseModel, ConfigDict


class BillCreate(BaseModel):
    customer_name: str | None
    invoice_number: str | None
    bill_date: date | None
    pdf_path: str


class BillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    customer_name: str | None
    invoice_number: str | None
    bill_date: date | None
    pdf_path: str
    created_at: datetime


class BillListResponse(BaseModel):
    items: List[BillResponse]
    total: int
    page: int
    page_size: int