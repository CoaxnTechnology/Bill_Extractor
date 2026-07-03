from fastapi import FastAPI
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

