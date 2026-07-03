from datetime import datetime

from app.extractors.field_patterns import (
    CUSTOMER_NAME,
    INVOICE_NUMBER,
    BILL_DATE,
)


class BillParser:

    @staticmethod
    def parse(text: str) -> dict:

        customer = CUSTOMER_NAME.search(text)
        invoice = INVOICE_NUMBER.search(text)
        bill_date = BILL_DATE.search(text)

        return {
            "customer_name": (
                customer.group(1).strip()
                if customer
                else None
            ),
            "invoice_number": (
                invoice.group(1).strip()
                if invoice
                else None
            ),
            "bill_date": (
                datetime.strptime(
                    bill_date.group(1),
                    "%d.%m.%Y",
                ).date()
                if bill_date
                else None
            ),
        }