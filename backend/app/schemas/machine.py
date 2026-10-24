from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class ComponentSchema(BaseModel):
    id: str
    name: str
    type: str
    status: str
    healthScore: float
    temperature: float
    vibration: float
    failureProbability: float
    description: Optional[str] = None
    position3d: List[float] = [0, 0, 0]
    recommendation: Optional[str] = None
    inspectedDate: Optional[str] = None

class MachineSchema(BaseModel):
    id: str
    code: str
    name: str
    type: str
    location: str
    facility: str
    status: str
    healthScore: float
    runningHours: float
    rpm: float
    temperature: float
    vibration: float
    pressure: float
    powerKw: float
    powerFactor: float
    efficiencyPercent: float
    noiseDb: float
    lastMaintenance: Optional[str] = None
    nextScheduledService: Optional[str] = None
    modelSpecs: Dict[str, Any] = {}
    components: List[ComponentSchema] = []

    class Config:
        from_attributes = True
