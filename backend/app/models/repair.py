import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class RepairStrategy(Base):
    __tablename__ = "repair_strategies"

    id = Column(String(64), primary_key=True) # e.g. "strat-1"
    fault_id = Column(String(64), ForeignKey("detected_faults.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    tier = Column(String(32), default="balanced") # conservative, balanced, aggressive, temporary
    description = Column(Text, nullable=False)
    
    # Financial & Duration Metrics
    estimated_cost_usd = Column(Float, nullable=False)
    recovery_time_hours = Column(Float, nullable=False)
    downtime_hours = Column(Float, nullable=False)
    
    # Safety & Operational Flags
    loto_required = Column(Boolean, default=True)
    safety_requirements = Column(JSON, default=list) # list of safety strings
    
    # Parts & Turn-by-Turn Procedures
    required_parts = Column(JSON, default=list) # [{partNo, name, inStock, leadTimeDays, costUsd}]
    procedure_steps = Column(JSON, default=list) # [{stepNumber, title, description, estimatedMinutes, toolsRequired, safetyCheck}]
    
    # Expected Outcomes & Tradeoffs
    expected_outcome = Column(JSON, default=dict) # {healthGainPercent, rulExtensionDays, riskReductionPercent}
    efficiency_impact_percent = Column(Float, default=0.0)
    recommendation_score = Column(Float, default=90.0)
    is_recommended = Column(Boolean, default=False)
    tradeoffs = Column(JSON, default=dict) # {pros: [], cons: []}
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    fault = relationship("DetectedFault", back_populates="repair_strategies")
    simulation_results = relationship("SimulationResult", back_populates="strategy", cascade="all, delete-orphan")
