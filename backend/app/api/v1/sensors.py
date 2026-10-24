import math
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.sensor_engine import sensor_simulator
from app.schemas.sensor import TelemetryPointSchema, VibrationSpectrumPointSchema, SensorDriftPointSchema
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/sensors", tags=["Sensors & Telemetry"])

@router.get("/live-tick", response_model=StandardResponse[TelemetryPointSchema])
def get_live_tick(machine_id: str = "MTR-704"):
    """Generates a dynamic real-time telemetry tick from the physical sensor simulator."""
    tick = sensor_simulator.generate_tick(machine_id=machine_id)
    return StandardResponse(
        success=True,
        data=TelemetryPointSchema(**tick)
    )

@router.get("/telemetry", response_model=StandardResponse[List[TelemetryPointSchema]])
def get_telemetry_history(machine_id: str = "MTR-704", points: int = Query(30, ge=5, le=100)):
    """Retrieves rolling sliding buffer of historical sensor readings."""
    scenario = sensor_simulator.get_scenario(machine_id)
    results = []
    base_time = datetime.now(timezone.utc)
    
    for i in range(points):
        step = points - 1 - i
        t = base_time - timedelta(minutes=step)
        hour = t.strftime("%H")
        minute = t.strftime("%M")
        second = t.strftime("%S")
        
        # Progressive degradation simulation
        degradation = min(1.0, (points - step) / points)
        if scenario == "bearing_spall":
            temp = round(82.0 + degradation * 5.4 + math.sin(i * 0.7) * 0.6, 1)
            vib = round(5.1 + degradation * 2.72 + math.cos(i * 0.5) * 0.35, 2)
            acoustic = round(88.5 + degradation * 5.1, 1)
            anomaly = round(45.0 + degradation * 38.0)
        else:
            temp = round(61.0 + math.sin(i * 0.4) * 0.8, 1)
            vib = round(1.8 + math.cos(i * 0.5) * 0.2, 2)
            acoustic = round(78.0 + math.sin(i * 0.3) * 0.5, 1)
            anomaly = round(10.0 + math.sin(i) * 3)

        results.append(
            TelemetryPointSchema(
                timestamp=int(t.timestamp() * 1000),
                timeStr=f"{hour}:{minute}:{second}",
                temperature=temp,
                vibration=vib,
                pressure=round(18.2 + math.sin(i * 0.4) * 0.3, 1),
                rpm=round(2970 + math.sin(i * 0.9) * 8),
                powerKw=round(418.0 + degradation * 4.5, 1),
                acousticDb=acoustic,
                anomalyScore=anomaly,
                isSimulated=True
            )
        )
    return StandardResponse(success=True, data=results)

@router.get("/spectrum", response_model=StandardResponse[List[VibrationSpectrumPointSchema]])
def get_vibration_spectrum(machine_id: str = "MTR-704"):
    """Returns demodulated envelope FFT spectrum with ISO threshold limits."""
    scenario = sensor_simulator.get_scenario(machine_id)
    
    if scenario == "bearing_spall":
        data = [
            {"frequency": 25.0, "amplitude": 0.8, "threshold": 2.5, "label": "0.5X Sub-harmonic"},
            {"frequency": 49.6, "amplitude": 3.4, "threshold": 4.5, "label": "1X Running Speed (2975 RPM)"},
            {"frequency": 99.2, "amplitude": 2.1, "threshold": 3.8, "label": "2X Misalignment"},
            {"frequency": 148.8, "amplitude": 1.2, "threshold": 3.0, "label": "3X"},
            {"frequency": 184.2, "amplitude": 7.8, "threshold": 2.8, "label": "BPFO (Outer Race Defect)"},
            {"frequency": 235.0, "amplitude": 1.5, "threshold": 2.5, "label": None},
            {"frequency": 292.6, "amplitude": 5.6, "threshold": 2.8, "label": "2x BPFO (Harmonic)"},
            {"frequency": 368.4, "amplitude": 3.9, "threshold": 2.2, "label": "3x BPFO"},
            {"frequency": 441.0, "amplitude": 1.1, "threshold": 2.0, "label": None},
            {"frequency": 588.0, "amplitude": 2.4, "threshold": 1.8, "label": "Cage Modulated 4x BPFO"},
            {"frequency": 720.0, "amplitude": 0.9, "threshold": 1.5, "label": None},
            {"frequency": 850.0, "amplitude": 0.7, "threshold": 1.5, "label": None},
            {"frequency": 1000.0, "amplitude": 0.5, "threshold": 1.2, "label": None}
        ]
    else:
        data = [
            {"frequency": 49.6, "amplitude": 1.8, "threshold": 4.5, "label": "1X Running Speed"},
            {"frequency": 99.2, "amplitude": 0.8, "threshold": 3.8, "label": "2X"},
            {"frequency": 148.8, "amplitude": 0.4, "threshold": 3.0, "label": "3X"},
            {"frequency": 184.2, "amplitude": 0.3, "threshold": 2.8, "label": "BPFO"},
            {"frequency": 500.0, "amplitude": 0.2, "threshold": 2.0, "label": None}
        ]
    return StandardResponse(success=True, data=[VibrationSpectrumPointSchema(**p) for p in data])

