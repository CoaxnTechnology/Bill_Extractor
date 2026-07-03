import re

CUSTOMER_NAME = re.compile(
    r"ALAMAT POS\s+([A-Z\s]+)"
)

INVOICE_NUMBER = re.compile(
    r"NO\.\s*INVOIS\s+([A-Z0-9]+)"
)

BILL_DATE = re.compile(
    r"TARIKH\s*BIL\s+(\d{2}\.\d{2}\.\d{4})"
)