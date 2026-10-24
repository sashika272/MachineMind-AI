from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class SensorEvidenceSchema(BaseModel):
    sensor: str
    currentValue: str
    baselineValue: str
    deviation: str
    severity: str

class FaultSchema(BaseModel):
    id: str
    machineId: str
    machineName: str
    machineCode: str
    title: str
    severity: str
    status: str
    detectedAt: str
    affectedComponent: str
    affectedComponentName: str
    confidenceScore: float
    primaryCause: str
    summary: str
    estimatedDegradationDays: float
    sensorEvidence: List[SensorEvidenceSchema] = []
    spectralSignature: List[Dict[str, Any]] = []

class FaultInjectRequest(BaseModel):
    machine_id: str
    fault_type: str = "bearing_spall" # bearing_spall, thermal_runaway, pressure_surge, multi_anomaly
    severity: str = "critical"