@router.get("/drift", response_model=StandardResponse[List[SensorDriftPointSchema]])
def get_sensor_drift():
    """Returns predictive drift forecast across critical sensor nodes."""
    data = [
        {"sensor": "DE-Acc-101 (Vibration Velocity)", "unit": "mm/s RMS", "current": 8.45, "oneWeekProjected": 14.2, "oneMonthProjected": 26.5, "driftStatus": "rapid_escalation"},
        {"sensor": "RTD-DE-01 (Bearing Temp)", "unit": "°C", "current": 92.6, "oneWeekProjected": 108.5, "oneMonthProjected": 135.0, "driftStatus": "rapid_escalation"},
        {"sensor": "Current Transducer CT-PhaseA", "unit": "Amps", "current": 44.2, "oneWeekProjected": 46.8, "oneMonthProjected": 51.2, "driftStatus": "gradual_drift"},
        {"sensor": "NDE-Acc-102 (Rear Bearing)", "unit": "mm/s RMS", "current": 2.14, "oneWeekProjected": 2.30, "oneMonthProjected": 2.45, "driftStatus": "stable"}
    ]
    return StandardResponse(success=True, data=[SensorDriftPointSchema(**d) for d in data])

@router.post("/scenario", response_model=StandardResponse[dict])
def set_sensor_scenario(
    payload: dict,
    db: Session = Depends(get_db)
):
    """Sets active telemetry simulation scenario and updates machine status."""
    machine_id = payload.get("machine_id", "MTR-704")
    scenario = payload.get("scenario", "normal")
    
    sensor_simulator.set_scenario(machine_id, scenario)
    
    # Update machine record in database to reflect scenario telemetry
    from app.models.machine import Machine
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if machine:
        if scenario == "overheating":
            machine.status = "warning"
            machine.health_score = 52.0
            machine.temperature = 98.4
            machine.vibration = 2.8
        elif scenario in ("bearing_spall", "excessive_vibration"):
            machine.status = "critical"
            machine.health_score = 41.0
            machine.temperature = 91.2
            machine.vibration = 8.45
        elif scenario == "pressure_surge":
            machine.status = "warning"
            machine.health_score = 68.0
            machine.temperature = 67.5
            machine.vibration = 4.2
        elif scenario == "multi_anomaly":
            machine.status = "critical"
            machine.health_score = 29.0
            machine.temperature = 104.0
            machine.vibration = 9.8
        else: # normal
            machine.status = "optimal"
            machine.health_score = 96.0
            machine.temperature = 62.0
            machine.vibration = 1.85
        db.commit()

    return StandardResponse(
        success=True,
        message=f"Scenario for {machine_id} switched to '{scenario}'.",
        data={"machineId": machine_id, "scenario": scenario, "status": machine.status if machine else "optimal"}
    )

