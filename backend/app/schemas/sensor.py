from typing import Optional
from pydantic import BaseModel

class TelemetryPointSchema(BaseModel):
    timestamp: int
    timeStr: str
    temperature: float
    vibration: float
    pressure: float
    rpm: float
    powerKw: float
    acousticDb: float
    anomalyScore: float
    isSimulated: bool = True

class VibrationSpectrumPointSchema(BaseModel):
    frequency: float
    amplitude: float
    threshold: float
    label: Optional[str] = None

class SensorDriftPointSchema(BaseModel):
    sensor: str
    unit: str
    current: float
    oneWeekProjected: float
    oneMonthProjected: float
    driftStatus: str
