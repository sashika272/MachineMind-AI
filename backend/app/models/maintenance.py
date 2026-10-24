import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"

    id = Column(String(64), primary_key=True) # e.g. "INC-2026-0814"
    machine_id = Column(String(64), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False, index=True)
    date_str = Column(String(32), nullable=False)
    title = Column(String(255), nullable=False)
    type = Column(String(64), nullable=False) # maintenance, fault, inspection, component_replacement, calibration
    severity = Column(String(32), default="low") # low, medium, high, critical
    technician = Column(String(128), nullable=False)
    duration_hours = Column(Float, default=4.0)
    cost_usd = Column(Float, default=1000.0)
    resolution = Column(Text, nullable=False)
    parts_replaced = Column(JSON, default=list) # ["Part 1", "Part 2"]
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    machine = relationship("Machine", back_populates="maintenance_records")

class MaintenanceSchedule(Base):
    __tablename__ = "maintenance_schedules"

    id = Column(String(64), primary_key=True, default=lambda: f"maint-{uuid.uuid4().hex[:6]}")
    machine_id = Column(String(64), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False, index=True)
    scheduled_date_str = Column(String(32), nullable=False)
    title = Column(String(255), nullable=False)
    urgency = Column(String(32), default="normal") # normal, warning, critical
    component_name = Column(String(128), nullable=False)
    technician = Column(String(128), default="Marcus Chen")
    status = Column(String(32), default="scheduled") # scheduled, recommended, overdue
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    machine = relationship("Machine", back_populates="maintenance_schedules")
