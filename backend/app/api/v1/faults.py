from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.fault import DetectedFault
from app.models.machine import Machine
from app.services.sensor_engine import sensor_simulator
from app.schemas.fault import FaultSchema, FaultInjectRequest, SensorEvidenceSchema
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/faults", tags=["Faults & Diagnostics"])

@router.get("", response_model=StandardResponse[List[FaultSchema]])
def list_faults(db: Session = Depends(get_db)):
    """Lists all active and historical detected faults."""
    faults = db.query(DetectedFault).all()
    results = []
    for f in faults:
        evidence = [SensorEvidenceSchema(**e) for e in (f.sensor_evidence or [])]
        results.append(
            FaultSchema(
                id=f.id,
                machineId=f.machine_id,
                machineName=f.machine.name if f.machine else "Asset",
                machineCode=f.machine.code if f.machine else "MTR-000",
                title=f.title,
                severity=f.severity or "medium",
                status=f.status or "active",
                detectedAt=f.detected_at_str,
                affectedComponent=f.affected_component_type,
                affectedComponentName=f.affected_component_name,
                confidenceScore=f.confidence_score or 90.0,
                primaryCause=f.primary_cause,
                summary=f.summary,
                estimatedDegradationDays=f.estimated_degradation_days or 7.0,
                sensorEvidence=evidence,
                spectralSignature=f.spectral_signature or []
            )
        )
    return StandardResponse(success=True, data=results)

@router.get("/{fault_id}", response_model=StandardResponse[FaultSchema])
def get_fault(fault_id: str, db: Session = Depends(get_db)):
    """Retrieves specific fault with empirical evidence and spectral signature."""
    f = db.query(DetectedFault).filter(DetectedFault.id == fault_id).first()
    if not f:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Fault '{fault_id}' not found.")

    evidence = [SensorEvidenceSchema(**e) for e in (f.sensor_evidence or [])]
    return StandardResponse(
        success=True,
        data=FaultSchema(
            id=f.id,
            machineId=f.machine_id,
            machineName=f.machine.name if f.machine else "Asset",
            machineCode=f.machine.code if f.machine else "MTR-000",
            title=f.title,
            severity=f.severity or "medium",
            status=f.status or "active",
            detectedAt=f.detected_at_str,
            affectedComponent=f.affected_component_type,
            affectedComponentName=f.affected_component_name,
            confidenceScore=f.confidence_score or 90.0,
            primaryCause=f.primary_cause,
            summary=f.summary,
            estimatedDegradationDays=f.estimated_degradation_days or 7.0,
            sensorEvidence=evidence,
            spectralSignature=f.spectral_signature or []
        )
    )

@router.post("/inject", response_model=StandardResponse[FaultSchema])
def inject_fault(req: FaultInjectRequest, db: Session = Depends(get_db)):
    """Injects simulated fault condition into the machine telemetry stream."""
    machine = db.query(Machine).filter(Machine.id == req.machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    sensor_simulator.set_scenario(req.machine_id, req.fault_type)

    # Update machine status in DB
    machine.status = req.severity
    machine.health_score = 38.0 if req.severity == "critical" else 55.0
    machine.temperature = 98.4
    machine.vibration = 12.8
    db.commit()

    fault = db.query(DetectedFault).filter(DetectedFault.machine_id == req.machine_id).first()
    if fault:
        fault.severity = req.severity
        fault.status = "active"
        db.commit()
        db.refresh(fault)
        
        evidence = [SensorEvidenceSchema(**e) for e in (fault.sensor_evidence or [])]
        return StandardResponse(
            success=True,
            message="Fault injected successfully.",
            data=FaultSchema(
                id=fault.id,
                machineId=fault.machine_id,
                machineName=machine.name,
                machineCode=machine.code,
                title=fault.title,
                severity=fault.severity,
                status=fault.status,
                detectedAt=fault.detected_at_str,
                affectedComponent=fault.affected_component_type,
                affectedComponentName=fault.affected_component_name,
                confidenceScore=fault.confidence_score,
                primaryCause=fault.primary_cause,
                summary=fault.summary,
                estimatedDegradationDays=fault.estimated_degradation_days,
                sensorEvidence=evidence,
                spectralSignature=fault.spectral_signature or []
            )
        )
    raise HTTPException(status_code=500, detail="Failed to inject fault")

@router.post("/resolve", response_model=StandardResponse[bool])
def resolve_fault(machine_id: str = "MTR-704", db: Session = Depends(get_db)):
    """Applies verified fix and restores machine status to optimal."""
    sensor_simulator.set_scenario(machine_id, "normal")

    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if machine:
        machine.status = "optimal"
        machine.health_score = 96.0
        machine.temperature = 58.2
        machine.vibration = 1.45
        db.commit()

    fault = db.query(DetectedFault).filter(DetectedFault.machine_id == machine_id).first()
    if fault:
        fault.status = "resolved"
        db.commit()

    return StandardResponse(success=True, message="Active fault resolved and machine restored to optimal.", data=True)
