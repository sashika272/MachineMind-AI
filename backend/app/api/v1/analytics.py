from fastapi import APIRouter
from app.schemas.analytics import AnalyticsFleetSummarySchema
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/analytics", tags=["Analytics & Reports"])

@router.get("/fleet-summary", response_model=StandardResponse[AnalyticsFleetSummarySchema])
def get_fleet_analytics():
    """Returns plant executive MTBF, MTTR, and financial impact metrics."""
    data = {
        "fleetHealthAvg": 83.7,
        "totalMachines": 6,
        "activeFaultsCount": 3,
        "mtbfHours": 4850.0,
        "mttrHours": 4.2,
        "unplannedDowntimeHoursMonth": 3.4,
        "avoidedDowntimeSavingsUsd": 142000.0,
        "maintenanceSpendYearUsd": 48200.0,
        "healthDistribution": {
            "optimal": 2,
            "nominal": 2,
            "warning": 2,
            "critical": 0
        },
        "faultTypeDistribution": [
            {"category": "Rolling Element Bearings", "count": 14, "percentage": 48.0},
            {"category": "Thermal Overheating / Cooling", "count": 6, "percentage": 21.0},
            {"category": "Shaft Misalignment / Balance", "count": 4, "percentage": 14.0},
            {"category": "Electrical Winding / Terminals", "count": 3, "percentage": 10.0},
            {"category": "Mechanical Seal / Pressure", "count": 2, "percentage": 7.0}
        ],
        "monthlyDowntimeTrend": [
            {"month": "May 26", "plannedHours": 12.0, "unplannedHours": 6.2, "costUsd": 18400.0},
            {"month": "Jun 26", "plannedHours": 8.5, "unplannedHours": 4.1, "costUsd": 12800.0},
            {"month": "Jul 26", "plannedHours": 16.0, "unplannedHours": 1.5, "costUsd": 9200.0},
            {"month": "Aug 26", "plannedHours": 6.0, "unplannedHours": 0.8, "costUsd": 4600.0},
            {"month": "Sep 26", "plannedHours": 10.0, "unplannedHours": 2.1, "costUsd": 8400.0},
            {"month": "Oct 26", "plannedHours": 4.0, "unplannedHours": 3.4, "costUsd": 11200.0}
        ]
    }
    return StandardResponse(success=True, data=AnalyticsFleetSummarySchema(**data))
