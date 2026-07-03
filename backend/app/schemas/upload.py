from pydantic import BaseModel
from datetime import date

class UploadResponse(BaseModel):
    filename: str

    original_filename: str

    path: str

    size: int

    customer_name: str | None

    invoice_number: str | None

    bill_date: date | None

    message: str