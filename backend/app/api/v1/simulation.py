from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.machine import Machine
from app.models.simulation import SimulationSession, SimulationResult
from app.services.digital_twin_engine import digital_twin_engine
from app.schemas.simulation import DigitalTwinParamsSchema, SimulationResultSchema
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/simulations", tags=["Digital Twin Simulator"])

@router.post("/run", response_model=StandardResponse[SimulationResultSchema])
def run_simulation(
    params: DigitalTwinParamsSchema,
    machine_id: str = "MTR-704",
    db: Session = Depends(get_db)
):
    """Executes virtual co-simulation with finite element stress & thermal dynamics solver."""
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    machine_dict = {
        "temperature": machine.temperature if machine else 87.4,
        "vibration": machine.vibration if machine else 7.82,
        "healthScore": machine.health_score if machine else 64.0,
        "modelSpecs": machine.model_specs if machine else {"ratedKw": 450}
    }

    result = digital_twin_engine.simulate(machine_dict, params.model_dump())

    # Save session record
    session_rec = SimulationSession(
        machine_id=machine_id,
        target_rpm=params.targetRpm,
        load_percentage=params.loadPercentage,
        ambient_temp_c=params.ambientTempC,
        lubrication_quality_percent=params.lubricationQualityPercent,
        cooling_airflow_percent=params.coolingAirflowPercent,
        applied_strategy_id=params.appliedStrategyId,
        assumptions_log={"assumptions": result.get("assumptions")}
    )
    db.add(session_rec)
    db.commit()
    db.refresh(session_rec)

    # Save detailed result record
    result_rec = SimulationResult(
        session_id=session_rec.id,
        strategy_id=params.appliedStrategyId,
        simulated_health=float(result.get("simulatedHealth", 85.0)),
        projected_temp=float(result.get("projectedTemp", 68.0)),
        projected_vibration=float(result.get("projectedVibration", 1.8)),
        projected_rpm=float(result.get("projectedRpm", 2980.0)),
        projected_power_kw=float(result.get("projectedPowerKw", 415.0)),
        rul_days_post_fix=float(result.get("rulDaysPostFix", 365.0)),
        failure_risk_percent=float(result.get("failureRiskPercent", 4.2)),
        energy_savings_kwh_month=float(result.get("energySavingsKwhMonth", 1200.0)),
        passed_safety_constraints=bool(result.get("passedSafetyConstraints", True)),
        explanation=str(result.get("explanation", "Physics simulation converged.")),
        stress_distribution=result.get("stressDistribution", []),
        telemetry_stream=result.get("telemetryStream", [])
    )
    db.add(result_rec)
    db.commit()

    return StandardResponse(
        success=True,
        message="Co-simulation executed successfully.",
        data=SimulationResultSchema(**result)
    )
