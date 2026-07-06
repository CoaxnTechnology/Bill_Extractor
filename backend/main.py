from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
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

class DebugCORSHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if "origin" in request.headers:
            response.headers["X-Debug-CORS-Origin"] = request.headers["origin"]
            response.headers["X-Debug-Allow-Origin"] = response.headers.get("access-control-allow-origin", "NOT_SET")
        return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    DebugCORSHeadersMiddleware,
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

