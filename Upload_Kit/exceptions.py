from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class QuotaExceededException(Exception):
    def __init__(self, used: int, max_images: int):
        self.used = used
        self.max_images = max_images
        super().__init__(f"Upload quota exceeded. Current: {used}/{max_images}.")


class ImageNotFoundException(Exception):
    pass


class UnauthorizedException(Exception):
    pass


class InvalidSignatureException(Exception):
    pass


def register_exception_handlers(app: FastAPI):
    @app.exception_handler(QuotaExceededException)
    async def quota_exceeded_handler(request: Request, exc: QuotaExceededException):
        return JSONResponse(
            status_code=403,
            content={
                "detail": f"Upload quota exceeded. Current: {exc.used}/{exc.max_images}. Upgrade your plan."
            },
        )

    @app.exception_handler(ImageNotFoundException)
    async def image_not_found_handler(request: Request, exc: ImageNotFoundException):
        return JSONResponse(
            status_code=404,
            content={"detail": "Image not found"},
        )

    @app.exception_handler(UnauthorizedException)
    async def unauthorized_handler(request: Request, exc: UnauthorizedException):
        return JSONResponse(
            status_code=403,
            content={"detail": str(exc) or "You do not own this image"},
        )

    @app.exception_handler(InvalidSignatureException)
    async def invalid_signature_handler(request: Request, exc: InvalidSignatureException):
        return JSONResponse(
            status_code=400,
            content={"detail": "Invalid webhook signature"},
        )
