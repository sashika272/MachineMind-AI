from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.machine import Machine
from app.services.predictive_engine import predictive_engine
from app.schemas.predictive import PredictiveHealthSchema
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/predictive", tags=["Predictive Maintenance"])

@router.get("/rul", response_model=StandardResponse[PredictiveHealthSchema])
def get_predictive_health(machine_id: str = "MTR-704", db: Session = Depends(get_db)):
    """Computes stochastic Remaining Useful Life (RUL) with P10/P50/P90 confidence bounds."""
    m = db.query(Machine).filter(Machine.id == machine_id).first()
    machine_dict = {
        "id": m.id if m else "MTR-704",
        "healthScore": m.health_score if m else 64.0,
        "temperature": m.temperature if m else 87.4,
        "vibration": m.vibration if m else 7.82
    }
    pred = predictive_engine.estimate_rul(machine_dict)
    return StandardResponse(success=True, data=PredictiveHealthSchema(**pred))
