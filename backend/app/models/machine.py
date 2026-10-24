import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Machine(Base):
    __tablename__ = "machines"

    id = Column(String(64), primary_key=True) # e.g. "MTR-704"
    code = Column(String(64), unique=True, index=True, nullable=False) # e.g. "MTR-704-DE"
    name = Column(String(128), nullable=False)
    type = Column(String(64), nullable=False) # "Induction Motor", "Centrifugal Pump", etc.
    location = Column(String(128), nullable=False)
    facility = Column(String(128), default="Delta-4 Cogeneration Unit")
    status = Column(String(32), default="nominal", index=True) # optimal, nominal, warning, critical, offline
    health_score = Column(Float, default=100.0, nullable=False) # 0.0 - 100.0
    running_hours = Column(Float, default=0.0)
    rpm = Column(Float, default=3000.0)
    temperature = Column(Float, default=65.0) # °C
    vibration = Column(Float, default=1.8) # mm/s RMS
    pressure = Column(Float, default=18.0) # bar
    power_kw = Column(Float, default=400.0)
    power_factor = Column(Float, default=0.92)
    efficiency_percent = Column(Float, default=93.5)
    noise_db = Column(Float, default=82.0)
    last_maintenance = Column(String(32))
    next_scheduled_service = Column(String(32))
    model_specs = Column(JSON, default=dict) # ratedKw, voltage, frameSize, etc.
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    components = relationship("MachineComponent", back_populates="machine", cascade="all, delete-orphan")
    sensor_readings = relationship("SensorReading", back_populates="machine", cascade="all, delete-orphan")
    operating_sessions = relationship("MachineOperatingSession", back_populates="machine", cascade="all, delete-orphan")
    detected_faults = relationship("DetectedFault", back_populates="machine", cascade="all, delete-orphan")
    simulation_sessions = relationship("SimulationSession", back_populates="machine", cascade="all, delete-orphan")
    maintenance_records = relationship("MaintenanceRecord", back_populates="machine", cascade="all, delete-orphan")
    maintenance_schedules = relationship("MaintenanceSchedule", back_populates="machine", cascade="all, delete-orphan")

class MachineComponent(Base):
    __tablename__ = "machine_components"

    id = Column(String(64), primary_key=True) # e.g. "comp-1"
    machine_id = Column(String(64), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(128), nullable=False)
    type = Column(String(64), nullable=False) # bearing_de, bearing_nde, stator, rotor_shaft, cooling_fan, housing, terminal_box
    status = Column(String(32), default="normal") # normal, warning, critical
    health_score = Column(Float, default=100.0)
    temperature = Column(Float, default=60.0)
    vibration = Column(Float, default=1.5)
    failure_probability = Column(Float, default=0.05)
    description = Column(Text)
    position_3d = Column(JSON, default=lambda: [0, 0, 0])
    recommendation = Column(Text)
    inspected_date = Column(String(32))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    machine = relationship("Machine", back_populates="components")
    root_cause_investigations = relationship("RootCauseInvestigation", back_populates="component")

class MachineOperatingSession(Base):
    __tablename__ = "machine_operating_sessions"

    id = Column(String(64), primary_key=True, default=lambda: f"sess-{uuid.uuid4().hex[:8]}")
    machine_id = Column(String(64), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False, index=True)
    start_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    end_time = Column(DateTime, nullable=True)
    avg_load_percent = Column(Float, default=85.0)
    energy_consumed_kwh = Column(Float, default=0.0)
    anomalies_detected_count = Column(Integer, default=0)
    status = Column(String(32), default="active") # active, closed, aborted

    machine = relationship("Machine", back_populates="operating_sessions")
