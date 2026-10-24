from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class FaultCategoryItemSchema(BaseModel):
    category: str
    count: int
    percentage: float

class MonthlyDowntimeTrendItemSchema(BaseModel):
    month: str
    plannedHours: float
    unplannedHours: float
    costUsd: float

class AnalyticsFleetSummarySchema(BaseModel):
    fleetHealthAvg: float
    totalMachines: int
    activeFaultsCount: int
    mtbfHours: float
    mttrHours: float
    unplannedDowntimeHoursMonth: float
    avoidedDowntimeSavingsUsd: float
    maintenanceSpendYearUsd: float
    healthDistribution: Dict[str, int]
    faultTypeDistribution: List[FaultCategoryItemSchema]
    monthlyDowntimeTrend: List[MonthlyDowntimeTrendItemSchema]
