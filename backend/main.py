from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from shared.config import CORS_ORIGINS, API_PREFIX
from shared.database import connect_to_mongo, close_mongo_connection
from shared.dependencies import init_firebase
from shared.exceptions import register_exception_handlers
from modules.auth.api import router as auth_router
from modules.uploads.api import router as uploads_router
from modules.payments.api import router as payments_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_firebase()
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="ImageTier API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
origins = [origin.strip() for origin in CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handlers
register_exception_handlers(app)

# Include routers
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(uploads_router, prefix=API_PREFIX)
app.include_router(payments_router, prefix=API_PREFIX)


@app.get("/health")
async def health_check():
    from shared.database import get_db
    db_status = "connected"
    try:
        db = get_db()
        if db is None:
            db_status = "not connected"
        else:
            await db.command("ping")
    except Exception:
        db_status = "error"
    return {"status": "healthy", "db": db_status, "version": "1.0.0"}
