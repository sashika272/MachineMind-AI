from typing import Optional
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.maintenance import MaintenanceRecord
from app.models.fault import DetectedFault
from app.models.machine import Machine
from app.models.audit import AuditLog
from app.services.repair_engine import repair_engine
from app.services.digital_twin_engine import digital_twin_engine
from app.services.recommendation_engine import recommendation_engine
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/evaluate", response_model=StandardResponse[dict])
def evaluate_recommendations(fault_id: str = "FLT-2026-891", machine_id: str = "MTR-704"):
    """Performs multi-attribute ranking against safety, cost, downtime, and performance."""
    strategies = repair_engine.generate_strategies({"faultId": fault_id})
    
    # Pre-simulate outcomes for each strategy
    base_machine = {"temperature": 87.4, "vibration": 7.82, "healthScore": 64.0, "modelSpecs": {"ratedKw": 450}}
    sim_outcomes = {}
    for s in strategies:
        sim = digital_twin_engine.simulate(base_machine, {"appliedStrategyId": s["id"]})
        sim_outcomes[s["id"]] = sim

    ranking_result = recommendation_engine.rank_strategies(strategies, sim_outcomes)
    return StandardResponse(
        success=True,
        data=ranking_result
    )

@router.post("/commit", response_model=StandardResponse[dict])
def commit_recommendation(payload: dict, db: Session = Depends(get_db)):
    """Approves an AI-recommended repair strategy and records it as an official maintenance work order."""
    machine_id = payload.get("machine_id", "MTR-704")
    strategy_id = payload.get("strategy_id", "strat-1")
    technician = payload.get("technician", "Dr. Elena Vance")
    
    strategies = repair_engine.generate_strategies({"faultId": "FLT-2026-891"})
    strat = next((s for s in strategies if s["id"] == strategy_id), strategies[0])
    
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    rec_id = f"WO-2026-{uuid.uuid4().hex[:4].upper()}"

    # Insert Maintenance Record into DB
    maint_record = MaintenanceRecord(
        id=rec_id,
        machine_id=machine_id,
        date_str=now_str,
        title=f"Work Order: {strat['title']}",
        type="maintenance",
        severity="medium",
        technician=technician,
        duration_hours=float(strat.get("recoveryTimeHours", strat.get("downtimeHours", 4.0))),
        cost_usd=float(strat.get("estimatedCost", 1850.0)),
        resolution=strat.get("description", "Approved AI repair procedure scheduled."),
        parts_replaced=strat.get("requiredParts", ["SKF 6326 M/C3 Bearing", "Synthetic Polyalphaolefin (PAO) Grease"])
    )
    db.add(maint_record)

    # Update machine status to reflect scheduled maintenance
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if machine:
        machine.status = "maintenance"
        machine.health_score = 75.0

    # Mark active fault on this machine as scheduled / mitigating
    fault = db.query(DetectedFault).filter(DetectedFault.machine_id == machine_id).first()
    if fault:
        fault.status = "mitigating"

    # Add audit log
    audit = AuditLog(
        action="strategy_committed",
        resource_type="machine",
        resource_id=machine_id,
        details={"work_order_id": rec_id, "strategy_id": strategy_id, "cost": maint_record.cost_usd}
    )
    db.add(audit)
    db.commit()

    return StandardResponse(
        success=True,
        message=f"Strategy '{strat['title']}' approved and scheduled as Work Order {rec_id}.",
        data={
            "workOrderId": rec_id,
            "machineId": machine_id,
            "strategyId": strategy_id,
            "title": maint_record.title,
            "technician": technician,
            "costUsd": maint_record.cost_usd,
            "durationHours": maint_record.duration_hours,
            "date": now_str
        }
    )

