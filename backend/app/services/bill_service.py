from pathlib import Path
from uuid import UUID
from app.core.logger import logger
from sqlalchemy.orm import Session
from datetime import date
from sqlalchemy import or_, asc, desc
from app.models.bill import Bill
from app.schemas.bill import BillCreate


class BillService:

    @staticmethod
    def create_bill(db: Session, data: BillCreate):

        bill = Bill(
            customer_name=data.customer_name,
            invoice_number=data.invoice_number,
            bill_date=data.bill_date,
            pdf_path=data.pdf_path,
        )

        db.add(bill)
        db.commit()
        logger.info(f"Created bill: {bill.invoice_number}")
        db.refresh(bill)

        return bill

    @staticmethod
    def get_all_bills(
        db: Session,
        search: str | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
        page: int = 1,
        page_size: int = 10,
        sort: str = "created_at",
        order: str = "desc",
    ):

        query = db.query(Bill)

        if search:
            query = query.filter(
                or_(
                    Bill.customer_name.ilike(f"%{search}%"),
                    Bill.invoice_number.ilike(f"%{search}%"),
                )
            )

        if start_date:
            query = query.filter(
                Bill.bill_date >= start_date
            )

        if end_date:
            query = query.filter(
                Bill.bill_date <= end_date
            )

        sort_column = getattr(
            Bill,
            sort,
            Bill.created_at,
        )

        if order == "asc":
            query = query.order_by(
                asc(sort_column)
            )
        else:
            query = query.order_by(
                desc(sort_column)
            )

        total = query.count()

        bills = (
            query
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return {
            "items": bills,
            "total": total,
            "page": page,
            "page_size": page_size,
        }
    @staticmethod
    def delete_bill(
        db: Session,
        bill: Bill,
    ):
        pdf_path = Path(bill.pdf_path)

        if pdf_path.exists():
            pdf_path.unlink()
            logger.info(f"Deleted PDF: {pdf_path}")

        logger.info(f"Deleting bill: {bill.invoice_number}")

        db.delete(bill)
        db.commit()

        logger.info("Bill deleted successfully")
        
    @staticmethod
    def invoice_exists(
        db: Session,
        invoice_number: str | None,
    ) -> bool:

        if not invoice_number:
            return False

        return (
            db.query(Bill)
            .filter(Bill.invoice_number == invoice_number)
            .first()
            is not None
        )
    
    @staticmethod
    def get_bill(
        db: Session,
        bill_id: UUID,
    ) -> Bill | None:

        return (
            db.query(Bill)
            .filter(Bill.id == bill_id)
            .first()
        )