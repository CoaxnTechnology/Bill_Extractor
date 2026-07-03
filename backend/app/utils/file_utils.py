import uuid
from pathlib import Path
from fastapi import HTTPException, UploadFile

from app.core.config import (
    ALLOWED_EXTENSIONS,
    ALLOWED_MIME_TYPES,
    MAX_FILE_SIZE,
)


def validate_file(file: UploadFile):

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid PDF content type.",
        )

    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)

    if size == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    if size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File exceeds 20 MB limit.",
        )

    return extension


def generate_filename(extension: str):
    return f"{uuid.uuid4()}{extension}"