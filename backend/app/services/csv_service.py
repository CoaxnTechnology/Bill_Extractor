import csv
from io import StringIO
from app.core.logger import logger
from sqlalchemy.orm import Session

from app.models.bill import Bill


class CSVService:

    @staticmethod
    def generate_csv(db: Session) -> str:

        bills = (
            db.query(Bill)
            .order_by(Bill.created_at.desc())
            .all()
        )
        
        output = StringIO()
        logger.info("Generating CSV export")
        writer = csv.writer(output)

        writer.writerow([
            "Customer Name",
            "Invoice Number",
            "Bill Date",
        ])

        for bill in bills:
            writer.writerow([
                bill.customer_name,
                bill.invoice_number,
                bill.bill_date,
            ])

        output.seek(0)
        logger.info(f"CSV generated with {len(bills)} records")
        return output.getvalue()