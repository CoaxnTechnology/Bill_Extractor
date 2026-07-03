import fitz
from fastapi import HTTPException


class PDFExtractor:

    @staticmethod
    def extract_text(pdf_path: str):

        try:
            document = fitz.open(pdf_path)

        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Invalid or corrupted PDF.",
            )

        text = ""

        for page in document:
            text += page.get_text()

        document.close()

        return text.strip()