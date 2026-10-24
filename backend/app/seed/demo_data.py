from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User
from app.models.machine import Machine, MachineComponent
from app.models.sensor import SensorReading, SensorThreshold
from app.models.fault import DetectedFault, RootCauseInvestigation
from app.models.repair import RepairStrategy
from app.models.maintenance import MaintenanceRecord, MaintenanceSchedule
from app.models.notification import Notification

def seed_database(db: Session = None):
    """Populates the database with realistic industrial seed data."""
    if db is None:
        db = SessionLocal()

    # Create tables if not exist
    Base.metadata.create_all(bind=engine)

    # 1. Seed Demo User
    existing_user = db.query(User).filter(User.email == "elena.vance@machinemind.ai").first()
    if not existing_user:
        demo_user = User(
            id="usr-90412",
            email="elena.vance@machinemind.ai",
            hashed_password=hash_password("ApexReliability2026!"),
            name="Dr. Elena Vance",
            role="Chief Reliability Engineer",
            organization="Apex Industrial Dynamics · Plant Delta-4",
            plant_location="Rotterdam Industrial Basin",
            access_tier="Enterprise AI Full",
            is_active=True,
            is_superuser=True
        )
        db.add(demo_user)
        db.commit()

    # 2. Seed Machines
    if db.query(Machine).count() == 0:
        mtr_704 = Machine(
            id="MTR-704",
            code="MTR-704-DE",
            name="Primary Feed Pump Induction Motor",
            type="Induction Motor",
            location="Bay 4 · Feedwater Treatment Line",
            facility="Delta-4 Cogeneration Unit",
            status="warning",
            health_score=64.0,
            running_hours=14820.0,
            rpm=2975.0,
            temperature=87.4,
            vibration=7.82,
            pressure=18.4,
            power_kw=422.5,
            power_factor=0.91,
            efficiency_percent=91.2,
            noise_db=93.6,
            last_maintenance="2026-08-14",
            next_scheduled_service="2026-11-10",
            model_specs={
                "ratedKw": 450,
                "ratedRpm": 3000,
                "voltage": "6,600 V / 3-Phase / 50Hz",
                "frameSize": "IEC 400L",
                "bearingType": "SKF 6326 M/C3 Deep Groove (Drive End)",
                "insulationClass": "Class H (180°C)"
            }
        )
        pmp_201 = Machine(
            id="PMP-201",
            code="PMP-201-HP",
            name="Boiler Feed Multistage Pump",
            type="Centrifugal Pump",
            location="Bay 2 · High-Pressure Steam Feed",
            facility="Delta-4 Cogeneration Unit",
            status="optimal",
            health_score=95.0,
            running_hours=8420.0,
            rpm=3450.0,
            temperature=61.2,
            vibration=1.62,
            pressure=42.8,
            power_kw=310.0,
            power_factor=0.94,
            efficiency_percent=94.8,
            noise_db=84.1,
            last_maintenance="2026-09-12",
            next_scheduled_service="2026-12-15",
            model_specs={"ratedKw": 350, "frameSize": "ISO 5199"}
        )
        cmp_409 = Machine(
            id="CMP-409",
            code="CMP-409-TX",
            name="Supercritical Turbocompressor Unit",
            type="Turbocompressor",
            location="Bay 6 · Synthesis Gas Train",
            facility="Delta-4 Cogeneration Unit",
            status="warning",
            health_score=73.0,
            running_hours=21100.0,
            rpm=8850.0,
            temperature=114.2,
            vibration=6.40,
            pressure=82.5,
            power_kw=1180.0,
            power_factor=0.93,
            efficiency_percent=88.5,
            noise_db=98.4,
            last_maintenance="2026-06-20",
            next_scheduled_service="2026-10-30",
            model_specs={"ratedKw": 1250, "frameSize": "API 617"}
        )
        mtr_705 = Machine(
            id="MTR-705",
            code="MTR-705-SL",
            name="Primary Slurry Circulation Drive",
            type="Induction Motor",
            location="Bay 3 · Mineral Slurry Refining",
            facility="Delta-4 Cogeneration Unit",
            status="nominal",
            health_score=88.0,
            running_hours=11240.0,
            rpm=1485.0,
            temperature=69.5,
            vibration=2.95,
            pressure=12.1,
            power_kw=480.0,
            power_factor=0.89,
            efficiency_percent=93.1,
            noise_db=87.2,
            last_maintenance="2026-07-28",
            next_scheduled_service="2026-11-25",
            model_specs={"ratedKw": 500, "frameSize": "IEC 450M"}
        )
        hyd_112 = Machine(
            id="HYD-112",
            code="HYD-112-PX",
            name="Hydraulic Actuation Power Pack",
            type="Hydraulic Drive",
            location="Sub-level 1 · Turbine Governor Room",
            facility="Delta-4 Cogeneration Unit",
            status="nominal",
            health_score=86.0,
            running_hours=6300.0,
            rpm=1750.0,
            temperature=54.3,
            vibration=2.30,
            pressure=210.0,
            power_kw=175.0,
            power_factor=0.92,
            efficiency_percent=92.4,
            noise_db=81.5,
            last_maintenance="2026-08-02",
            next_scheduled_service="2026-12-01",
            model_specs={"ratedKw": 180, "frameSize": "IEC 315L"}
        )
        mtr_802 = Machine(
            id="MTR-802",
            code="MTR-802-CT",
            name="Cooling Tower Induced Draft Fan Motor",
            type="Induction Motor",
            location="Roof Deck · Wet Cooling Tower C",
            facility="Delta-4 Cogeneration Unit",
            status="optimal",
            health_score=97.0,
            running_hours=4120.0,
            rpm=980.0,
            temperature=46.8,
            vibration=1.15,
            pressure=1.2,
            power_kw=215.0,
            power_factor=0.88,
            efficiency_percent=95.2,
            noise_db=79.8,
            last_maintenance="2026-10-01",
            next_scheduled_service="2027-01-15",
            model_specs={"ratedKw": 220, "frameSize": "IEC 355M"}
        )
        db.add_all([mtr_704, pmp_201, cmp_409, mtr_705, hyd_112, mtr_802])
        db.commit()

        # Components for MTR-704
        comps = [
            MachineComponent(
                id="comp-1", machine_id="MTR-704", name="Drive-End Bearing Assembly (DE)", type="bearing_de",
                status="critical", health_score=42.0, temperature=92.6, vibration=8.45, failure_probability=0.78,
                description="Micro-spalling detected on outer raceway with localized cage looseness and severe thermal accumulation.",
                position_3d=[1.85, 0, 0], recommendation="Immediate replacement or scheduled shutdown within 120 operating hours.",
                inspected_date="2026-10-21"
            ),
            MachineComponent(
                id="comp-2", machine_id="MTR-704", name="Non-Drive End Bearing (NDE)", type="bearing_nde",
                status="normal", health_score=89.0, temperature=58.1, vibration=2.14, failure_probability=0.08,
                description="Nominal operational status. Lubrication film thickness is within recommended ISO VG 460 limits.",
                position_3d=[-1.85, 0, 0], recommendation="Next lubrication inspection in 450 hours.", inspected_date="2026-10-18"
            ),
            MachineComponent(
                id="comp-3", machine_id="MTR-704", name="Stator Core & 6.6kV Windings", type="stator",
                status="warning", health_score=71.0, temperature=86.8, vibration=3.20, failure_probability=0.24,
                description="Elevated thermal gradient transferred from DE bearing housing. Winding insulation resistance is acceptable.",
                position_3d=[0, 0, 0], recommendation="Monitor phase current balance and thermal dissipation fins.", inspected_date="2026-10-20"
            ),
            MachineComponent(
                id="comp-4", machine_id="MTR-704", name="Cast Iron Stator Housing & Fins", type="housing",
                status="normal", health_score=94.0, temperature=68.2, vibration=2.85, failure_probability=0.04,
                description="Structural integrity intact. Surface cooling fins are clear of particulate accumulation.",
                position_3d=[0, 0.4, 0], recommendation="Routine visual inspection.", inspected_date="2026-09-30"
            ),
            MachineComponent(
                id="comp-5", machine_id="MTR-704", name="Driveshaft & Rotor Dynamics", type="rotor_shaft",
                status="warning", health_score=68.0, temperature=79.5, vibration=5.60, failure_probability=0.32,
                description="Secondary 1X and 2X rotational harmonic distortion caused by bearing play and radial eccentricity.",
                position_3d=[0, 0, 0], recommendation="Laser alignment verification recommended post bearing swap.", inspected_date="2026-10-21"
            ),
            MachineComponent(
                id="comp-6", machine_id="MTR-704", name="High-Efficiency External Cooling Fan", type="cooling_fan",
                status="normal", health_score=92.0, temperature=42.0, vibration=1.80, failure_probability=0.05,
                description="Aerodynamic blade profile undamaged. Shroud clearance verified at 4.2mm nominal.",
                position_3d=[-2.2, 0, 0], recommendation="Check airflow intake mesh during weekly walkaround.", inspected_date="2026-10-15"
            ),
            MachineComponent(
                id="comp-7", machine_id="MTR-704", name="High-Voltage Terminal Junction Box", type="terminal_box",
                status="normal", health_score=96.0, temperature=44.5, vibration=1.20, failure_probability=0.02,
                description="Cable glands sealed to IP66. Partial discharge analysis within safe limits (< 35 pC).",
                position_3d=[0, 1.4, 0], recommendation="Infrared thermography scan every 6 months.", inspected_date="2026-08-14"
            )
        ]
        db.add_all(comps)
        db.commit()

        # 3. Seed Detected Faults
        flt_1 = DetectedFault(
            id="FLT-2026-891",
            machine_id="MTR-704",
            title="Drive-End Bearing Race Fatigue & Micro-Spalling",
            severity="critical",
            status="active",
            detected_at=datetime.now(timezone.utc) - timedelta(hours=6),
            detected_at_str="2026-10-24 06:14 UTC",
            affected_component_type="bearing_de",
            affected_component_name="Drive-End Bearing Assembly (DE)",
            confidence_score=94.6,
            primary_cause="Sub-surface shear stress collapse aggravated by grease lubricant thermal shear thinning.",
            summary="High-frequency demodulation analysis reveals synchronous impacts at 184.2 Hz (BPFO). Peak velocity reached 8.45 mm/s RMS, exceeding ISO 10816-3 Zone C thresholds.",
            estimated_degradation_days=5.2,
            sensor_evidence=[
                {"sensor": "Radial Accelerometer DE-Acc-101", "currentValue": "8.45 mm/s RMS", "baselineValue": "2.10 mm/s RMS", "deviation": "+302% (Alert Zone C)", "severity": "critical"},
                {"sensor": "Bearing Temperature RTD-DE-01", "currentValue": "92.6 °C", "baselineValue": "62.0 °C", "deviation": "+30.6 °C above baseline", "severity": "critical"},
                {"sensor": "High-Frequency Enveloping HFE-04", "currentValue": "18.4 gE", "baselineValue": "1.2 gE", "deviation": "+1433% Impact Peak", "severity": "critical"},
                {"sensor": "Acoustic Emission Sensor AES-02", "currentValue": "93.6 dB", "baselineValue": "78.2 dB", "deviation": "+15.4 dB ultrasonic hiss", "severity": "warning"}
            ],
            spectral_signature=[
                {"frequency": 49.6, "amplitude": 3.4, "threshold": 4.5, "label": "1X Run Speed"},
                {"frequency": 99.2, "amplitude": 2.1, "threshold": 3.8, "label": "2X Misalignment"},
                {"frequency": 184.2, "amplitude": 7.8, "threshold": 2.8, "label": "BPFO Outer Race"},
                {"frequency": 292.6, "amplitude": 5.6, "threshold": 2.8, "label": "2x BPFO Harmonic"}
            ]
        )
        db.add(flt_1)
        db.commit()

        # 4. Seed Root Cause Investigation
        rca = RootCauseInvestigation(
            id="rca-891",
            fault_id="FLT-2026-891",
            component_id="comp-1",
            primary_root_cause="Sub-surface shear fatigue flaking exacerbated by grease ester degradation at sustained elevated temperatures.",
            confidence_percent=94.6,
            uncertainty_lower=91.2,
            uncertainty_upper=97.4,
            causal_chain=[
                {"id": "node-root-1", "label": "Thermal Lubricant Breakdown", "type": "root", "probability": 95, "evidence": "High ambient heat wave + boundary layer oil film thinning under 422kW load.", "severity": "critical"},
                {"id": "node-mech-1", "label": "Micro-Asperity Metal-to-Metal Contact", "type": "mechanism", "probability": 92, "evidence": "High-frequency acoustic emission jump from 78 dB to 93.6 dB.", "severity": "high"},
                {"id": "node-mech-2", "label": "Outer Race Micro-Spalling at Ball Track", "type": "mechanism", "probability": 96, "evidence": "Synchronous 184.2 Hz spectral peak matched to 7-ball pass rolling frequency (BPFO).", "severity": "critical"},
                {"id": "node-sym-1", "label": "Radial Velocity Spike (8.45 mm/s RMS)", "type": "symptom", "probability": 99, "evidence": "Accelerometer saturation above ISO 10816 Zone C alert line.", "severity": "critical"},
                {"id": "node-sym-2", "label": "Bearing Housing Temp Runaway (92.6 °C)", "type": "symptom", "probability": 97, "evidence": "Continuous thermal rise on RTD-DE-01 sensor.", "severity": "high"}
            ],
            contributing_factors=[
                {"factor": "Thermal stress & high ambient room temperature (38°C in Bay 4)", "weight": 38, "impact": "Accelerated grease base oil oxidation and viscosity loss by 45%."},
                {"factor": "Extended continuous duty cycle (14,820 hours since last overhaul)", "weight": 32, "impact": "Bearing life consumed is 87% of L10h rating."},
                {"factor": "Slight driven pump shaft misalignment (0.08mm angular tilt)", "weight": 20, "impact": "Generates asymmetric axial thrust on the deep groove ball track."},
                {"factor": "Transient grid harmonic voltage distortion (THD 4.2%)", "weight": 10, "impact": "Induced minor stray rotor shaft currents through rolling elements."}
            ],
            supporting_telemetry=[
                {"metric": "BPFO Peak Amplitude (184.2 Hz)", "description": "Envelope demodulation amplitude 7.82 mm/s vs 0.35 mm/s baseline.", "zScore": 6.8},
                {"metric": "Crest Factor (Peak-to-RMS ratio)", "description": "Vibration signal impulsive spikiness shifted from 3.2 to 8.9.", "zScore": 5.4},
                {"metric": "RTD Temperature Delta DE vs NDE", "description": "DE bearing runs +34.5 °C hotter than opposing NDE bearing.", "zScore": 4.9}
            ]
        )
        db.add(rca)
        db.commit()

        # 5. Seed Maintenance Records
        m1 = MaintenanceRecord(
            id="INC-2026-0814", machine_id="MTR-704", date_str="2026-08-14",
            title="Routine 12,000-hr Overhaul & Stator Varnish Coating Inspection",
            type="maintenance", severity="low", technician="Marcus Chen",
            duration_hours=8.5, cost_usd=1850.0,
            resolution="Successfully completed insulation resistance test (120 MΩ). Greased both bearings with 300g Mobil Polyrex."
        )
        m2 = MaintenanceRecord(
            id="INC-2026-0422", machine_id="MTR-704", date_str="2026-04-22",
            title="Cooling Shroud Debris Ingress & Air Flow Restriction",
            type="fault", severity="medium", technician="Sarah Jenkins",
            duration_hours=3.0, cost_usd=420.0,
            resolution="Fan cowl intake screen clogged with airborne limestone dust. Removed screen, steam cleaned fins and reinstalled.",
            parts_replaced=["Mesh Intake Filter Gasket"]
        )
        db.add_all([m1, m2])
        db.commit()

        # 6. Seed Notifications
        n1 = Notification(
            id="notif-1", user_id="usr-90412",
            title="Critical Bearing Anomaly Detected",
            message="MTR-704 DE Bearing vibration spiked to 8.45 mm/s RMS (184.2 Hz BPFO).",
            severity="critical", read=False, target_view="faults", timestamp_str="12 min ago"
        )
        n2 = Notification(
            id="notif-2", user_id="usr-90412",
            title="Digital Twin Simulation Available",
            message="MachineMind AI generated 3 repair scenarios with Monte Carlo risk bounds.",
            severity="info", read=False, target_view="digital-twin", timestamp_str="28 min ago"
        )
        db.add_all([n1, n2])
        db.commit()

    if db:
        db.close()

if __name__ == "__main__":
    seed_database()
    print("Database seeding completed successfully!")
