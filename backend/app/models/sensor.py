import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from app.core.database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    machine_id = Column(String(64), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    time_str = Column(String(32), nullable=False)
    
    # 4 Core Telemetry Metrics
    temperature = Column(Float, nullable=False) # °C
    vibration = Column(Float, nullable=False) # mm/s RMS
    pressure = Column(Float, nullable=False) # bar
    rpm = Column(Float, nullable=False) # RPM
    
    # Auxiliary Channels
    power_kw = Column(Float, default=400.0)
    acoustic_db = Column(Float, default=80.0)
    anomaly_score = Column(Float, default=0.0) # 0 - 100
    
    # Synthetic / Simulated Data Tag (Clearly distinguished from real sensor feeds)
    is_simulated = Column(Boolean, default=True, nullable=False, index=True)
    simulation_scenario = Column(String(64), default="normal") # normal, bearing_spall, thermal_runaway, pressure_surge, multi_anomaly

    machine = relationship("Machine", back_populates="sensor_readings")

    __table_args__ = (
        Index("idx_machine_timestamp", "machine_id", "timestamp"),
    )

class SensorThreshold(Base):
    __tablename__ = "sensor_thresholds"

    id = Column(String(64), primary_key=True, default=lambda: f"thresh-{uuid.uuid4().hex[:6]}")
    machine_id = Column(String(64), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False, index=True)
    sensor_name = Column(String(64), nullable=False)
    metric_type = Column(String(32), nullable=False) # temperature, vibration, pressure, rpm
    unit = Column(String(16), nullable=False)
    baseline_value = Column(Float, nullable=False)
    warning_threshold = Column(Float, nullable=False)
    critical_threshold = Column(Float, nullable=False)
    iso_standard_ref = Column(String(64), default="ISO 10816-3 Zone C")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
