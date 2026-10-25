import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure backend root is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine, Base
from app.seed.demo_data import seed_database
from app.services.ml_engine import ml_engine

# Import routers
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.machines import router as machines_router
from app.api.v1.sensors import router as sensors_router
from app.api.v1.faults import router as faults_router
from app.api.v1.root_cause import router as root_cause_router
from app.api.v1.repair import router as repair_router
from app.api.v1.simulation import router as simulation_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.predictive import router as predictive_router
from app.api.v1.history import router as history_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.reports import router as reports_router
from app.api.v1.websockets import router as websockets_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes database schema, seeds demo records, and warms up ML models."""
    print("[MachineMind AI] Starting backend services...")
    # Initialize DB & Seed Demo Data
    seed_database()
    # Initialize / warm up ML Engine
    ml_engine.load_or_train_models()
    print("[MachineMind AI] Backend engine initialized and ready.")
    yield
    print("[MachineMind AI] Shutting down backend services...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous Industrial Predictive Maintenance, Bayesian Root Cause & Digital Twin Intelligence Platform",
    lifespan=lifespan,
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Middleware
origins = list(settings.cors_origins_list)
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://machinemind-ai.vercel.app",
    "https://machine-mind-ai.vercel.app",
]
for o in default_origins:
    if o not in origins:
        origins.append(o)

# If wildcard was passed, filter it out from explicit list since allow_credentials is True
clean_origins = [o for o in origins if o != "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=clean_origins,
    allow_origin_regex=r"^https?://([a-zA-Z0-9_\-]+\.)?(vercel\.app|localhost|127\.0\.0\.1|onrender\.com)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from starlette.exceptions import HTTPException as StarletteHTTPException

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=getattr(exc, "headers", None)
    )

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Internal server processing error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred."
        }
    )

# Health endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "mlModelStatus": "calibrated",
        "sensorEngineStatus": "online"
    }

# Mount v1 routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(machines_router, prefix=settings.API_V1_STR)
app.include_router(sensors_router, prefix=settings.API_V1_STR)
app.include_router(faults_router, prefix=settings.API_V1_STR)
app.include_router(root_cause_router, prefix=settings.API_V1_STR)
app.include_router(repair_router, prefix=settings.API_V1_STR)
app.include_router(simulation_router, prefix=settings.API_V1_STR)
app.include_router(recommendations_router, prefix=settings.API_V1_STR)
app.include_router(predictive_router, prefix=settings.API_V1_STR)
app.include_router(history_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(websockets_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
