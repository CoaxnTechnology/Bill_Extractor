from pathlib import Path
import shutil

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.logger import logger
from app.extractors.parser import BillParser
from app.extractors.pdf_extractor import PDFExtractor
from app.schemas.bill import BillCreate
from app.services.bill_service import BillService
from app.utils.file_utils import (
    generate_filename,
    validate_file,
)
from app.core.config import UPLOAD_DIR

def save_upload(
    db: Session,
    file: UploadFile,
):
    logger.info(f"Upload started: {file.filename}")

    extension = validate_file(file)

    filename = generate_filename(extension)

    destination = UPLOAD_DIR / filename

    try:
        # Save uploaded file
        with destination.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f"File saved: {destination}")

        # Extract text
        extracted_text = PDFExtractor.extract_text(
            str(destination)
        )

        logger.info("PDF text extracted successfully")

        # Parse bill fields
        parsed_data = BillParser.parse(extracted_text)

        logger.info(
            f"Invoice parsed: {parsed_data.get('invoice_number')}"
        )

        # Save to database
        bill = BillService.create_bill(
            db,
            BillCreate(
                customer_name=parsed_data["customer_name"],
                invoice_number=parsed_data["invoice_number"],
                bill_date=parsed_data["bill_date"],
                pdf_path=str(destination),
            ),
        )

        logger.info(
            f"Bill saved successfully: {bill.id}"
        )

        return bill

    except HTTPException:
        raise

    except Exception as e:
        logger.exception("Upload failed")

        if destination.exists():
            destination.unlink()
            logger.info(
                f"Cleanup completed: {destination}"
            )

        raise HTTPException(
            status_code=500,
            detail="Failed to process uploaded PDF.",
        )