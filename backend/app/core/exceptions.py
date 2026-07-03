from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.logger import logger


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        request: Request,
        exc: HTTPException,
    ):

        logger.warning(
            f"{request.method} {request.url.path} -> {exc.detail}"
        )

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail,
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):

        logger.warning(
            f"Validation Error: {exc.errors()}"
        )

        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "message": "Validation Error",
                "errors": exc.errors(),
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(
        request: Request,
        exc: Exception,
    ):

        logger.exception(
            f"Unhandled Exception: {request.url.path}"
        )

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal Server Error",
            },
        )