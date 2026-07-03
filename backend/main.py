from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.logger import logger
from app.api.upload import router as upload_router
from app.api.health import router as health_router
from app.api.bills import router as bills_router
from app.api.export import router as export_router
from app.core.exceptions import register_exception_handlers

app = FastAPI(
    title="Bill Extractor API",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Bill Extractor API started")
app.include_router(health_router)
app.include_router(upload_router)
app.include_router(bills_router)
app.include_router(export_router)
register_exception_handlers(app)
@app.get("/")
def root():
    return {
        "message": "Bill Extractor API"
    }

