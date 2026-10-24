import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class SimulationSession(Base):
    __tablename__ = "simulation_sessions"

    id = Column(String(64), primary_key=True, default=lambda: f"sim-{uuid.uuid4().hex[:8]}")
    machine_id = Column(String(64), ForeignKey("machines.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Input Simulation Parameters
    target_rpm = Column(Float, default=3000.0)
    load_percentage = Column(Float, default=92.0)
    ambient_temp_c = Column(Float, default=32.0)
    lubrication_quality_percent = Column(Float, default=85.0)
    cooling_airflow_percent = Column(Float, default=100.0)
    applied_strategy_id = Column(String(64), nullable=True)
    
    # Physics Model Assumptions Log
    assumptions_log = Column(JSON, default=dict)

    machine = relationship("Machine", back_populates="simulation_sessions")
    results = relationship("SimulationResult", back_populates="session", cascade="all, delete-orphan")

class SimulationResult(Base):
    __tablename__ = "simulation_results"

    id = Column(String(64), primary_key=True, default=lambda: f"res-{uuid.uuid4().hex[:8]}")
    session_id = Column(String(64), ForeignKey("simulation_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    strategy_id = Column(String(64), ForeignKey("repair_strategies.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Outcome Numerical Telemetry
    simulated_health = Column(Float, nullable=False)
    projected_temp = Column(Float, nullable=False)
    projected_vibration = Column(Float, nullable=False)
    projected_rpm = Column(Float, nullable=False)
    projected_power_kw = Column(Float, nullable=False)
    rul_days_post_fix = Column(Float, nullable=False)
    failure_risk_percent = Column(Float, nullable=False)
    energy_savings_kwh_month = Column(Float, default=0.0)
    
    # Evaluation
    passed_safety_constraints = Column(Boolean, default=True)
    explanation = Column(Text, nullable=False)
    
    # Detailed Stress & Stream
    stress_distribution = Column(JSON, default=list) # [{component, stressMpa, yieldLimitMpa, safetyFactor}]
    telemetry_stream = Column(JSON, default=list) # projected time-series ticks
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    session = relationship("SimulationSession", back_populates="results")
    strategy = relationship("RepairStrategy", back_populates="simulation_results")
