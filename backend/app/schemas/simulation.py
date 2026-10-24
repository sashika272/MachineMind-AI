from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.schemas.sensor import TelemetryPointSchema

class DigitalTwinParamsSchema(BaseModel):
    targetRpm: float = 3000.0
    loadPercentage: float = 92.0
    ambientTempC: float = 32.0
    lubricationQualityPercent: float = 85.0
    coolingAirflowPercent: float = 100.0
    appliedStrategyId: Optional[str] = None

class StressItemSchema(BaseModel):
    component: str
    stressMpa: float
    yieldLimitMpa: float
    safetyFactor: float

class SimulationResultSchema(BaseModel):
    simulatedHealth: float
    projectedTemp: float
    projectedVibration: float
    projectedRpm: float
    projectedPowerKw: float
    stressDistribution: List[StressItemSchema]
    rulDaysPostFix: float
    failureRiskPercent: float
    energySavingsKwhPerMonth: float
    passedSafetyConstraints: bool = True
    explanation: str
    telemetryStream: List[TelemetryPointSchema]
