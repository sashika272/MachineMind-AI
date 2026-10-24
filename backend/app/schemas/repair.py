from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class RepairStepSchema(BaseModel):
    stepNumber: int
    title: str
    description: str
    estimatedMinutes: int
    toolsRequired: List[str]
    safetyCheck: str

class RequiredPartSchema(BaseModel):
    partNo: str
    name: str
    inStock: bool
    leadTimeDays: int
    costUsd: float

class RepairStrategySchema(BaseModel):
    id: str
    faultId: str
    title: str
    tier: str # conservative, balanced, aggressive, temporary
    description: str
    estimatedCost: float
    recoveryTimeHours: float
    downtimeHours: float
    safetyRequirements: List[str]
    lotoRequired: bool
    requiredParts: List[RequiredPartSchema]
    procedure: List[RepairStepSchema]
    expectedOutcome: Dict[str, float]
    efficiencyImpactPercent: float
    recommendationScore: float
    isRecommended: bool
    tradeoffs: Dict[str, List[str]]
