from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.schemas.sensor import SensorDriftPointSchema

class DegradationCurvePointSchema(BaseModel):
    day: int
    dateStr: str
    unmitigatedHealth: float
    mitigatedHealth: float
    threshold: float

class MaintenanceTimelineItemSchema(BaseModel):
    id: str
    date: str
    title: str
    urgency: str
    component: str
    technician: str
    status: str

class PredictiveHealthSchema(BaseModel):
    machineId: str
    currentHealth: float
    remainingUsefulLifeDays: float
    rulConfidenceInterval: Dict[str, float] # {p10, p50, p90}
    healthDegradationCurve: List[DegradationCurvePointSchema]
    maintenanceTimeline: List[MaintenanceTimelineItemSchema]
    sensorDriftForecast: List[SensorDriftPointSchema]
