from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.repair import RepairStrategy
from app.services.repair_engine import repair_engine
from app.schemas.repair import RepairStrategySchema
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/repair", tags=["Repair Strategies"])

@router.get("/strategies", response_model=StandardResponse[List[RepairStrategySchema]])
def list_repair_strategies(fault_id: str = "FLT-2026-891", db: Session = Depends(get_db)):
    """Retrieves 3-5 structured repair procedures and warehouse part checks."""
    strategies = repair_engine.generate_strategies({"faultId": fault_id})
    return StandardResponse(
        success=True,
        data=[RepairStrategySchema(**s) for s in strategies]
    )

@router.get("/strategies/{strategy_id}", response_model=StandardResponse[RepairStrategySchema])
def get_repair_strategy(strategy_id: str, fault_id: str = "FLT-2026-891"):
    """Returns procedure checklist, tools, and safety constraints for a repair plan."""
    strategies = repair_engine.generate_strategies({"faultId": fault_id})
    found = next((s for s in strategies if s["id"] == strategy_id), None)
    if not found:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Strategy '{strategy_id}' not found.")
    return StandardResponse(success=True, data=RepairStrategySchema(**found))
