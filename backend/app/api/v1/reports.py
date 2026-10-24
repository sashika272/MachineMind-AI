from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.machine import Machine
from app.models.fault import DetectedFault
from app.services.report_generator import report_generator
from app.services.root_cause_engine import root_cause_engine
from app.services.repair_engine import repair_engine
from app.services.sensor_engine import sensor_simulator

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/pdf")
def download_pdf_report(machine_id: str = "MTR-704", db: Session = Depends(get_db)):
    """Generates an executive reliability audit PDF report using ReportLab."""
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    machine_dict = {
        "code": machine.code if machine else "MTR-704-DE",
        "name": machine.name if machine else "Primary Feed Pump Induction Motor",
        "type": machine.type if machine else "Induction Motor",
        "location": machine.location if machine else "Bay 4",
        "healthScore": machine.health_score if machine else 64.0,
        "runningHours": machine.running_hours if machine else 14820.0,
        "temperature": machine.temperature if machine else 87.4,
        "vibration": machine.vibration if machine else 7.82
    }

    fault = db.query(DetectedFault).filter(DetectedFault.machine_id == machine_id).first()
    faults_list = [{
        "title": fault.title if fault else "Drive-End Bearing Race Spalling",
        "summary": fault.summary if fault else "High vibration detected."
    }]

    telemetry = sensor_simulator.generate_tick(machine_id=machine_id)
    diag = root_cause_engine.diagnose(telemetry)
    strategies = repair_engine.generate_strategies({"faultId": fault.id if fault else "FLT-2026-891"})
    recommended = next((s for s in strategies if s.get("isRecommended")), strategies[0])

    pdf_buffer = report_generator.generate_pdf_report(
        machine=machine_dict,
        faults=faults_list,
        diagnostics=diag,
        recommended_strategy=recommended
    )

    filename = f"MachineMind_Audit_{machine_dict['code']}.pdf"
    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/csv")
def download_csv_telemetry(machine_id: str = "MTR-704"):
    """Exports raw machine telemetry to downloadable CSV format."""
    telemetry_ticks = [sensor_simulator.generate_tick(machine_id=machine_id) for _ in range(30)]
    csv_str = report_generator.generate_csv_telemetry(telemetry_ticks)
    
    filename = f"Telemetry_{machine_id}.csv"
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
