from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.machine import Machine, MachineComponent
from app.schemas.machine import MachineSchema, ComponentSchema
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/machines", tags=["Machines"])

@router.get("", response_model=StandardResponse[List[MachineSchema]])
def list_machines(db: Session = Depends(get_db)):
    """Retrieves all monitored industrial assets across plant facilities."""
    machines = db.query(Machine).all()
    results = []
    for m in machines:
        comps = [
            ComponentSchema(
                id=c.id,
                name=c.name,
                type=c.type,
                status=c.status or "normal",
                healthScore=c.health_score or 100.0,
                temperature=c.temperature or 60.0,
                vibration=c.vibration or 1.5,
                failureProbability=c.failure_probability or 0.05,
                description=c.description,
                position3d=c.position_3d or [0, 0, 0],
                recommendation=c.recommendation,
                inspectedDate=c.inspected_date
            )
            for c in m.components
        ]
        results.append(
            MachineSchema(
                id=m.id,
                code=m.code,
                name=m.name,
                type=m.type,
                location=m.location,
                facility=m.facility or "Delta-4 Cogeneration Unit",
                status=m.status or "nominal",
                healthScore=m.health_score,
                runningHours=m.running_hours or 0.0,
                rpm=m.rpm or 3000.0,
                temperature=m.temperature or 65.0,
                vibration=m.vibration or 1.8,
                pressure=m.pressure or 18.0,
                powerKw=m.power_kw or 400.0,
                powerFactor=m.power_factor or 0.92,
                efficiencyPercent=m.efficiency_percent or 93.5,
                noiseDb=m.noise_db or 82.0,
                lastMaintenance=m.last_maintenance,
                nextScheduledService=m.next_scheduled_service,
                modelSpecs=m.model_specs or {},
                components=comps
            )
        )
    return StandardResponse(success=True, data=results)

@router.get("/{machine_id}", response_model=StandardResponse[MachineSchema])
def get_machine(machine_id: str, db: Session = Depends(get_db)):
    """Retrieves detailed asset metadata and all 3D mechanical components."""
    m = db.query(Machine).filter(Machine.id == machine_id).first()
    if not m:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Machine '{machine_id}' not found.")

    comps = [
        ComponentSchema(
            id=c.id,
            name=c.name,
            type=c.type,
            status=c.status or "normal",
            healthScore=c.health_score or 100.0,
            temperature=c.temperature or 60.0,
            vibration=c.vibration or 1.5,
            failureProbability=c.failure_probability or 0.05,
            description=c.description,
            position3d=c.position_3d or [0, 0, 0],
            recommendation=c.recommendation,
            inspectedDate=c.inspected_date
        )
        for c in m.components
    ]

    return StandardResponse(
        success=True,
        data=MachineSchema(
            id=m.id,
            code=m.code,
            name=m.name,
            type=m.type,
            location=m.location,
            facility=m.facility or "Delta-4 Cogeneration Unit",
            status=m.status or "nominal",
            healthScore=m.health_score,
            runningHours=m.running_hours or 0.0,
            rpm=m.rpm or 3000.0,
            temperature=m.temperature or 65.0,
            vibration=m.vibration or 1.8,
            pressure=m.pressure or 18.0,
            powerKw=m.power_kw or 400.0,
            powerFactor=m.power_factor or 0.92,
            efficiencyPercent=m.efficiency_percent or 93.5,
            noiseDb=m.noise_db or 82.0,
            lastMaintenance=m.last_maintenance,
            nextScheduledService=m.next_scheduled_service,
            modelSpecs=m.model_specs or {},
            components=comps
        )
    )

@router.get("/{machine_id}/components", response_model=StandardResponse[List[ComponentSchema]])
def list_components(machine_id: str, db: Session = Depends(get_db)):
    """Returns list of mechanical components for a machine."""
    comps = db.query(MachineComponent).filter(MachineComponent.machine_id == machine_id).all()
    results = [
        ComponentSchema(
            id=c.id,
            name=c.name,
            type=c.type,
            status=c.status or "normal",
            healthScore=c.health_score or 100.0,
            temperature=c.temperature or 60.0,
            vibration=c.vibration or 1.5,
            failureProbability=c.failure_probability or 0.05,
            description=c.description,
            position3d=c.position_3d or [0, 0, 0],
            recommendation=c.recommendation,
            inspectedDate=c.inspected_date
        )
        for c in comps
    ]
    return StandardResponse(success=True, data=results)
