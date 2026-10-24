import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class DetectedFault(Base):
    __tablename__ = "detected_faults"

    id = Column(String(64), primary_key=True) # e.g. "FLT-2026-891"
    machine_id = Column(String(64), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    severity = Column(String(32), default="medium", index=True) # critical, high, medium, low
    status = Column(String(32), default="active", index=True) # active, investigating, mitigated, resolved
    detected_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    detected_at_str = Column(String(64), nullable=False)
    affected_component_type = Column(String(64), nullable=False)
    affected_component_name = Column(String(128), nullable=False)
    confidence_score = Column(Float, default=90.0) # 0 - 100
    primary_cause = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    estimated_degradation_days = Column(Float, default=7.0)
    
    # Evidence & Spectrum JSON payloads
    sensor_evidence = Column(JSON, default=list) # [{sensor, currentValue, baselineValue, deviation, severity}]
    spectral_signature = Column(JSON, default=list) # [{frequency, amplitude, threshold, label}]
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    machine = relationship("Machine", back_populates="detected_faults")
    root_cause_investigations = relationship("RootCauseInvestigation", back_populates="fault", cascade="all, delete-orphan")
    repair_strategies = relationship("RepairStrategy", back_populates="fault", cascade="all, delete-orphan")

class RootCauseInvestigation(Base):
    __tablename__ = "root_cause_investigations"

    id = Column(String(64), primary_key=True, default=lambda: f"rca-{uuid.uuid4().hex[:8]}")
    fault_id = Column(String(64), ForeignKey("detected_faults.id", ondelete="CASCADE"), nullable=False, index=True)
    component_id = Column(String(64), ForeignKey("machine_components.id", ondelete="SET NULL"), nullable=True, index=True)
    primary_root_cause = Column(Text, nullable=False)
    confidence_percent = Column(Float, default=94.0)
    uncertainty_lower = Column(Float, default=90.0)
    uncertainty_upper = Column(Float, default=98.0)
    
    # Bayesian Graph & Factor Breakdown
    causal_chain = Column(JSON, default=list) # list of causal nodes
    contributing_factors = Column(JSON, default=list) # [{factor, weight, impact}]
    supporting_telemetry = Column(JSON, default=list) # [{metric, description, zScore}]
    recommendations = Column(JSON, default=list) # suggested field checks
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    fault = relationship("DetectedFault", back_populates="root_cause_investigations")
    component = relationship("MachineComponent", back_populates="root_cause_investigations")
