from typing import List, Optional
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.maintenance import MaintenanceRecord
from app.models.audit import AuditLog
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/history", tags=["Machine History & Audits"])

@router.get("/incidents", response_model=StandardResponse[List[dict]])
def get_incident_history(machine_id: str = "MTR-704", db: Session = Depends(get_db)):
    """Returns chronological audit trail of maintenance work orders and overhaul records."""
    records = db.query(MaintenanceRecord).filter(MaintenanceRecord.machine_id == machine_id).order_by(MaintenanceRecord.created_at.desc()).all()
    results = [
        {
            "id": r.id,
            "date": r.date_str,
            "title": r.title,
            "type": r.type,
            "severity": r.severity,
            "technician": r.technician,
            "durationHours": r.duration_hours,
            "costUsd": r.cost_usd,
            "resolution": r.resolution,
            "partsReplaced": r.parts_replaced or []
        }
        for r in records
    ]
    return StandardResponse(success=True, data=results)

@router.post("/incidents", response_model=StandardResponse[dict])
def create_incident_record(payload: dict, db: Session = Depends(get_db)):
    """Records a new maintenance work order or incident into machine history."""
    machine_id = payload.get("machine_id", "MTR-704")
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    rec_id = f"INC-2026-{uuid.uuid4().hex[:4].upper()}"

    record = MaintenanceRecord(
        id=rec_id,
        machine_id=machine_id,
        date_str=payload.get("date", now_str),
        title=payload.get("title", "Scheduled Preventive Maintenance"),
        type=payload.get("type", "maintenance"),
        severity=payload.get("severity", "medium"),
        technician=payload.get("technician", "Dr. Elena Vance"),
        duration_hours=float(payload.get("durationHours", payload.get("duration_hours", 4.0))),
        cost_usd=float(payload.get("costUsd", payload.get("cost_usd", 1200.0))),
        resolution=payload.get("resolution", "Maintenance procedure completed according to OEM specification."),
        parts_replaced=payload.get("partsReplaced", payload.get("parts_replaced", []))
    )
    db.add(record)

    # Add audit log
    audit = AuditLog(
        action="maintenance_logged",
        resource_type="machine",
        resource_id=machine_id,
        details={"record_id": rec_id, "title": record.title}
    )
    db.add(audit)
    db.commit()
    db.refresh(record)

    return StandardResponse(
        success=True,
        message="Maintenance work order recorded in machine history.",
        data={
            "id": record.id,
            "date": record.date_str,
            "title": record.title,
            "type": record.type,
            "severity": record.severity,
            "technician": record.technician,
            "durationHours": record.duration_hours,
            "costUsd": record.cost_usd,
            "resolution": record.resolution,
            "partsReplaced": record.parts_replaced
        }
    )

