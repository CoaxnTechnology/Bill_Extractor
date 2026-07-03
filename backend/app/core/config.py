from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Upload Directory
UPLOAD_DIR = Path("app/storage/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# File Validation
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB

ALLOWED_EXTENSIONS = {
    ".pdf",
}

ALLOWED_MIME_TYPES = {
    "application/pdf",
}

# CSV
CSV_FILENAME = "bills.csv"