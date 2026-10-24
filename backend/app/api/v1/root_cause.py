from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.fault import DetectedFault, RootCauseInvestigation
from app.services.root_cause_engine import root_cause_engine
from app.services.sensor_engine import sensor_simulator
from app.schemas.root_cause import RootCauseAnalysisSchema
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/root-cause", tags=["Root Cause Analysis"])

@router.get("/{fault_id}", response_model=StandardResponse[RootCauseAnalysisSchema])
def get_root_cause(fault_id: str, db: Session = Depends(get_db)):
    """Retrieves Bayesian causal fault tree and contributing factors for a fault."""
    rca = db.query(RootCauseInvestigation).filter(RootCauseInvestigation.fault_id == fault_id).first()
    if not rca:
        # Fallback to diagnostic engine calculation
        telemetry = sensor_simulator.generate_tick()
        diag = root_cause_engine.diagnose(telemetry)
        return StandardResponse(success=True, data=RootCauseAnalysisSchema(**diag))

    return StandardResponse(
        success=True,
        data=RootCauseAnalysisSchema(
            faultId=rca.fault_id,
            machineId=rca.fault.machine_id if rca.fault else "MTR-704",
            affectedComponent=rca.fault.affected_component_type if rca.fault else "bearing_de",
            affectedComponentName=rca.fault.affected_component_name if rca.fault else "DE Bearing",
            primaryCause=rca.primary_root_cause,
            confidence=rca.confidence_percent,
            uncertaintyBand={
                "lower": rca.uncertainty_lower,
                "estimate": rca.confidence_percent,
                "upper": rca.uncertainty_upper
            },
            causalChain=rca.causal_chain or [],
            contributingFactors=rca.contributing_factors or [],
            supportingTelemetry=rca.supporting_telemetry or []
        )
    )

@router.post("/diagnose", response_model=StandardResponse[RootCauseAnalysisSchema])
def run_diagnostic(machine_id: str = "MTR-704"):
    """Triggers real-time Bayesian causal reasoning on current machine telemetry."""
    telemetry = sensor_simulator.generate_tick(machine_id=machine_id)
    diag = root_cause_engine.diagnose(telemetry)
    return StandardResponse(
        success=True,
        message="Root cause diagnostic completed.",
        data=RootCauseAnalysisSchema(**diag)
    )
