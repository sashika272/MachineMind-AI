from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class CausalNodeSchema(BaseModel):
    id: str
    label: str
    type: str # root, mechanism, symptom
    probability: float
    evidence: str
    severity: str
    children: Optional[List[str]] = None

class ContributingFactorSchema(BaseModel):
    factor: str
    weight: float
    impact: str

class SupportingTelemetrySchema(BaseModel):
    metric: str
    description: str
    zScore: float

class RootCauseAnalysisSchema(BaseModel):
    faultId: str
    machineId: str
    affectedComponent: str
    affectedComponentName: str
    primaryCause: str
    confidence: float
    uncertaintyBand: Dict[str, float] # {lower, estimate, upper}
    causalChain: List[CausalNodeSchema]
    contributingFactors: List[ContributingFactorSchema]
    supportingTelemetry: List[SupportingTelemetrySchema]
